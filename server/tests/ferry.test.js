const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');
const Ferry = require('../src/models/ferry.model');
const bcrypt = require('bcrypt');
const { generateToken } = require('../src/utils/generateToken');

describe('Ferry APIs', () => {
    let adminToken, staffToken, passengerToken, adminUser, staffUser, passengerUser;

    beforeEach(async () => {
        const password = await bcrypt.hash('Password123!', 10);
        
        adminUser = await User.create({ name: 'Admin', email: 'admin@test.com', password, phone: '1111111111', role: 'admin', isVerified: true });
        staffUser = await User.create({ name: 'Staff', email: 'staff@test.com', password, phone: '2222222222', role: 'staff', isVerified: true });
        passengerUser = await User.create({ name: 'Passenger', email: 'passenger@test.com', password, phone: '3333333333', role: 'passenger', isVerified: true });

        adminToken = generateToken(adminUser._id, adminUser.role).accessToken;
        staffToken = generateToken(staffUser._id, staffUser.role).accessToken;
        passengerToken = generateToken(passengerUser._id, passengerUser.role).accessToken;
    });

    const validFerry = {
        name: 'Test Ferry 1',
        capacity: 100,
        layout: {
            rows: 10,
            columns: 10
        },
        amenities: ['AC', 'Wifi'],
        isActive: true
    };

    describe('POST /api/v1/ferry', () => {
        it('should allow admin to create a ferry', async () => {
            const res = await request(app)
                .post('/api/v1/ferry')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(validFerry);
            
            expect(res.statusCode).toEqual(201);
            expect(res.body.success).toBeTruthy();
            expect(res.body.data.name).toEqual(validFerry.name);
        });

        it('should not allow staff to create a ferry', async () => {
            const res = await request(app)
                .post('/api/v1/ferry')
                .set('Authorization', `Bearer ${staffToken}`)
                .send(validFerry);
            
            expect(res.statusCode).toEqual(403);
        });

        it('should not allow passenger to create a ferry', async () => {
            const res = await request(app)
                .post('/api/v1/ferry')
                .set('Authorization', `Bearer ${passengerToken}`)
                .send(validFerry);
            
            expect(res.statusCode).toEqual(403);
        });
    });

    describe('GET /api/v1/ferry', () => {
        it('should fetch all ferries', async () => {
            await Ferry.create(validFerry);
            const res = await request(app).get('/api/v1/ferry');
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.data.ferries.length).toBeGreaterThan(0);
        });
    });

    describe('PATCH /api/v1/ferry/:id', () => {
        let ferry;
        beforeEach(async () => {
            ferry = await Ferry.create(validFerry);
        });

        it('should allow admin to update ferry', async () => {
            const res = await request(app)
                .patch(`/api/v1/ferry/${ferry._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'Updated Ferry Name' });
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.data.name).toEqual('Updated Ferry Name');
        });

        it('should block unauthorized roles from updating', async () => {
            const res = await request(app)
                .patch(`/api/v1/ferry/${ferry._id}`)
                .set('Authorization', `Bearer ${staffToken}`)
                .send({ name: 'Updated Ferry Name' });
            
            expect(res.statusCode).toEqual(403);
        });
    });

    describe('DELETE /api/v1/ferry/:id', () => {
        let ferry;
        beforeEach(async () => {
            ferry = await Ferry.create(validFerry);
        });

        it('should allow admin to delete ferry', async () => {
            const res = await request(app)
                .delete(`/api/v1/ferry/${ferry._id}`)
                .set('Authorization', `Bearer ${adminToken}`);
            
            expect(res.statusCode).toEqual(200);
            const deletedFerry = await Ferry.findById(ferry._id);
            expect(deletedFerry).toBeNull();
        });

        it('should block unauthorized roles from deleting', async () => {
            const res = await request(app)
                .delete(`/api/v1/ferry/${ferry._id}`)
                .set('Authorization', `Bearer ${staffToken}`);
            
            expect(res.statusCode).toEqual(403);
            const notDeletedFerry = await Ferry.findById(ferry._id);
            expect(notDeletedFerry).toBeTruthy();
        });
    });
});
