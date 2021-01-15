const mongoose = require('mongoose');
const Post = require('../models/Post');
const User = require('../models/User');

exports.delete = async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect('/');
};

exports.view = async (req, res) => {

    const post = await Post.findOne({slug: req.params.slug});

    const author = await User.findById(post.author);

    const data = post._doc;

    data.author = {
        id: author._id,
        name: author.name,
        email: author.email
    };
 
    res.render('view', data);
};

exports.add = (req, res) => {
    res.render('postAdd');
};

exports.addAction = async (req, res) => {
    
    req.body.tags = req.body.tags.split(',').map(i=>i.trim());
    try{
        req.body.author = req.user._id;
        const post = new Post(req.body);
        await post.save();
        req.flash('success', 'The Post was saved successfully');
    }catch(e){
        req.flash('error', 'Sorry, there was an error in the saving process, please try again later');
        return res.redirect('/post/add');
    }
    res.redirect('/');
};

exports.edit = async (req, res) => {

    const post = await Post.findOne({slug: req.params.slug});
    res.render('postEdit', post);
};

exports.editAction = async (req, res) => {

    req.body.author = req.user._id;
    req.body.slug = require("slug")(req.body.title);

    req.body.tags = req.body.tags.split(',').map(i=>i.trim());


    try{
          await Post.findOneAndUpdate(
                    {slug: req.params.slug},
                    req.body,
                    {new: true, runValidators: true}
                );
        req.flash('success', 'The Post was updated successfully!');
    }catch(e){
        req.flash('error', 'Error :'+e.message);
    }
    res.redirect('/');

};