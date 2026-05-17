import axios from 'axios';
import fs from 'fs';

async function testExport() {
  // First login
  const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
    email: 'admin@gigflow.com',
    password: 'admin123'
  });
  const token = loginRes.data.token;

  // Then download export using exact axios config
  const response = await axios.get('http://localhost:5000/api/leads/export', {
    headers: { Authorization: `Bearer ${token}` },
    responseType: 'blob'
  });

  console.log('Response Type:', typeof response.data);
  console.log('Is Buffer?', Buffer.isBuffer(response.data));
  console.log('Constructor:', response.data?.constructor?.name);
  
  fs.writeFileSync('test-download.csv', response.data);
  console.log('Saved to test-download.csv');
}

testExport().catch(console.error);
