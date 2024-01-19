const {sentimentAnalysisSingular} = require('./sentimentAnalysisSingular');

async function subredditValues (postData) {
    const values = [];
    let totalPostScore = 0;
    let averagePostScore = 0;
    let commentsTotal = 0;
    let positiveCommentsCount = 0;
    let neutralCommentsCount = 0;
    let negativeCommentsCount = 0;
    let postsTotal = 0;

    for (post of postData) {
        totalPostScore += post.totalPostSentimentScore;
        averagePostScore += post.averagePostSentimentScore;
        commentsTotal += post.commentsCount;
        postsTotal += 1;

        for (comment of post.comments) {
            if (await sentimentAnalysisSingular(comment) >= '0.250') {
                positiveCommentsCount += 1;
            };
            if (await sentimentAnalysisSingular(comment) <= '0.249' && await sentimentAnalysisSingular(comment) >= '-0.249') {
                neutralCommentsCount += 1;
            };
            if (await sentimentAnalysisSingular(comment) <= '-0.250') {
                negativeCommentsCount += 1;
            };
        };
    };
    
    values['totalPostScore'] = totalPostScore.toFixed(2);
    values['averagePostScore'] = (totalPostScore / commentsTotal).toFixed(2);
    values['commentsTotal'] = commentsTotal;
    values['positiveCommentsCount'] = positiveCommentsCount;
    values['neutralCommentsCount'] = neutralCommentsCount;
    values['negativeCommentsCount'] = negativeCommentsCount;
    values['postsCount'] = postsTotal;
    values['commentPositivityIndex'] = (positiveCommentsCount / commentsTotal * 100).toFixed(2);
    values['commentNegativityIndex'] = (negativeCommentsCount / commentsTotal * 100).toFixed(2);
    values['mostPositiveComment'] = postData.subredditMostPositiveComment;
    values['mostPositiveCommentScore'] = postData.subredditMostPositiveCommentScore.toFixed(2);
    values['mostNegativeComment'] = postData.subredditMostNegativeComment;
    values['mostNegativeCommentScore'] = postData.subredditMostNegativeCommentScore.toFixed(2);

    return values;
};

module.exports = {subredditValues};