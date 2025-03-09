const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const mongoose = require('mongoose');

describe('Appointment System E2E Test', () => {
  let studentToken, professorToken, availabilityId, appointmentId;
  let server;

  beforeAll(async () => {
    server = app.listen(0);
    await mongoose.connect(process.env.MONGODB_URI);
    await mongoose.connection.dropDatabase();

    // Create users with PLAIN TEXT passwords
    await User.create([
      { 
        name: 'Student A1', 
        email: 'student@test.com', 
        password: 'test1234', // Let model hash this
        role: 'student' 
      },
      { 
        name: 'Professor P1', 
        email: 'professor@test.com', 
        password: 'test1234', 
        role: 'professor' 
      }
    ]);
  });

  afterAll(async () => {
    await server.close();
    await mongoose.connection.close();
  });

  test('1. Student login', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ 
        email: 'student@test.com', 
        password: 'test1234' // Plain text password
      });
    
    expect(res.status).toBe(200);
    studentToken = res.body.token;
    expect(studentToken).toBeDefined();
  });

  test('2. Professor login', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ 
        email: 'professor@test.com', 
        password: 'test1234' 
      });
    
    expect(res.status).toBe(200);
    professorToken = res.body.token;
    expect(professorToken).toBeDefined();
  });

  test('3. Add availability slot', async () => {
    const res = await request(server)
      .post('/api/professors/availability')
      .set('Authorization', `Bearer ${professorToken}`)
      .send({
        start_time: '2024-01-01T09:00:00Z',
        end_time: '2024-01-01T10:00:00Z'
      });
    
    expect(res.status).toBe(201);
    availabilityId = res.body._id;
    expect(availabilityId).toBeDefined();
  });

  test('4. Book appointment', async () => {
    const res = await request(server)
      .post('/api/students/appointments')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ availability_id: availabilityId });
    
    expect(res.status).toBe(201);
    appointmentId = res.body._id;
    expect(appointmentId).toBeDefined();
  });

  test('5. Cancel appointment', async () => {
    const res = await request(server)
      .delete(`/api/professors/appointments/${appointmentId}`)
      .set('Authorization', `Bearer ${professorToken}`);
    
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'Appointment cancelled successfully'
    });
  });

  test('6. Verify empty appointments', async () => {
    const res = await request(server)
      .get('/api/students/appointments')
      .set('Authorization', `Bearer ${studentToken}`);
    
    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.any(Array));
    expect(res.body.length).toBe(0);
  });
});