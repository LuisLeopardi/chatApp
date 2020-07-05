const auth = require('../../auth')
const router = require('express').Router();
const mongoose = require('mongoose')
const User = require('../../models/users')

router.post('/', auth, (req,res)=>{
    if (req.body.function === 'changeAvatar') {
       const {username, profileAvatar} = req.body
        User.updateOne({name:username}, { avatar:profileAvatar })
        .then(()=>res.status(200).send(true))
        .catch(()=>res.status(400).send(false)) 
    }

    if (req.body.function === 'changeUsername') {
        const {username, usernameToChange} = req.body
         User.updateOne({name:username}, { name:usernameToChange })
         .then(()=>res.status(200).send(true))
         .catch(()=>res.status(400).send(false)) 
     }
    
})

router.get('/', async (req,res)=>{
    if (!res.locals.token) return res.status(400).send(false);
    const user = await User.findById(res.locals.token.id)
    const { name, avatar } = user
    res.send({username:name, avatar})
})

module.exports = router;