const express = require('express');
const moment = require ('moment')
const router = express.Router();
const Helper = require('../../controllers/auth/helper');
const jwt = require('jsonwebtoken');
const db = require('../../dbs/index');



router.post('/', async (req, res) => {

  let word=(req.body.message).toLowerCase()
  let lword=(req.body.lmsg).toLowerCase()

  if(('hello hi').match(word)){
  return res.status(201).send('Hi welcome');
}
else if (word=='thank you'){
return res.status(201).send('You are welcome');
}
else if(word=='gg'){
  const token=Helper.generateToken({id:req.body.id,role:'admin'})
      return res.status(201).send('Come againk '+ token);
}
if(lword=='search'){
  const products ={id:1, name:'Car', price:100, location:'kld'}
    return res.status(201).send('Come againk '+ products.price)  
}

});

module.exports = router;
