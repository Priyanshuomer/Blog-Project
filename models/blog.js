const {Schema,model} = require("mongoose");
const blogSchema = new Schema({
    title:{
       type:String,
       required:true
    },
    content:{
        type:String,
        required:true
    },
    coverURL:{
        type:String,
        default:"https://th.bing.com/th/id/OIP.dHkU45mngpVrEyei1ewKkAAAAA?w=412&h=530&rs=1&pid=ImgDetMain"
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref:"user"
    }
},{timestamps:true});



const blogModel = model("blog",blogSchema);

module.exports = blogModel;


