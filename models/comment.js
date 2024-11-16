const {Schema , model} = require("mongoose");


const commentSchema = new Schema({
    comment:{
        type:String,
        required:true
    },

    commentedBy :{
        type:Schema.Types.ObjectId,
        ref:"user"
    },
    commentedOn:{
        type:Schema.Types.ObjectId,
        ref:"blog"
    }
},{timestamps:true});


const commentModel = model("comment",commentSchema);

module.exports = commentModel;