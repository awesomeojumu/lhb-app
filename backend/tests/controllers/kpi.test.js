const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const KPI = require('../../models/KPI');
const User = require('../../models/User');
const KPIStatus = require('../../models/KPIStatus');

describe('Battalion KPI Aggregation', () => {
  let testUsers = [];
  let testKPIs = [];
  let authToken;

  beforeAll(async () => {
    // Create test users in Delta battalion
    const user1 = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@test.com',
      password: 'password123',
      role: 'commando',
      battalion: 'Delta'
    });

    const user2 = await User.create({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@test.com',
      password: 'password123',
      role: 'commando',
      battalion: 'Delta'
    });

    const user3 = await User.create({
      firstName: 'Bob',
      lastName: 'Wilson',
      email: 'bob.wilson@test.com',
      password: 'password123',
      role: 'commando',
      battalion: 'Alpha' // Different battalion
    });

    testUsers = [user1, user2, user3];

    // Create test KPIs
    const kpi1 = await KPI.create({
      title: 'Test KPI 1',
      description: 'First test KPI',
      assignedTo: 'commando',
      createdBy: user1._id
    });

    const kpi2 = await KPI.create({
      title: 'Test KPI 2',
      description: 'Second test KPI',
      assignedTo: 'commando',
      createdBy: user1._id
    });

    testKPIs = [kpi1, kpi2];

    // Create KPIStatus entries for Delta battalion users
    await KPIStatus.create([
      { user: user1._id, kpi: kpi1._id, status: 'done' },
      { user: user1._id, kpi: kpi2._id, status: 'in_progress' },
      { user: user2._id, kpi: kpi1._id, status: 'done' },
      { user: user2._id, kpi: kpi2._id, status: 'pending' }
    ]);

    // Create KPIStatus entries for Alpha battalion user (should not be included)
    await KPIStatus.create([
      { user: user3._id, kpi: kpi1._id, status: 'done' },
      { user: user3._id, kpi: kpi2._id, status: 'in_progress' }
    ]);

    // Login to get auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'john.doe@test.com',
        password: 'password123'
      });

    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    // Clean up test data
    await User.deleteMany({ email: { $regex: /@test\.com$/ } });
    await KPI.deleteMany({ title: { $regex: /^Test KPI/ } });
    await KPIStatus.deleteMany({});
    await mongoose.connection.close();
  });

  test('should aggregate KPI data correctly for Delta battalion', async () => {
    const response = await request(app)
      .get('/api/kpis/battalion/Delta')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    const data = response.body;

    // Should have 2 unique KPIs
    expect(data.uniqueKPIs).toBe(2);
    
    // Should have 4 total assignments (2 users × 2 KPIs)
    expect(data.totalKPIs).toBe(4);
    
    // Should have 2 completed (both users completed KPI 1)
    expect(data.completed).toBe(2);
    
    // Should have 1 in progress (user1 on KPI 2)
    expect(data.inProgress).toBe(1);
    
    // Should have 1 not started (user2 on KPI 2)
    expect(data.notStarted).toBe(1);
    
    // Should have 2 battalion users
    expect(data.battalionUsers).toBe(2);
  });

  test('should return empty data for non-existent battalion', async () => {
    const response = await request(app)
      .get('/api/kpis/battalion/NonExistent')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    const data = response.body;

    expect(data.totalKPIs).toBe(0);
    expect(data.completed).toBe(0);
    expect(data.inProgress).toBe(0);
    expect(data.notStarted).toBe(0);
    expect(data.uniqueKPIs).toBe(0);
    expect(data.memberAssignments).toEqual([]);
  });
});
