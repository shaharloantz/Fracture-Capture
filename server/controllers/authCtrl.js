const User = require('../models/user')


const registerUser = async (req,res) => {
    
    try{
        const{name,email,password} = req.body;
        // Check if name was entered
        if (!name){
            return res.json({error: 'Name is required!'})
        }
        // Check if PW was entered valid
        if (!password || password.length < 6){
            return res.json({error: 'Password is required and with at least 6 chars!'})
        }
        // Check if Email is unique at DB
       const exist = await User.findOne({email});
       if (exist){
        return res.json({error: 'Email is already taken!'})
       }
       
       const user = await User.create({name,email,password})
       return res.json(user)

    }  catch(error){
        
        console.log('error when creating user: ',error)
    }
}

module.exports = {
    registerUser
}