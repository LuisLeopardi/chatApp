const express = require('express');
const app = express();
const router = express.Router();
const auth = require('../../auth');
const User = require('../../models/users')

router.get('/', auth, async (req,res)=> {

    if (!res.locals.token) return /*res.status(404).json({user:null});*/res.json({user:null});
    const user = await User.findById(res.locals.token.id)
    const { name, avatar } = user
    //res.send({username:name, avatar})
    res.json({username:name, avatar})
})

router.post('/', auth, async (req,res)=> {

    if (!res.locals.token) return res.status(400).send(false);

    const {username, reciver} = req.body;

    const user = await User.findOne({name:username})

    const messages = user.chats.filter(chat=>
        chat._id === `${username}${reciver}` || `${reciver}${username}`
    )

    res.status(200).send(messages)
})


module.exports = router;