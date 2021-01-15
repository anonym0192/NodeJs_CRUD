const mongoose = require('mongoose');
const Post = mongoose.model('Post');


exports.index = async (req, res) => {

    const results = {
        havePosts: false,
        posts: []
    };
    const tagFilter = req.query.t ? {tags: req.query.t} : {};

    /*Get all posts and tags from the database according to filter */
    let postsPromise = Post.getPosts(tagFilter);
    let tagsPromise = Post.getTags();

    const [posts, tags] = await Promise.all([postsPromise, tagsPromise]);

    //truncade the post body if it is too long
    posts.map(post=>{
        let body = post.body;
        if(body?.length > 50){
            post.body = body.slice(0, 50)+'...';
        }
    });

    /* Pass the appropriate class to the selected tag */
    for(let i in tags ){
        if(tags[i]._id == req.query.t){
            tags[i].class = 'selected';
        }
    }

    /* Mount the data that will be send to the view */
    results.posts = posts;
    results.havePosts = results.posts.length > 0 ? true : false;
    results.tags = tags;

    //console.log(posts);
    
    res.render('home', results);
};