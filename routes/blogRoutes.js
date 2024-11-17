const blogModel = require("../models/blog.js");
const express = require("express");
const multer = require("multer");
const path = require("path");
const commentModel = require("../models/comment.js")



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      return cb(null, path.resolve("../BLOGGING/public/cover"));
    },
    filename: function (req, file, cb) {
      const name = Date.now() + '-' + file.originalname;
      return cb(null,name);
    }
  });
  
  const upload = multer({ storage : storage });


//   route.post("/add-cover-image",)


const route = express.Router();

route.get("/view/:id" , async (req,res) => {
  const blog = await blogModel.findById(req.params.id).populate("createdBy");
  const comments = await commentModel.find({commentedOn : req.params.id }).populate("commentedBy");
  res.render("viewBlog" , {
    blog,
    comments,
    user:req.user
  })
});

route.get("/delete/:id",async (req,res) => {
await blogModel.findByIdAndDelete(req.params.id);
let comment = await commentModel.findOneAndDelete({commentedOn : req.params.id});
while(comment)
{
  comment = await commentModel.findOneAndDelete({commentedOn : req.params.id , _id: { $gt: comment._id }});
}

 res.redirect("/blog/user");
})


route.post("/view/:id" , async (req,res) => {
    await commentModel.create({
      comment:req.body.comment,
      commentedBy:req.user._id,
      commentedOn:req.params.id
    });

    res.redirect(`/blog/view/${req.params.id}`)
});

route.get("/add",(req,res) => {
    res.render("blogPage",{
      user:req.user
    });
});


route.get("/user",async (req,res) => {
const userID = req.user._id;
const blogs = [];
let blog = await blogModel.findOne({createdBy : userID});

while (blog) {
    blogs.push(blog);  
    blog = await blogModel.findOne({ createdBy : userID, _id: { $gt: blog._id } });  
}
 



   console.log(blogs);
   res.render("userBlogs",{
    indiBlogs:blogs,
    user:req.user
}
);
});


route.post("/add",upload.single("coverImage"),async (req,res) => {
    const {title,des} = req.body;
     let filePath = undefined;
    if(req.file)
     filePath = path.join("/cover", req.file.filename);

    if(!title || !des)
        res.redirect("/blog",{
    error:"Title and Description are Required"
});

   await blogModel.create({
    title:title,
    content:des,
    coverURL:filePath,
    createdBy:req.user._id
   });

    res.redirect("/");
});


module.exports = route;
