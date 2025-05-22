const { Client } = require('pg');

// Force RDS connection settings regardless of environment variables
const RDS_CONFIG = {
  host: 'integracion-db.cwzbzpsiy9ae.us-east-1.rds.amazonaws.com',
  port: 5432,
  user: 'integracion',
  password: 'integracion123francogey',
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false
  }
};

async function testConnection() {
  console.log('Using AWS RDS connection:');
  console.log('DB_HOST:', RDS_CONFIG.host);
  console.log('DB_USER:', RDS_CONFIG.user);

  const client = new Client(RDS_CONFIG);
  
  try {
    console.log('Connecting to:', RDS_CONFIG.host);
    await client.connect();
    console.log('Connection successful to AWS RDS!');
    await client.end();
  } catch (err) {
    console.error('Connection error:', err.message);
  }
}

testConnection();