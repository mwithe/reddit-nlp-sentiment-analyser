const { UpdateCommand } = require ("@aws-sdk/lib-dynamodb");
const { DynamoDBClient, ListTablesCommand, CreateTableCommand, PutItemCommand, ScanCommand, UpdateItemCommand, GetItemCommand, DescribeTableCommand} = require("@aws-sdk/client-dynamodb");
const { post } = require("../routes");

  // Initialize db client region ( local testing )
const client = new DynamoDBClient({
    region: 'ap-southeast-2', // set region - Used for local dev might not be needed on ec2.
    });

async function createTable(tablename, Table_Input) {
    try {
    const listCommand = new ListTablesCommand({Limit: 50});
    const response = await client.send(listCommand);
    const dbExists = response.TableNames.includes(tablename);
    let status = 'CREATING'
          // Check if DB exists, creates one, waits for it to be active and creates a sentiment_score value.
if (!dbExists) {
    // Create the table and wait for it to be created
    const createTableCommand = new CreateTableCommand(Table_Input);
    await client.send(createTableCommand);

    while(status != 'ACTIVE'){
      const describe_command = new DescribeTableCommand({TableName: tablename,});
      const table_status = await client.send(describe_command);
      console.log('Waiting for DB Creation')
      if (table_status.Table.TableStatus == 'ACTIVE'){
        status = 'ACTIVE'
        console.log('DB Created Successfully')
        // const putCommand = new PutItemCommand(sentiment_score_input);
        // await client.send(putCommand);
        }
      } 
    }
}catch (error) {
   console.log(error)
  }};

//         "NS": [postData.values.totalPostScore, postData.values.averagePostScore, 
async function storeOverview(postData, tablename) {
  const put_input = {
    "Item": {
      "id": {
        "S": "Overview_" + postData.subreddit 
      },
      "subreddit": {
        "S": postData.subreddit
      },
      "type": {
        "S": "Overview"
      },
      "source": {
        "S": postData.source
      },
      "totalPostScore": {
        "N" : postData.values.totalPostScore
      },
      "averagePostScore": {
        "N" : postData.values.averagePostScore
      },
      "commentsTotal": {
        "N" : postData.values.commentsTotal.toString()
      },
      "positiveCommentsCount": {
        "N" : postData.values.positiveCommentsCount.toString()
      },
      "neutralCommentsCount": {
        "N" : postData.values.neutralCommentsCount.toString()
      },
      "negativeCommentsCount": {
        "N" : postData.values.negativeCommentsCount.toString()
      },
      "postsCount": {
        "N" : postData.values.postsCount.toString()
      },
      "commentPositivityIndex": {
        "N" : postData.values.commentPositivityIndex
      },
      "commentNegativityIndex": {
        "N" : postData.values.commentNegativityIndex
      },
      "mostPositiveComment" : {
        "S" : postData.values.mostPositiveComment
      },
      "mostPositiveCommentScore" : {
        "N" : postData.values.mostPositiveCommentScore
      },
      "mostNegativeComment" : {
        "S" : postData.values.mostNegativeComment
      },
      "mostNegativeCommentScore" : {
        "N" : postData.values.mostNegativeCommentScore
      }
    },
    "ReturnConsumedCapacity": "TOTAL",
    "TableName": tablename,
  };

  const putCommand = new PutItemCommand(put_input);
  await client.send(putCommand);
}

async function storePost(singlePost, tablename, subreddit, source) {

  const put_input = {
    "Item": {
      "id": { "S": 'post_' +  singlePost.id },
      "subreddit" : {"S": subreddit},
      "source" : {"S": source},
      "type" : {"S": 'post'},
      "postID": { "S": singlePost.id },
      "title": { "S": singlePost.title },
      "totalPostSentimentScore": { "N": singlePost.totalPostSentimentScore.toString() },
      "averagePostSentimentScore": { "N": singlePost.averagePostSentimentScore.toString() },
      "commentsCount": { "N": singlePost.commentsCount.toString() },
      "mostPositiveComment": { "S": singlePost.mostPositiveComment },
      "mostPositiveCommentScore": { "N": singlePost.mostPositiveCommentScore.toString() },
      "mostNegativeComment": { "S": singlePost.mostNegativeComment },
      "mostNegativeCommentScore": { "N": singlePost.mostNegativeCommentScore.toString() }
    },
    "ReturnConsumedCapacity": "TOTAL",
    "TableName": tablename,
  };
  const putCommand = new PutItemCommand(put_input);
  await client.send(putCommand);
  }

  async function storeSinglePerson(personData, tablename, subreddit, source) {
    const put_input = {
      "Item": {
        "id": { "S": 'person_' +  personData.name },
        "subreddit" : {"S": subreddit},
        "source" : {"S": source},
        "type": { "S": 'person' },
        "name": { "S": personData.name },
        "mentions": { "N": personData.mentions.toString() },
        "total": { "N": personData.total },
        "average": { "S": personData.average.toString() },
      },
      "ReturnConsumedCapacity": "TOTAL",
      "TableName": tablename,
    };
    const putCommand = new PutItemCommand(put_input);
    await client.send(putCommand);
    }


 


async function queryDB(input) {
// Define the query parameters
const command = new ScanCommand(input);
  
const response = await client.send(command);
return response;
};








  module.exports = {
    createTable,
    storeOverview,
    storePost,
    storeSinglePerson,
    queryDB
  };
  