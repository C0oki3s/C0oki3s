const express = require("express")
const User = require("../model/User")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {registerValidation, LoginValidation} = require("../validation")

route = express.Router()


route.post('/register',async(req,res)=>{
    //Validate when create 
    const { error } = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    //Checking the User email exists
    const Emailexists = await User.findOne({email: req.body.email})
    if(Emailexists) return res.status(400).send("Email alredy exists")

    //hashpassword
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(req.body.password, salt)

    //If no error create Data base
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });
    try{
        const Save = await user.save()
        res.send(`Created account with ${Save.name} And ID is ${{user:user._id}}`)
    }catch(err){
        res.status(400).send(err)
    }
})

//Login
route.post('/login',async(req,res)=>{
    //Validate The user
    const { error } = LoginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    //Checking the User Not email exists
        const user = await User.findOne({ email: req.body.email })
        if(!user) return res.status(400).send("Email Not exists Please <a href='/api/user/register'>Create One</a>")
        
        //Password check
        const validpass = await bcryptjs.compare(req.body.password, user.password)
        if(!validpass) return res.status(401).send("Email or password is wrong")
    //Assign A Token!
    const token = jwt.sign({_id: user._id},process.env.Token_sec)
    res.header('Authorization',token).send("Sucess")

})

module.exports = route
