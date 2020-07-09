const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bcrypt = require('bcryptjs')
const router = express.Router();
const User = require('../../models/users.js');
const joi = require('@hapi/joi');

const schema = joi.object({
    name:joi.string().min(3).max(20).required(),
    email:joi.string().required().email(),
    password:joi.string().max(100).required()
})

router.post('/', async (req,res)=>{

    const {name,email} = req.body

    const validation = schema.validate(req.body)

    const checkError = details => {
        if (details==='"email" must be a valid email') {
            res.json({msg:'email does not exist',type:'error'});
        } else {
            res.json({msg:details, type:'error'});
        }
    }

    if(validation.error) return checkError(validation.error.details[0].message);
    
    const isUserWithSameName = await User.findOne({name}); 

    if(isUserWithSameName) return res.json({msg:'name already taken',type:'error'});

    const isUserWithSameEmail = await User.findOne({email}); 

    if(isUserWithSameEmail) return res.json({msg:'email already exist',type:'error'});
    
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.password, salt, async function (err, hash) {
            const newUser = await new User ({
                name,
                email,
                password: hash,
                avatar:'/static/media/defaultpic.eae74d36.svg',
                chats: []
            })
            newUser
            .save()
            .then(()=>{ res.json( {msg:'registered successfully',type:'success'})} )
            .catch((e)=>{ res.json( {msg:'something went wrong, please try again later',type:'error'})} )
        });
    });
        
        

})

module.exports = router