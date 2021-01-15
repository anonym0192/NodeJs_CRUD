 const mongoose = require('mongoose');
 const slug = require('slug');

 mongoose.Promise = global.Promise;
 let ObjectId = mongoose.Schema.Types.ObjectId;

 const schema = new mongoose.Schema({
    photo: String,
    title: {
        type: String,
        trim: true,
        required: "The title field is required"
    },
    body: {
        type: String,
        trim: true
    }, 
    slug: String,
    tags: [String],
    author: {
        type: ObjectId,
        ref: 'User'
    }
 });

 schema.statics.getTags = function(){

    return this.aggregate([
        {$unwind: '$tags'},
        {$group: {_id: '$tags', count: {$sum: 1}}},
        {$sort: {count: -1}}
    ]);

 };

 schema.statics.getPosts = function(filter){

    return this.find(filter).populate('author');
     /*return this.aggregate([
         {$match: filter},
         {$lookup: {
             from: 'users',
             let:{'author': '$author'},
             pipeline: [
                 {
                     $match: {$expr: {$eq: ['$$author', '$_id'] }},    
                 },
                {$limit: 1}
             ],
             as: 'author'
            }
         },
         { $addFields: {
             'author': { $arrayElemAt: ['$author', 0]}
         }}

    ]); */
 }

 schema.pre('save', async function(next){

    if(this.isModified('title')){
        this.slug = slug(this.title, {lower: true});

        slugRegExp = new RegExp(`^(${this.slug})((-[0-9]{1,}$)?)$`, 'i');

        const postsWithSlug = await this.constructor.find({slug: slugRegExp});  

        if(postsWithSlug.length > 0){
            this.slug = `${this.slug}-${postsWithSlug.length + 1}`;
        }
    }
    next();
 });

 module.exports = mongoose.model('Post', schema);