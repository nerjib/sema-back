const express = require('express');
const moment = require('moment')

const router = express.Router();
const db = require('../dbs/index');

router.get('/', async (req, res) => {
  const getAllQ = 'SELECT reports.id,reports.lga,reports.incidence,reports.address,reports.contact,reports.gps,reports.time,reports.rtime,reports.comment, users.first_name,users.last_name,users.phone_no FROM reports left join users on reports.uid=users.id';
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

router.get('/reportsbylga/:id', async (req, res) => {
  const getAllQ = 'SELECT * FROM reports left join users on reports.uid=users.id where reports.lga=$1';
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

//get all draft reports
router.get('/getdraft', async (req, res) => {
  const getAllQ = 'SELECT * FROM draftreports left join users on draftreports.sid=users.id';
  try {
    // const { rows } = qr.query(getAllQ);
    const { rows } = await db.query(getAllQ);
    return res.status(201).send(rows);
  } catch (error) {
  
    return res.status(400).send(`${error} jsh`);
  }
});

router.get('/getuserdraft/:id', async (req, res) => {
  const getAllQ = 'SELECT * FROM draftreports  where vid=$1 or oid=$2  order by id asc';
  try {
    // const { rows } = qr.query(getAllQ);
    const { rows } = await db.query(getAllQ,[req.params.id, req.params.id]);
    return res.status(201).send(rows);
  } catch (error) {
  
    return res.status(400).send(`${error} jsh`);
  }
});

router.get('/followup', async (req, res) => {
  const getAllQ = 'SELECT * FROM followup left join draftreports on draftreports.id=followup.rid';
  try {
    // const { rows } = qr.query(getAllQ);
    const { rows } = await db.query(getAllQ);
    return res.status(201).send(rows);
  } catch (error) {
  
    return res.status(400).send(`${error} jsh`);
  }
});



//insert reports
router.post('/', async (req, res) => {
  const createReport = `INSERT INTO
  reports (incidence,time,uid,img,contact,gps,address,rtime,comment,done)
  VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`;

const values = [
req.body.incidence,
moment(new Date()),
req.body.uid,
req.body.img,
req.body.contact,
req.body.gps,
req.body.address,
req.body.rtime,
req.body.comment,
0
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

//post draft reports
router.post('/draftreports', async (req, res) => {
  const createDraftReport = `INSERT INTO
  draftreports (date,source,state,lga,ward,block,event,place,cause,descrcause,imgurl,sid,vid,oid,gps,category)
  VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`;

const values = [
  moment(new Date()),
  req.body.source,
  req.body.state,
  req.body.lga,
  req.body.ward,
  req.body.block,
  req.body.event,
  req.body.place,
  req.body.cause,
  req.body.descrcause,
  req.body.imgurl,
  req.body.sid,
  0,
  0,
  req.body.gps,
  'draft'
];
try {
const { rows } = await db.query(createDraftReport, values);
// console.log(rows);
const data = {
  status: 'success',
  data: {
    message: 'Reports Sent successfully​'
    },
};
return res.status(201).send(data);
} catch (error) {
return res.status(400).send(error);
}
});

router.put('/aid', async (req, res) => {
  const updateaid = `UPDATE reports set aid=$1, aidtime=$2 where id=$3 RETURNING *`;

const values = [
  req.body.aid,
  moment(new Date()),
req.body.rid
];
try {
const { rows } = await db.query(updateaid, values);
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

