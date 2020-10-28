const express = require('express');
const moment = require('moment')

const router = express.Router();
const db = require('../dbs/index');

router.get('/', async (req, res) => {
  const getAllQ = 'SELECT * FROM users order by active asc, first_name asc, id desc';
  try {
    // const { rows } = qr.query(getAllQ);
    const { rows } = await db.query(getAllQ);
    return res.status(201).send(rows);
  } catch (error) {
    if (error.routine === '_bt_check_unique') {
      return res.status(400).send({ message: 'User with that EMAIL already exist' });
    }
    return res.status(400).send(`${error} jsh`);
  }
});
router.get('/userid/:id', async (req, res) => {
  const getAllQ = 'SELECT * FROM users where id=$1';
  try {
    // const { rows } = qr.query(getAllQ);
    const { rows } = await db.query(getAllQ,[req.params.id]);
    return res.status(201).send(rows);
  } catch (error) {
    if (error.routine === '_bt_check_unique') {
      return res.status(400).send({ message: 'User with that EMAIL already exist' });
    }
    return res.status(400).send(`${error} jsh`);
  }
});

router.get('/searchuser/:id', async (req, res) => {
  const getAllQ = 'SELECT * FROM   users  where phone_no like $1';
  try {
    // const { rows } = qr.query(getAllQ);
    const { rows } = await db.query(getAllQ,['%'+req.params.id+'%']);
    return res.status(201).send(rows);
  } catch (error) {
    if (error.routine === '_bt_check_unique') {
      return res.status(400).send({ message: 'User with that EMAIL already exist' });
    }
    return res.status(400).send(`${error} jsh`);
  }
});

router.post('/login', async (req, res) => {
  const getAllQ = `SELECT * FROM users where phone_no=$1 and pword=$2`;
  try {
    // const { rows } = qr.query(getAllQ);
    const { rows } = await db.query(getAllQ,[req.body.phone,req.body.pword]);
    return res.status(201).send(rows);
  } catch (error) {
    if (error.routine === '_bt_check_unique') {
      return res.status(400).send({ message: 'User with that EMAIL already exist' });
    }
    return res.status(400).send(`${error} jsh`);
  }
});


//insert users
router.post('/', async (req, res) => {
  const createUser = `INSERT INTO
  users (last_name,first_name,pword,phone_no,role,lga,active,time,address,gender,ward)
  VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`;

const values = [
req.body.lname,
req.body.fname,
req.body.pword,
req.body.phone,
'user',
req.body.lga,
'active',
moment(new Date()),
req.body.address,
req.body.gender,
req.body.ward
];
try {
const { rows } = await db.query(createUser, values);
// console.log(rows);
const data = {
  status: 'success',
  data: {
    message: 'User added successfully​',
    name: rows[0].first_name,
    email: rows[0].email,
    phone: rows[0].phone_no,
    id: rows[0].id
  },
};
return res.status(201).send(data);
} catch (error) {
return res.status(400).send(error);
}
});
module.exports = router;

