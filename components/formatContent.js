const { getRedditPost, getRedditPostComments } = require('./redditApi');


//This function calls both the API calls, which return the data in the format I've been using, and combines them into a single array.
//Removes undefined variables in comments with .pop()
async function getStructuredPostData (subreddit) {
    const formattedContent = [];

    const postIdTitles = await getRedditPost(subreddit);
    for (let i = 0; i < postIdTitles.length; i++) {
      formattedContent.push({'id': postIdTitles[i].id, 'title': postIdTitles[i].title})
    };

    const postComments = await getRedditPostComments(subreddit, postIdTitles);
    for (let i = 0; i < postComments.length; i++) {
      if (postComments[i].includes(undefined)) {
        postComments[i].pop();
      };
      formattedContent[i]['comments'] = postComments[i];
    };
    
    return formattedContent;
  };

  module.exports = {getStructuredPostData};