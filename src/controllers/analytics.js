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
         fire,
         flood
     })

});

router.get('/reportid/:id', async (req, res) => {
  const getAllQ = 'SELECT * FROM reports left join users on reports.uid=users.id where reports.id=$1';
  try {
    // const { rows } = qr.query(getAllQ);
    const { rows } = await db.query(getAllQ,[req.params.id]);
    return res.status(201).send(rows);
  } catch (error) {
  
    return res.status(400).send(`${error} jsh`);
  }
});



//insert users
router.post('/', async (req, res) => {
  const createReport = `INSERT INTO
  reports (incidence,time,uid,img,contact,gps,address,rtime,comment)
  VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`;

const values = [
req.body.incidence,
moment(new Date()),
req.body.uid,
req.body.img,
req.body.contact,
req.body.gps,
req.body.address,
req.body.rtime,
req.body.comment
];
try {
const { rows } = await db.query(createReport, values);
// console.log(rows);
const data = {
  status: 'success',
  data: {
    message: 'Reports Sent successfully​',
    Name: rows[0].incidence,
    Email: rows[0].comment,
  },
};
return res.status(201).send(data);
} catch (error) {
return res.status(400).send(error);
}
});
module.exports = router;

