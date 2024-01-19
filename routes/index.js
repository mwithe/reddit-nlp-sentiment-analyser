var express = require('express');
var router = express.Router();

// IMPORTS
const {getStructuredPostData} = require('../components/formatContent');
const {namedEntityRecognition} = require('../components/ner');
const {nerSentimentAnalysis} = require('../components/nerSentimentAnalysis');
const { sentimentAnalysis } = require('../components/sentimentAnalysis');
const {sortDescending} = require('../components/sortDescending.js');
const {subredditValues} = require('../components/subredditValues')
const {databasePostFormatting} = require('../components/databasePostFormatting');
const { SentimentAnalyzer } = require('node-nlp');
const { getRedditPost, getRedditPostComments } = require('../components/redditApi.js');




router.get('/', async function(req, res, next) {
  try {



    // Get Data from API

    // TODO Redis check?
    console.log('Calling APIs...');

    const subreddit = 'popular';
    const postData = await getRedditPost(subreddit);
    const commentsArray = await getRedditPostComments(subreddit, postData);



    // console.log(commentsArray);
    let storableData = [];
    let valuesObject = {};
 
  //Sentiment analysis (this function is set up specifically for the formatted data).
  const commentsAnalysed = await sentimentAnalysis(commentsArray);

  //Searches the comments for names
  const peopleMentioned = namedEntityRecognition(commentsArray);

  //Compares the names against comments to create an analysis for each person identified
  const peopleAnalysed = await nerSentimentAnalysis(peopleMentioned, commentsArray);

  //Sorts people mentioned in descending order
  sortDescending(peopleAnalysed, 'mentions');

  const subRedditValues = await subredditValues(commentsAnalysed);

  //Removes information not to be stored in db
  const postRows = databasePostFormatting(commentsAnalysed);
  for (value in subRedditValues) {
    valuesObject[`${value}`] = subRedditValues[[`${value}`]];
  }

  storableData['subreddit'] = subreddit;
  storableData['source'] = 'Reddit API';
  storableData['values'] = valuesObject;
  storableData['posts'] = postRows;
  storableData['people'] = peopleAnalysed;


  res.render('index', {data: storableData} );
  } catch (error) {
    // Handle errors here
    console.error('Error:', error);
  }
});

module.exports = router;