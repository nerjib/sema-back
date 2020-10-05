const express = require('express');
const moment = require('moment')

const router = express.Router();
const db = require('../dbs/index');

router.get('/', async (req, res) => {
  const getAllQ = 'SELECT reports.id,reports.incidence,reports.address,reports.contact,reports.gps,reports.time,reports.rtime,reports.comment, users.first_name,users.last_name,users.phone_no FROM reports left join users on reports.uid=users.id';
  try {
    // const { rows } = qr.query(getAllQ);
    const { rows } = await db.query(getAllQ);
    return res.status(201).send(rows);
  } catch (error) {
  
    return res.status(400).send(`${error} jsh`);
  }
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

//get open reports
router.get('/openreport/:id', async (req, res) => {
  const getAllQ = 'SELECT * FROM reports  where aid=$1 and done=$2';
  try {
    // const { rows } = qr.query(getAllQ);
    const { rows } = await db.query(getAllQ,[req.params.id,0]);
    return res.status(201).send(rows);
  } catch (error) {
  
    return res.status(400).send(`${error} jsh`);
  }
});

//get closed reports
router.get('/closedreport/:id', async (req, res) => {
  const getAllQ = 'SELECT * FROM reports  where aid=$1 and done=$2';
  try {
    // const { rows } = qr.query(getAllQ);
    const { rows } = await db.query(getAllQ,[req.params.id,1]);
    return res.status(201).send(rows);
  } catch (error) {
  
    return res.status(400).send(`${error} jsh`);
  }
});

//get all feedback of open activities
router.get('/feedback/:id', async (req, res) => {
  const getAllQ = 'SELECT * FROM feedbackreports  where senderid=$1 or receiverid=$2 order by id asc';
  try {
    // const { rows } = qr.query(getAllQ);
    const { rows } = await db.query(getAllQ,[req.params.id, req.params.id]);
    return res.status(201).send(rows);
  } catch (error) {
  
    return res.status(400).send(`${error} jsh`);
  }
});

//get all feedback of open activities
router.get('/reportfeedback/:id', async (req, res) => {
  const getAllQ = 'SELECT * FROM feedbackreports  where rid=$1  order by id asc';
  try {
    // const { rows } = qr.query(getAllQ);
    const { rows } = await db.query(getAllQ,[req.params.id]);
    return res.status(201).send(rows);
  } catch (error) {
  
    return res.status(400).send(`${error} jsh`);
  }
});


//insert reports
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

router.post('/feedback', async (req, res) => {
  const createReportFeedback = `INSERT INTO
  feedbackreports (receiverid,senderid,rid,message,gps,imgurl1,imgurl2,time)
  VALUES ($1, $2,$3,$4,$5,$6,$7,$8) RETURNING *`;

const values = [
  req.body.receiverid,
req.body.senderid,
req.body.rid,
req.body.msg,
req.body.gps,
req.body.imgurl1,
req.body.imgurl2,
moment(new Date())
];
try {
const { rows } = await db.query(createReportFeedback, values);
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

