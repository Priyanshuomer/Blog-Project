const {Router} = require("express");
const userModel = require("../models/user.js");
const blogModel = require("../models/blog.js");
const multer = require("multer");
const path = require("path");
const {createHmac,randomBytes} = require("crypto");
const {generateTokenForUser} = require("../utils/token.js")

const router = Router();




  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(__dirname, "../public/profiles/"));
    },
    filename: function (req, file, cb) {
      const name = Date.now() + '-' + file.originalname;
      cb(null, name); // Save the file with the unique filename
    }
  });

  const upload = multer({ storage: storage });








router.get("/", async (req,res) => {


  const blogs = [];
  let blog = await blogModel.findOne({}).populate("createdBy");
  
  while (blog) {
      blogs.push(blog);  
      blog = await blogModel.findOne({  _id: { $gt: blog._id } }).populate("createdBy");  
  }


    res.render("homePage",{
      indiBlogs:blogs ,
        user:req.user
    });
});

router.get("/u/changepassword",(req,res) => {
  return res.render("change-password",{
    user:req.user
  });
})

router.get("/logout",(req,res) => {
    return res.clearCookie("uid").redirect("/");
})

router.post("/u/changepassword",async (req,res) => {
  if(!req.user)
    return res.redirect("/signin");
   const currentPassword = req.body.current;
   const newPassword = req.body.new;
   const email = req.user.email;



   const user = await userModel.findOne({email});

   if(!user) 
    return res.render("change-password",{
    error : "Something is Wrong , Please try again", 
    user:req.user
  });

   const salt = user.salt;

   const hashedPassword = user.password;

   const userGivenHashedPassword = createHmac("sha256",salt)
   .update(currentPassword)
   .digest("hex");



    if(userGivenHashedPassword !== hashedPassword)
    {
      return res.render("change-password",{
        error : "Something is Wrong , Please try again" ,
          user:req.user});
    }

    const newHashedPassword = createHmac("sha256",salt)
    .update(newPassword)
    .digest("hex");

    await userModel.findOneAndUpdate(
      { email : email },                    
      { $set: { password: newHashedPassword } },   
    );

   user.password = newHashedPassword;

  req.user = user;


  return res.render("change-password",{
      done : "Password Changed Successfully!!",
             user:req.user});
   


});




router.get("/u/profile",(req,res) => {
  return res.render("userProfile",{   
        user:req.user
    })
});




router.get("/signup",(req,res) => {
    res.render("signupPage");
});

router.get("/signin",(req,res) => {
    res.render("signinPage");
});


router.post("/signin" , async (req,res) => {
    const {email,password} = req.body;
   try{
    const token = await userModel.matchPasswordAngGenerateToken(email,password);
        return res.cookie("uid",token).redirect("/");
   }
   catch(error){
    res.render("signinPage",{
        error:"INCORRECT PASSWORD OR EMAIL"
    })
   }
});

router.post("/signup",upload.single("profilepic"), async (req,res) => {
const {fullName,email,password,profilepic} = req.body;
if(!fullName || !email || !password)
    return res.render("signupPage",{
  error :"Please fill all required fields"});

  let filePath = undefined;
     if(req.file)
    filePath = path.join("/profiles", req.file.filename);


await userModel.create({
    fullName,
    email,
    password,
    profilePhotoUrl:filePath
});

return res.redirect("/signin");
});



module.exports = router;