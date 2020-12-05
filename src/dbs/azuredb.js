const pg = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const config = {
    host: 'semadb.postgres.database.azure.com',
    // Do not hard code your username and password.
    // Consider using Node environment variables.
    user: 'sema',     
    password: process.env.azurepword,
    database: 'postgres',
    port: 5432,
    ssl: true
};

const client = new pg.Client(config);
client.connect()

/*
client.connect(err => {
    if (err) throw err;
    else {
        queryDatabase();
    }
});
*/
function queryDatabase() {
    const query = `
        DROP TABLE IF EXISTS users;
        CREATE TABLE users (id serial PRIMARY KEY, first_name VARCHAR(50), last_name VARCHAR(50));
        INSERT INTO users (first_name,last_name) VALUES ('Musa','Ali');
          `;

    client
        .query(query)
        .then(() => {
            console.log('Table created successfully!');
            client.end(console.log('Closed client connection'));
        })
        .catch(err => console.log(err))
        .then(() => {
            console.log('Finished execution, exiting now');
            process.exit();
        });


}

module.exports = client;
