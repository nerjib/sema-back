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

//insert users
router.post('/', async (req, res) => {
  const createUser = `INSERT INTO
  users (last_name,first_name,pword,phone,role,lga,active,time)
  VALUES ($1, $2,$3,$4,$5,$6,$7,$8) RETURNING *`;

const values = [
req.body.lname,
req.body.fname,
req.body.pword,
req.body.phone,
req.body.role,
req.body.lga,
'active',
moment(new Date()),
];
try {
const { rows } = await db.query(createUser, values);
// console.log(rows);
const data = {
  status: 'success',
  data: {
    message: 'User added successfully​',
    Name: rows[0].first_name,
    Email: rows[0].email,
    phone: rows[0].phone,
  },
};
return res.status(201).send(data);
} catch (error) {
return res.status(400).send(error);
}
});
module.exports = router;

