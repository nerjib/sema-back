const express = require('express');
const moment = require('moment')

const router = express.Router();
const db = require('../dbs/index');


const getFire = async () => {
    const getfire = `select count (*) from  reports where incidence=$1`
    try {
      // const { rows } = qr.query(getAllQ);
      const { rows } = await db.query(getfire,['Fire']);
     
      return rows;
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        return ({ message: 'User with that EMAIL already exist' });
      }
      return (`${error} jsh`);
  
    }
}
const getFLood = async () => {
    const getflood = `select count (*) from  reports where incidence=$1`
    try {
      // const { rows } = qr.query(getAllQ);
      const { rows } = await db.query(getflood,['Flood']);
     
      return rows;
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        return ({ message: 'User with that EMAIL already exist' });
      }
      return (`${error} jsh`);
  
    }
}

router.get('/', async (req, res) => {
  const fire = await getFire()
  const flood = await getFLood()

     res.status(201).json({
         fire: fire[0].count,
         flood: flood[0].count
     })

});


module.exports = router;

