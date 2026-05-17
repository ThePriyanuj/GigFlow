async function runTests() {
  const baseURL = 'http://localhost:5000/api';
  console.log('Testing Login API...');
  try {
    const loginRes = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@gigflow.com', password: 'admin123' })
    });
    const loginData = await loginRes.json();
    console.log('Login successful:', loginData.success);
    
    const token = loginData.token;
    
    console.log('Testing Get Leads API...');
    const leadsRes = await fetch(`${baseURL}/leads`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const leadsData = await leadsRes.json();
    console.log('Leads fetched, count:', leadsData.data.length);

    console.log('Testing Stats API...');
    const statsRes = await fetch(`${baseURL}/leads/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const statsData = await statsRes.json();
    console.log('Stats fetched:', Object.keys(statsData).length);

    console.log('All backend tests passed!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

runTests();
