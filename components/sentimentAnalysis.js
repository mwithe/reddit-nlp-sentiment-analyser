const { SentimentAnalyzer } = require('node-nlp');
const sentiment = new SentimentAnalyzer({ language: 'en' });


//Sentiment analysis function for data that matches the formatted data.
async function sentimentAnalysis (data) {
    let subredditMostPositiveCommentScore = 0;
    let subredditMostNegativeCommentScore = 0;
    let subredditMostPositiveComment = '';
    let subredditMostNegativeComment = '';    

    for (let i = 0; i < data.length; i++) {
        let postSentimentScore = 0;
        let commentsCount = 0;
        let mostPositiveCommentScore = 0;
        let mostNegativeCommentScore = 0;
        let mostPositiveComment = '';
        let mostNegativeComment = '';        

        for (const comment of data[i].comments) {
        if (comment !== undefined) {
            const result = await sentiment.getSentiment(comment);
            postSentimentScore += result.score;
            commentsCount += 1;

            if (result.score > mostPositiveCommentScore) {
                mostPositiveCommentScore = result.score;
                mostPositiveComment = comment;
            };
            
            if (result.score < mostNegativeCommentScore) {
                mostNegativeCommentScore = result.score;
                mostNegativeComment = comment;
            };

            if (result.score > subredditMostPositiveCommentScore) {
                subredditMostPositiveCommentScore = result.score;
                subredditMostPositiveComment = comment;
            };
            
            if (result.score < subredditMostNegativeCommentScore) {
                subredditMostNegativeCommentScore = result.score;
                subredditMostNegativeComment = comment;
            };

        };
    };
    const averagePostSentiment = (postSentimentScore / data[i].comments.length).toFixed(2);
    data[i]['totalPostSentimentScore'] = postSentimentScore;
    data[i]['averagePostSentimentScore'] = averagePostSentiment;
    data[i]['commentsCount'] = commentsCount;
    data[i]['mostPositiveComment'] = mostPositiveComment;
    data[i]['mostPositiveCommentScore'] = mostPositiveCommentScore;
    data[i]['mostNegativeComment'] = mostNegativeComment;
    data[i]['mostNegativeCommentScore'] = mostNegativeCommentScore;
    };
    
    data['subredditMostPositiveComment'] = subredditMostPositiveComment;
    data['subredditMostPositiveCommentScore'] = subredditMostPositiveCommentScore;
    data['subredditMostNegativeComment'] = subredditMostNegativeComment;
    data['subredditMostNegativeCommentScore'] = subredditMostNegativeCommentScore;
    return data;
};

module.exports = {sentimentAnalysis};