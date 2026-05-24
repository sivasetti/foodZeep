const authService = require('./auth.service');



register = async (req, res, next) => {
    try{
        const result = await authService.registerUser(req.body);

        res.status(201).json({
            message : `User ${req.body.name} is registered successfully`,
            data : result
        });
    }
    catch(err){
        next(error)
    }
}

getUsersAll = async (req, res, next) => {
    try{
        const result = await authService.getUsers();

        res.status(200).json(
            {
                message : `Users fetched`,
                data : result
            });

        }
        catch(error){
            next(error)
        }
}



login = async (req, res, next) => {
    try{
        const result = await authService.login(req.body);
        
        //put the refresh token inside the secure HTTP-Only cookie 

        res.cookie('refreshToken', result.refreshToken, {
            httpOnly : true, //safeguard against hacker scripts
            secure : process.env.NODE_ENV === 'production',
            expires : result.expiresAt, //Deletes automatically in 7 days
            sameSite : 'Lax'
        })

        return res.status(200).json({
            success : true,
            message : `Login successfull`,
            data : result
        });
    }
    catch(error){
        next(error)
    }

}
    



module.exports = {register, getUsersAll, login};