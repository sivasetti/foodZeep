const authService = require('./auth.service');



register = async (req, res) => {
    try{
        const result = await authService.registerUser(req.body);

        res.status(201).json({
            message : `User ${req.body.name} is registered successfully`,
            data : result
        });
    }
    catch(err){
        res.status(400).json({
            error : err.message
        });
    }
}

getUsersAll = async (req, res) => {
    try{
        const result = await authService.getUsers();

        res.status(200).json(
            {
                message : `Users fetched`,
                data : result
            });

        }
        catch(err){
            res.status(400).json({
                message : `Unable to fetch Users`,
                error : err
            });
        }
}



login = async (req, res) => {
    try{
        const result = await authService.login(req.body);

        res.status(200).json({
            message : `Login successfull`,
            data : result
        });
    }
    catch(error){
        res.status(400).json({
            message : `Unable to login`,
            error : error.message
        });
    }

}
    



module.exports = {register, getUsersAll, login};