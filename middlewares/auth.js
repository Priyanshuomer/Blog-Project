const {getUserByToken} = require("../utils/token.js")

function checkUserAuthentication(cookieValue){
    return (req,res,next) => {
        const token = req.cookies[cookieValue];
        
        if(!token)
        {
            return next();
        }
            

         try{
            const user = getUserByToken(token);
            req.user = user;
         }catch(error)
         {
            console.log("Token Error");
        }

         return next();

    }

}


module.exports = checkUserAuthentication;