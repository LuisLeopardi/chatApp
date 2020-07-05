const User = require('../../models/users.js')
const bcrypt = require('bcryptjs')
const router = require('express').Router();
const jwt = require('jsonwebtoken');
require('dotenv').config()

router.post('/', (req,res)=>{

  const {email,password} = req.body

  const login = async () => {

    const user = await User.findOne({ email });

    if (user == null) return res.status(400).send({msg:'wrong email or password',type:'error'})

    const isUser = await bcrypt.compare(password, user.password);

    const token = jwt.sign({ id:user._id}, process.env.TOKEN_SECRET);

    if (isUser) {
      if(req.session.token){
        req.session.token = token
      }else{
        req.session.token = token
      }
      res.send(req.session)
    } else {
      res.status(400).send({msg:'wrong email or password',type:'error'})
    }
  }

  login()
  
})

module.exports = router