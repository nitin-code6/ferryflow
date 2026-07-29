const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');
const Alert = require('../src/models/alert.model');
const bcrypt = require('bcrypt');
const { generateToken } = require('../src/utils/generateToken');

describe('Alert APIs', () => {
    let adminToken, staffToken, passengerToken;

    beforeEach(async () => {
        const password = await bcrypt.hash('Password123!', 10);
        const adminUser = await User.create({ name: 'Admin', email: 'admin@test.com', password, phone: '1111111111', role: 'admin', isVerified: true });
        const staffUser = await User.create({ name: 'Staff', email: 'staff@test.com', password, phone: '2222222222', role: 'staff', isVerified: true });
        const passengerUser = await User.create({ name: 'Passenger', email: 'pass@test.com', password, phone: '3333333333', role: 'passenger', isVerified: true });

        adminToken = generateToken(adminUser._id, adminUser.role).accessToken;
        staffToken = generateToken(staffUser._id, staffUser.role).accessToken;
        passengerToken = generateToken(passengerUser._id, passengerUser.role).accessToken;
    });

    const validAlert = {
        title: 'Weather Warning',
        message: 'Heavy rain expected',
        type: 'warning',
        active: true
    };

    describe('POST /api/v1/alerts', () => {
        it('should allow admin to create alert', async () => {
            const res = await request(app)
                .post('/api/v1/alerts')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(validAlert);
            expect(res.statusCode).toEqual(201);
        });

        it('should allow staff to create alert', async () => {
            const res = await request(app)
                .post('/api/v1/alerts')
                .set('Authorization', `Bearer ${staffToken}`)
                .send(validAlert);
            expect(res.statusCode).toEqual(201);
        });

        it('should block passenger from creating alert', async () => {
            const res = await request(app)
                .post('/api/v1/alerts')
                .set('Authorization', `Bearer ${passengerToken}`)
                .send(validAlert);
            expect(res.statusCode).toEqual(403);
        });
    });

    describe('PATCH /api/v1/alerts/:id', () => {
        let alert;
        beforeEach(async () => {
            alert = await Alert.create(validAlert);
        });

        it('should allow staff to update alert', async () => {
            const res = await request(app)
                .patch(`/api/v1/alerts/${alert._id}`)
                .set('Authorization', `Bearer ${staffToken}`)
                .send({ title: 'Updated Warning' });
            expect(res.statusCode).toEqual(200);
            expect(res.body.data.title).toEqual('Updated Warning');
        });

        it('should block passenger from updating alert', async () => {
            const res = await request(app)
                .patch(`/api/v1/alerts/${alert._id}`)
                .set('Authorization', `Bearer ${passengerToken}`)
                .send({ title: 'Updated Warning' });
            expect(res.statusCode).toEqual(403);
        });
    });

    describe('DELETE /api/v1/alerts/:id', () => {
        let alert;
        beforeEach(async () => {
            alert = await Alert.create(validAlert);
        });

        it('should allow staff to delete alert', async () => {
            const res = await request(app)
                .delete(`/api/v1/alerts/${alert._id}`)
                .set('Authorization', `Bearer ${staffToken}`);
            expect(res.statusCode).toEqual(200);
        });

        it('should block passenger from deleting alert', async () => {
            const res = await request(app)
                .delete(`/api/v1/alerts/${alert._id}`)
                .set('Authorization', `Bearer ${passengerToken}`);
            expect(res.statusCode).toEqual(403);
        });
    });
});
