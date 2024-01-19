var express = require('express');
var router = express.Router();

const redis = require("redis");
const {createRedisClient} = require('../components/redisClient');
const {getStructuredPostData} = require('../components/formatContent');


const {namedEntityRecognition} = require('../components/ner');
const {nerSentimentAnalysis} = require('../components/nerSentimentAnalysis');
const { sentimentAnalysis } = require('../components/sentimentAnalysis');
const {sortDescending} = require('../components/sortDescending.js');
const {subredditValues} = require('../components/subredditValues')
const {databasePostFormatting} = require('../components/databasePostFormatting');

const {getRedditPost, getRedditPostComments} = require('../components/redditApi');

const { render } = require('../components/render.js');
const { createTable,storeOverview, queryDB, storePost, storeSinglePerson} = require('../components/createDB.js');
const { post } = require('./index.js');


// Dynamo Constants
const tablename = 'cab432assignment2'; //DynamoDB TableName
const subreddit = 'popular';

// DYNAMODB PARAMS
const input = {
  TableName: tablename, // Specify the table name as '432Reddit'
  FilterExpression: "#attrName = :attrValue", // Define the filter expression
  ExpressionAttributeNames: {
    "#attrName": "subreddit", // Placeholder for the attribute name 'subreddit'
  },
  ExpressionAttributeValues: {
    ":attrValue": {
      S: subreddit, // Placeholder for the attribute value 'popular'
    },
  },
};

// DynamoDB Inputs
const Table_Params = {
  "AttributeDefinitions": [
    {
      "AttributeName": "id",
      "AttributeType": "S"
    },
  ],
  "KeySchema": [
    {
      "AttributeName": "id",
      "KeyType": "HASH"
    },
  ],
  "ProvisionedThroughput": {
    "ReadCapacityUnits": 5,
    "WriteCapacityUnits": 5
  },
  "TableName": tablename,
};

/* GET users listing. */
router.get('/:subredditSearch', async function(req, res, next) {
    const url = req.params;
    //console.log('URL: ', url);
    //console.log('Query: ', req.query.subredditName);
    const subreddit = req.query.subredditName;

    let data;
    let storableData = [];


    //Redis
    const redisClient = redis.createClient();
    (async () => {
        try {
          await  redisClient.connect();  
        } catch (err) {
          console.log(err);
        }
    })();

    const redisKey = `subreddit:${subreddit}`;
    const result = await redisClient.get(redisKey);

    if (result) {
      console.log('Found in Redis, calling...')
      const resultJSON = JSON.parse(result);
      //console.log('Redis Result: ', resultJSON);
      data = resultJSON;
      //console.log('Data: ',data);
      //res.json(resultJSON);
    
    } 
    else {
    // Create Table
    createTable(tablename, Table_Params);

    const inital_response = await queryDB(input);

    // Add date condition on overview?
    if (inital_response.Items.length != 0){
      console.log('Found in DynamoDB, calling...');
      const result = render(inital_response);

      res.render('indexoriginal', { people: result.people, posts: result.posts, overview : result.overview[0], subreddit : subreddit,  });
        }

        else {
          console.log('Calling APIs...');
          storableData = [];
          valuesObject = {};
    
          const response = await getRedditPost(subreddit);
          //console.log('Getting Subreddit Posts')
    
          const response2 = await getRedditPostComments(subreddit, response);
          //console.log('Getting Subreddit Comments');
    
          const commentsAnalysed = await sentimentAnalysis(response2);
    
          const peopleMentioned = namedEntityRecognition(response2);
    
          const peopleAnalysed = await nerSentimentAnalysis(peopleMentioned, response2);
    
          sortDescending(peopleAnalysed, 'mentions');
    
          const subRedditValues = await subredditValues(commentsAnalysed);
    
          const postRows = databasePostFormatting(commentsAnalysed);
    
          //console.log('Post Rows: ', postRows);
          //console.log('response2: ', response2)
    
          for (value in subRedditValues) {
            valuesObject[`${value}`] = subRedditValues[[`${value}`]];
          };
    
          //console.log('ValuesObject: ', valuesObject);
    
          storableData['title'] = subreddit;
          storableData['source'] = 'Reddit API';
          storableData['values'] = valuesObject;
          storableData['posts'] = postRows;
          storableData['people'] = peopleAnalysed;
    
          data = storableData;
    
          const responseJSON = response2;
          redisClient.setEx(
            redisKey,
            3600,
            JSON.stringify({source: 'Redis Cache', ...storableData})
          );
          
          //res.json({source: 'Reddit APIs', ...responseJSON});
        }
    
        //const postData = await getStructuredPostData(subreddit); 
        
        //console.log('Data2: ',data);
    
      res.render('index', {data: data} );
    }
    
    
});



//This is my best attempt at accessing the data from the input field (no success, able to get the value to this document at least.)
router.post ('/:subredditSearch', async function(req, res, next) {
    let searchTerm = req.body.subredditSearch;
    console.log('inside: ', searchTerm);
  });

module.exports = router;
