const express = require('express');
const app = express();
const router = express.Router();

router.post('/',(req,res)=>{
    req.session.destroy()
})

module.exports = router;