const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');
const Schedule = require('../src/models/schedule.model');
const Ferry = require('../src/models/ferry.model');
const Route = require('../src/models/route.model');
const bcrypt = require('bcrypt');
const { generateToken } = require('../src/utils/generateToken');

describe('Schedule APIs', () => {
    let adminToken, ferry, routeEntity;

    beforeEach(async () => {
        const password = await bcrypt.hash('Password123!', 10);
        const adminUser = await User.create({ name: 'Admin', email: 'admin@test.com', password, phone: '1111111111', role: 'admin', isVerified: true });
        adminToken = generateToken(adminUser._id, adminUser.role).accessToken;

        ferry = await Ferry.create({ name: 'Ferry1', capacity: 100, layout: { rows: 10, columns: 10 } });
        routeEntity = await Route.create({ source: 'Src', destination: 'Dest', distance: 10, estimatedTime: 60 });
    });

    describe('POST /api/v1/schedules', () => {
        it('should create schedule with valid ferry and route', async () => {
            const validSchedule = {
                ferryId: ferry._id,
                routeId: routeEntity._id,
                departureTime: new Date(Date.now() + 86400000), // tomorrow
                arrivalTime: new Date(Date.now() + 86400000 + 3600000), // tomorrow + 1 hour
                price: 100,
                status: 'scheduled'
            };
            
            const res = await request(app)
                .post('/api/v1/schedules')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(validSchedule);
            
            expect(res.statusCode).toEqual(201);
            expect(res.body.success).toBeTruthy();
        });

        it('should reject invalid ferry/route mapping', async () => {
            const invalidSchedule = {
                ferryId: '000000000000000000000000', // Invalid ID (won't exist)
                routeId: routeEntity._id,
                departureTime: new Date(Date.now() + 86400000),
                arrivalTime: new Date(Date.now() + 86400000 + 3600000),
                price: 100,
                status: 'scheduled'
            };

            const res = await request(app)
                .post('/api/v1/schedules')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(invalidSchedule);
            
            expect(res.statusCode).not.toEqual(201);
            expect(res.body.success).toBeFalsy();
        });
    });

    describe('PATCH /api/v1/schedules/:id', () => {
        let schedule;
        beforeEach(async () => {
            schedule = await Schedule.create({
                ferry: ferry._id,
                route: routeEntity._id,
                departureTime: new Date(),
                arrivalTime: new Date(),
                price: 50,
                status: 'scheduled'
            });
        });

        it('should update schedule', async () => {
            const res = await request(app)
                .patch(`/api/v1/schedules/${schedule._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ price: 150 });
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.data.price).toEqual(150);
        });
    });

    describe('DELETE /api/v1/schedules/:id', () => {
        let schedule;
        beforeEach(async () => {
            schedule = await Schedule.create({
                ferry: ferry._id,
                route: routeEntity._id,
                departureTime: new Date(),
                arrivalTime: new Date(),
                price: 50,
                status: 'scheduled'
            });
        });

        it('should delete schedule', async () => {
            const res = await request(app)
                .delete(`/api/v1/schedules/${schedule._id}`)
                .set('Authorization', `Bearer ${adminToken}`);
            
            expect(res.statusCode).toEqual(200);
            const deleted = await Schedule.findById(schedule._id);
            expect(deleted).toBeNull();
        });
    });
});
