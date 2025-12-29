import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
    try {
        let {token}= req.cookies
        if(!token){
            return res.status(401).json({message:"Unauthorized no token"})
        }
        
        let verifytoken= await jwt.verify(token, process.env.JWT_SECRET)
        if(!verifytoken){
            return res.status(401).json({message:"Unauthorized invalid token"})
        }
        req.userId= verifytoken.userId
        next()
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        return res.status(401).json({message:"Unauthorized"})
    }
}
export default isAuth;
