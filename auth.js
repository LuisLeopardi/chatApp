const jwt = require("jsonwebtoken");
require('dotenv').config()

const auth = async (req, res, next) => {
/*
  const {token} = req.session;
    
  if(!token) return res.status(400).send(false);
  
  const decoded = await jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {

    if (err) return res.status(400).send(false);

    res.locals.token = decoded;
    next();

  });
*/
};

module.exports = auth;