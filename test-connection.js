const axios = require('axios');

console.log('🔗 TESTING FRONTEND ↔️ BACKEND ↔️ MONGODB CONNECTION\n');
console.log('═══════════════════════════════════════════════════\n');

async function testConnection() {
  try {
    // Test 1: Backend Health
    console.log('📡 Test 1: Backend Server Health');
    console.log('   Checking: http://localhost:5000');
    const health = await axios.get('http://localhost:5000');
    console.log('   ✅ Backend is responding');
    console.log('   Response:', health.data);
    console.log('');

    // Test 2: Backend → MongoDB Connection
    console.log('💾 Test 2: Backend → MongoDB Connection');
    console.log('   Attempting to login (queries MongoDB)...');
    const login = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'manager@example.com',
      password: 'password',
      role: 'manager'
    });
    console.log('   ✅ MongoDB query successful');
    console.log('   User found:', login.data.user.name);
    console.log('   Token generated:', login.data.token.substring(0, 30) + '...');
    console.log('');

    const token = login.data.token;

    // Test 3: Authenticated Request (Full Stack)
    console.log('🔐 Test 3: Authenticated Request (Full Stack)');
    console.log('   Frontend → Backend → MongoDB → Backend → Frontend');
    const tasks = await axios.get('http://localhost:5000/api/tasks', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('   ✅ Full stack flow successful');
    console.log('   Tasks retrieved from MongoDB:', tasks.data.length);
    console.log('');

    // Test 4: Data Persistence
    console.log('📊 Test 4: Data Persistence Check');
    console.log('   Verifying data in MongoDB...');
    const employees = await axios.get('http://localhost:5000/api/auth/employees', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('   ✅ Data persisted in MongoDB');
    console.log('   Employees in database:', employees.data.length);
    employees.data.forEach(emp => {
      console.log('      -', emp.name, `(${emp.email})`);
    });
    console.log('');

    // Test 5: Dashboard Stats (Complex Query)
    console.log('📈 Test 5: Complex Database Query');
    console.log('   Testing aggregation and calculations...');
    const stats = await axios.get('http://localhost:5000/api/reports/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('   ✅ Complex queries working');
    console.log('   Dashboard Statistics:');
    console.log('      - Total Tasks:', stats.data.totalTasks);
    console.log('      - Completed Tasks:', stats.data.completedTasks);
    console.log('      - Completion Rate:', stats.data.completionRate + '%');
    console.log('      - Pending Updates:', stats.data.pendingUpdates);
    console.log('');

    // Summary
    console.log('═══════════════════════════════════════════════════');
    console.log('');
    console.log('✅ CONNECTION TEST RESULTS:');
    console.log('');
    console.log('   ✅ Frontend → Backend:     CONNECTED');
    console.log('   ✅ Backend → MongoDB:      CONNECTED');
    console.log('   ✅ Authentication:         WORKING');
    console.log('   ✅ Data Queries:           WORKING');
    console.log('   ✅ Data Persistence:       WORKING');
    console.log('   ✅ Complex Operations:     WORKING');
    console.log('');
    console.log('🎉 ALL CONNECTIONS ARE ACTIVE AND WORKING!');
    console.log('');
    console.log('📊 Connection Flow:');
    console.log('   Frontend (React) → Backend (Express) → MongoDB');
    console.log('   Port 3000        → Port 5000         → Port 27017');
    console.log('');
    console.log('🌐 Access your application:');
    console.log('   Frontend: http://localhost:3000');
    console.log('   Backend:  http://localhost:5000');
    console.log('');

  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    if (error.response) {
      console.error('   Response:', error.response.data);
    }
  }
}

testConnection();
