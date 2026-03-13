const axios = require('axios');

console.log('🔍 DIAGNOSING FRONTEND-BACKEND CONNECTION\n');
console.log('═══════════════════════════════════════════════════\n');

async function diagnose() {
  const results = {
    backend: false,
    mongodb: false,
    login: false,
    tasks: false,
    cors: false
  };

  // Test 1: Backend Health
  console.log('1️⃣  Testing Backend Server...');
  try {
    const response = await axios.get('http://localhost:5000', { timeout: 5000 });
    console.log('   ✅ Backend is running');
    console.log('   Response:', response.data);
    results.backend = true;
  } catch (error) {
    console.log('   ❌ Backend is NOT responding');
    console.log('   Error:', error.message);
    console.log('   → Make sure backend is running: cd server && npm start');
    return results;
  }

  // Test 2: MongoDB Connection
  console.log('\n2️⃣  Testing MongoDB Connection...');
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'manager@example.com',
      password: 'password',
      role: 'manager'
    }, { timeout: 5000 });
    
    if (response.data.token) {
      console.log('   ✅ MongoDB is connected');
      console.log('   User found:', response.data.user.name);
      results.mongodb = true;
      results.login = true;
      
      // Test 3: Fetch Data
      console.log('\n3️⃣  Testing Data Retrieval...');
      const tasksResponse = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${response.data.token}` },
        timeout: 5000
      });
      console.log('   ✅ Data retrieval working');
      console.log('   Tasks found:', tasksResponse.data.length);
      results.tasks = true;
    }
  } catch (error) {
    console.log('   ❌ MongoDB connection issue');
    if (error.response) {
      console.log('   Error:', error.response.data);
    } else {
      console.log('   Error:', error.message);
    }
    console.log('   → Run: cd server && node seed.js');
  }

  // Test 4: CORS
  console.log('\n4️⃣  Testing CORS Configuration...');
  try {
    const response = await axios.get('http://localhost:5000', {
      headers: { 'Origin': 'http://localhost:3000' },
      timeout: 5000
    });
    console.log('   ✅ CORS is configured correctly');
    results.cors = true;
  } catch (error) {
    console.log('   ⚠️  CORS might have issues');
  }

  // Summary
  console.log('\n═══════════════════════════════════════════════════');
  console.log('\n📊 DIAGNOSIS SUMMARY:\n');
  console.log('   Backend Server:    ', results.backend ? '✅ Working' : '❌ Not Working');
  console.log('   MongoDB:           ', results.mongodb ? '✅ Connected' : '❌ Not Connected');
  console.log('   Authentication:    ', results.login ? '✅ Working' : '❌ Not Working');
  console.log('   Data Retrieval:    ', results.tasks ? '✅ Working' : '❌ Not Working');
  console.log('   CORS:              ', results.cors ? '✅ Configured' : '⚠️  Check Config');

  const allGood = Object.values(results).every(v => v === true);
  
  if (allGood) {
    console.log('\n🎉 ALL SYSTEMS OPERATIONAL!');
    console.log('\n✅ Your application is ready to use!');
    console.log('   Frontend: http://localhost:3000');
    console.log('   Backend:  http://localhost:5000');
  } else {
    console.log('\n⚠️  ISSUES DETECTED - Follow the suggestions above');
  }

  return results;
}

diagnose().catch(err => {
  console.error('\n❌ Diagnosis failed:', err.message);
  console.log('\n🔧 TROUBLESHOOTING STEPS:');
  console.log('   1. Make sure backend is running: cd server && npm start');
  console.log('   2. Make sure MongoDB is running');
  console.log('   3. Seed the database: cd server && node seed.js');
  console.log('   4. Check if ports 3000 and 5000 are available');
});
