const axios = require('axios');
const fs = require('fs');

const CLIENT_ID = '';
const CLIENT_SECRET = '';
const USERNAME = '';
const PASSWORD = '';

const auth = {
  username: CLIENT_ID,
  password: CLIENT_SECRET,
};

const data = {
  grant_type: 'password',
  username: USERNAME,
  password: PASSWORD,
};

const headers = {
  'User-Agent': '',
};

async function getRedditPost(subreddit) {
  console.log('Getting Reddit Posts...');
  try {
    const response = await axios.post('https://www.reddit.com/api/v1/access_token', null, {
      params: data,
      auth: auth,
      headers: headers,
    });

    const TOKEN = response.data.access_token;
    headers['Authorization'] = `bearer ${TOKEN}`;

    const reddit_url = `https://oauth.reddit.com/r/${subreddit}`;

    const postsResponse = await axios.get(reddit_url, { headers });

    console.log(postsResponse)

    const posts = postsResponse.data.data.children;

    const postIdAndTitleArray = [];

    for (let i = 0; i < posts.length; i++) {
      postIdAndTitleArray.push({ 'id': posts[i].data.name, 'title': posts[i].data.title });
      postIdAndTitleArray[i].id = postIdAndTitleArray[i].id.replace('t3_', '');
    };

    return postIdAndTitleArray;
  } catch (error) {
    throw error;
  }
};

async function getRedditPostComments(subreddit, postIDs) {
  console.log('Getting Reddit Comments...');
  try {
    const commentsArrays = [];

    for (const post of postIDs) {
      const postId = post.id;
      // console.log('postId: ', postId);

      const reddit_url = `https://oauth.reddit.com/r/${subreddit}/comments/${postId}`;

      const commentResponse = await axios.get(reddit_url, { headers });

      const commentsData = commentResponse.data[1].data.children; // Comments are stored in data[1].data.children

      const validComments = commentsData
        .filter(comment => comment.data.body !== undefined)
        .map(comment => comment.data.body);

      if (validComments.length > 0) {
        const commentsArray = {
          id: postId,
          title: post.title,
          comments: validComments,
        };
        commentsArrays.push(commentsArray);
      }
    }
    //console.log('Comments Arrays, redditAPI.js: ', commentsArrays)
    return commentsArrays;
  } catch (error) {
    throw error;
  }
}



module.exports = {
  getRedditPost,
  getRedditPostComments
};
