const pg = require('pg');
const dotenv = require('dotenv');
const db2 = require('../dbs/azuredb');






const queryDatabase=async()=>{
    const myquery = 'select * from users'

    try {
        // const { rows } = qr.query(getAllQ);
        
        const { rows } = await db2.query(myquery);
        return  console.log(`Read: ${JSON.stringify(rows)}`);;
      } catch (error) {
        if (error.routine === '_bt_check_unique') {
          return console.log({ message: 'User with that EMAIL already exist' });
        }
        return console.log(`${error} jsh`);
      }
    
    db2.query(query)
            .then(res => {
                const rows = res.rows;
    
                rows.map(row => {
                    console.log(`Read: ${JSON.stringify(row)}`);
                });
    
                process.exit();
            })
            .catch(err => {
                console.log(err);
            });
        }

        queryDatabase();
