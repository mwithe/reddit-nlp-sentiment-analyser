const { sentimentAnalysisSingular } = require('../components/sentimentAnalysisSingular');


//This function iterates over the names identified in the list, searches all comments for matches, and then creates a tally for each name of
//mentions, sentiment score and average score.

async function nerSentimentAnalysis (people, data) {
    const peopleSentimentScores = [];
    for (const name of people) {
        let mentions = 0;
        let sentimentScoreTotal = 0;
        let sentimentScoreAverage = 0;

        for (let i = 0; i < data.length; i++){                     //Iterate over each post in posts from reddit
        for (let x = 0; x < data[i].comments.length; x++) {         //Iterate over each comment of post
            if ((data[i].comments[x]).toUpperCase().includes(name)) {
                let commentScore = await sentimentAnalysisSingular(data[i].comments[x]);
                sentimentScoreTotal += commentScore;
                mentions += 1;
            };
            };
        };
        sentimentScoreAverage = (sentimentScoreTotal / mentions);
        peopleSentimentScores.push ({'name': name, 'mentions': mentions, 'total': sentimentScoreTotal.toFixed(2), 'average': sentimentScoreAverage.toFixed(2) })
        };
    return peopleSentimentScores;
};

module.exports = {nerSentimentAnalysis};