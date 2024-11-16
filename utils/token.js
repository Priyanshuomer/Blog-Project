const jwt = require("jsonwebtoken");
const key = "hello%^$#72532";

function generateTokenForUser(user)
{
    return jwt.sign({
        _id:user._id,
        email:user.email,
        profileURL:user.profilePhotoUrl,
        role:user.roles,
        fullName:user.fullName

    },key);
}


function getUserByToken(token)
{
    if(!token) return null;
    try{
        return jwt.verify(token,key);
    }
    catch(error){
        console.log("error");
        return null;
    }
}


module.exports = {
    generateTokenForUser,
    getUserByToken

}