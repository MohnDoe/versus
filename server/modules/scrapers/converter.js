function convertToMadame(tumblrPost) {
    return {
        tumblrID: tumblrPost.id,
        postURL: tumblrPost.post_url,
        date: tumblrPost.date,
        timestamp: tumblrPost.timestamp,
        tumblrShotURL: tumblrPost.short_url,
        summary: tumblrPost.summary,
        caption: tumblrPost.caption,
        imagePermalink: tumblrPost.image_permalink,
        imageURL: tumblrPost.photos[0].original_size.url,
        imageWidth: tumblrPost.photos[0].original_size.width,
    }
}

module.exports = {
    convertToMadame
}