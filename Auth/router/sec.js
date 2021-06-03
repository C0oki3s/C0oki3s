const router = require("express").Router()
const User = require("../model/User")
const verify = require("./private")

router.get('/',verify,(req,res)=>{
    res.json({hi: {flag: "CTF{hi_there_my_frd}"}})
})
router.get('/admin',verify,async(req,res)=>{
    try{
        await User.find({},(err,docs)=>{
            if(!err){
                res.json(docs)
            }else{
                res.json(err)
            }
        })
    }catch(err){
        res.json(err)
    }
    
})

module.exports =router