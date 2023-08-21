const jwt=require('jsonwebtoken')

//middleware
//function with 3 arguments -req,res,next

const jwtMiddleware = (req, res, next) => {
    try {
        //access token from request header
        const token = req.headers["access_token"] //token from front end,if one cannot access token,run time error occurs,to solve this we use try catch. 
                                                  //to solve this we use try catch.possible error case inside try block and catch to solve it
        //validate token  - jwt - verify()
        jwt.verify(token,"secretkey123")    //output is true/false

        //if token is verified continue the request
        next()
    }
    catch {
        res.status(404).json("please login")
    }
}
module.exports=jwtMiddleware