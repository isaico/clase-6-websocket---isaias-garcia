const dotenv = require('dotenv');
dotenv.config();

const config = {
  client: 'mysql2',
  connection: {
    host: process.env.HOSTDB,
    user: process.env.USERDB,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  },
};

module.exports={config}
