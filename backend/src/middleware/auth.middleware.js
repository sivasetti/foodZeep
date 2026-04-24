const jwt = require('jsonwebtoken');


protect = async (req, res, next) => {
    try{
        let token;

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }
        
        if(!token){
            return res.status(401).json({
                message : 'Not Authorized, token missing'
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;
    

        next();
    }
    catch(error){
        return res.status(401).json({
            message : 'Not Authorized, invalid token',
            error : error.message
        });
    }
}



authorize = (...roles) => {
    try{
        return (req, res, next) => {

            if(!roles.includes(req.user.role)){
                return res.status(403).json({
                    message : 'Access Denied'
                })
            }
            next();
        }
    }
    catch(error){
        res.send(`error : `, error.message);
    }
}


module.exports = {
    protect,
    authorize
}