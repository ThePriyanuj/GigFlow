import axios from 'axios';

async function testDelete() {
  const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
    email: 'admin@gigflow.com',
    password: 'admin123'
  });
  const token = loginRes.data.token;

  const leadsRes = await axios.get('http://localhost:5000/api/leads', {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  const leadId = leadsRes.data.data[0]._id;
  console.log('Attempting to delete lead:', leadId);

  try {
    const deleteRes = await axios.delete(`http://localhost:5000/api/leads/${leadId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Delete response:', deleteRes.data);
  } catch (error) {
    console.error('Delete error:', error.response?.data || error.message);
  }
}

testDelete().catch(console.error);
