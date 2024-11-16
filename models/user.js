const {Schema,model} = require("mongoose");
const {createHmac,randomBytes} = require("crypto");
const {generateTokenForUser} = require("../utils/token.js")

const userSchema = new Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    salt:{
        type:String
    },
    password:{
        type:String,
        required:true
    },
    profilePhotoUrl:{
        type:String,
        default:"https://cdn3.iconfinder.com/data/icons/avatars-flat/33/man_5-1024.png"
    }
},{timestamps:true});


userSchema.pre("save",function(next) {
    const user = this;
    if(!user.isModified("password"))  return ;
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256",salt)
    .update(user.password)
    .digest("hex");

    this.salt = salt;
    this.password = hashedPassword;
    next();

});


userSchema.static("matchPasswordAngGenerateToken" , async function(email,password) {
       
    if(!email || !password)    
        throw new Error("Please fill all fields");

    const user = await this.findOne({email});

    if(!user) 
        throw new Error("INVALID USER");

    const salt = user.salt;

    const hashedPassword = user.password;

    const userGivenHashedPassword = createHmac("sha256",salt)
    .update(password)
    .digest("hex");

     if(userGivenHashedPassword !== hashedPassword)
        throw new Error("INVALID USER");

     return generateTokenForUser(user);


});


const userModel = model("user",userSchema);

module.exports = userModel;