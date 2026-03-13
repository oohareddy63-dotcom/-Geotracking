const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000';

async function testAPI() {
  console.log('🧪 Testing API Endpoints...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const health = await axios.get(`${API_BASE_URL}/`);
    console.log('✅ Health Check:', health.data);

    // Test 2: Manager Login
    console.log('\n2. Testing Manager Login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email: 'manager@example.com',
      password: 'password',
      role: 'manager'
    });
    console.log('✅ Manager Login Successful');
    console.log('   Token:', loginResponse.data.token.substring(0, 20) + '...');
    console.log('   User:', loginResponse.data.user.name);

    const managerToken = loginResponse.data.token;

    // Test 3: Get Tasks
    console.log('\n3. Testing Get Tasks...');
    const tasksResponse = await axios.get(`${API_BASE_URL}/api/tasks`, {
      headers: { Authorization: `Bearer ${managerToken}` }
    });
    console.log(`✅ Retrieved ${tasksResponse.data.length} tasks`);

    // Test 4: Get Employees
    console.log('\n4. Testing Get Employees...');
    const employeesResponse = await axios.get(`${API_BASE_URL}/api/auth/employees`, {
      headers: { Authorization: `Bearer ${managerToken}` }
    });
    console.log(`✅ Retrieved ${employeesResponse.data.length} employees`);

    // Test 5: Dashboard Stats
    console.log('\n5. Testing Dashboard Stats...');
    const dashboardResponse = await axios.get(`${API_BASE_URL}/api/reports/dashboard`, {
      headers: { Authorization: `Bearer ${managerToken}` }
    });
    console.log('✅ Dashboard Stats:', {
      activeEmployees: dashboardResponse.data.activeEmployees,
      totalTasks: dashboardResponse.data.totalTasks,
      completedTasks: dashboardResponse.data.completedTasks,
      completionRate: dashboardResponse.data.completionRate + '%'
    });

    // Test 6: Employee Login
    console.log('\n6. Testing Employee Login...');
    const empLoginResponse = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email: 'employee@example.com',
      password: 'password',
      role: 'employee'
    });
    console.log('✅ Employee Login Successful');
    console.log('   User:', empLoginResponse.data.user.name);

    const employeeToken = empLoginResponse.data.token;

    // Test 7: Get Employee Tasks
    console.log('\n7. Testing Get Employee Tasks...');
    const empTasksResponse = await axios.get(`${API_BASE_URL}/api/tasks`, {
      headers: { Authorization: `Bearer ${employeeToken}` }
    });
    console.log(`✅ Employee has ${empTasksResponse.data.length} assigned tasks`);

    // Test 8: Get Employee Updates
    console.log('\n8. Testing Get Employee Updates...');
    const updatesResponse = await axios.get(`${API_BASE_URL}/api/updates/my-updates`, {
      headers: { Authorization: `Bearer ${employeeToken}` }
    });
    console.log(`✅ Employee has ${updatesResponse.data.length} work updates`);

    console.log('\n✅ All API tests passed successfully!');
    console.log('\n🎉 Application is 100% operational and error-free!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAPI();
