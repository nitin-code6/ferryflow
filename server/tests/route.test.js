const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');
const Route = require('../src/models/route.model');
const bcrypt = require('bcrypt');
const { generateToken } = require('../src/utils/generateToken');

describe('Route APIs', () => {
    let adminToken, staffToken, adminUser;

    beforeEach(async () => {
        const password = await bcrypt.hash('Password123!', 10);
        adminUser = await User.create({ name: 'Admin', email: 'admin@test.com', password, phone: '1111111111', role: 'admin', isVerified: true });
        const staffUser = await User.create({ name: 'Staff', email: 'staff@test.com', password, phone: '2222222222', role: 'staff', isVerified: true });

        adminToken = generateToken(adminUser._id, adminUser.role).accessToken;
        staffToken = generateToken(staffUser._id, staffUser.role).accessToken;
    });

    const validRoute = {
        source: 'Mumbai',
        destination: 'Alibaug',
        distance: 100,
        estimatedTime: 120
    };

    describe('POST /api/v1/route', () => {
        it('should allow admin to create a route', async () => {
            const res = await request(app)
                .post('/api/v1/route')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(validRoute);
            
            expect(res.statusCode).toEqual(201);
            expect(res.body.success).toBeTruthy();
        });

        it('should not allow staff to create a route', async () => {
            const res = await request(app)
                .post('/api/v1/route')
                .set('Authorization', `Bearer ${staffToken}`)
                .send(validRoute);
            
            expect(res.statusCode).toEqual(403);
        });
    });

    describe('GET /api/v1/route', () => {
        it('should fetch all routes', async () => {
            await Route.create(validRoute);
            const res = await request(app).get('/api/v1/route');
            expect(res.statusCode).toEqual(200);
            expect(res.body.data.length).toBeGreaterThan(0);
        });
    });

    describe('PATCH /api/v1/route/:id', () => {
        let route;
        beforeEach(async () => {
            route = await Route.create(validRoute);
        });

        it('should allow admin to update route', async () => {
            const res = await request(app)
                .patch(`/api/v1/route/${route._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ distance: 150 });
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.data.distance).toEqual(150);
        });
    });

    describe('DELETE /api/v1/route/:id', () => {
        let route;
        beforeEach(async () => {
            route = await Route.create(validRoute);
        });

        it('should allow admin to delete route', async () => {
            const res = await request(app)
                .delete(`/api/v1/route/${route._id}`)
                .set('Authorization', `Bearer ${adminToken}`);
            
            expect(res.statusCode).toEqual(200);
            const deleted = await Route.findById(route._id);
            expect(deleted).toBeNull();
        });
    });
});
