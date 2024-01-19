function databasePostFormatting (commentsData) {
    const postItems = [];

    for (let i = 0; i < commentsData.length; i++) {
        const item = {
            'id': '',
            'title': '',
            'totalPostSentimentScore': 0,
            'averagePostSentimentScore': 0,
            'commentsCount': 0,
            'mostPositiveComment': '',
            'mostPositiveCommentScore': '',
            'mostNegativeComment': '',
            'mostNegativeCommentScore': '',
        };

        item.id = commentsData[i].id;
        item.title = commentsData[i].title;
        item.totalPostSentimentScore = commentsData[i].totalPostSentimentScore;
        item.averagePostSentimentScore = commentsData[i].averagePostSentimentScore;
        item.commentsCount = commentsData[i].commentsCount;
        item.mostPositiveComment = commentsData[i].mostPositiveComment;
        item.mostPositiveCommentScore = commentsData[i].mostPositiveCommentScore;
        item.mostNegativeComment = commentsData[i].mostNegativeComment;
        item.mostNegativeCommentScore = commentsData[i].mostNegativeCommentScore;

        postItems.push(item);
    };
    return postItems;
};

module.exports = {databasePostFormatting};