const { SentimentAnalyzer } = require('node-nlp');
const sentiment = new SentimentAnalyzer({ language: 'en' });

//Broad sentiment analysis function, likely used for any data that doesn't need to be iterated over.
async function sentimentAnalysisSingular (data) {
    let commentSentimentScore = 0;
    if (data !== undefined) {
        const result = await sentiment.getSentiment(data);
        commentSentimentScore += result.score;
    };
    return commentSentimentScore;
};

module.exports = {sentimentAnalysisSingular};