'use strict';

const { Pool } = require('pg');


const pgConfig = {
  max: 1,
  user: process.env.SQL_USER || '',
  password: process.env.SQL_PASSWORD || '',
  database: process.env.SQL_NAME || '',
};

if (process.env.NODE_ENV === 'production') {
  const connectionName = process.env.INSTANCE_CONNECTION_NAME || '';

  pgConfig.host = `/cloudsql/${connectionName}`;
}

let pool;

module.exports.getPool = () => {
  if (!pool) {
    pool = new Pool(pgConfig);
  }

  return pool;
};
