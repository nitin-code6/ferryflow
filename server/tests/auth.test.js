const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');
const OTP = require('../src/models/otp.model');
const bcrypt = require('bcrypt');

describe('Authentication APIs', () => {
    const validUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        phone: '9876543210'
    };

    describe('POST /api/v1/auth/register', () => {
        it('should successfully register a new user', async () => {
            const res = await request(app)
                .post('/api/v1/auth/register')
                .send(validUser);
            expect(res.statusCode).toEqual(201);
            expect(res.body.success).toBeTruthy();
            expect(res.body.message).toContain('OTP sent');
            
            const user = await User.findOne({ email: validUser.email });
            expect(user).toBeTruthy();
            expect(user.isVerified).toBeFalsy();
            
            const otp = await OTP.findOne({ email: validUser.email });
            expect(otp).toBeTruthy();
        });

        it('should reject duplicate verified user', async () => {
            await User.create({ ...validUser, isVerified: true });
            const res = await request(app)
                .post('/api/v1/auth/register')
                .send(validUser);
            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toContain('User already exists');
        });

        it('should reject invalid input (e.g. invalid email)', async () => {
            const res = await request(app)
                .post('/api/v1/auth/register')
                .send({ ...validUser, email: 'not-an-email' });
            expect(res.statusCode).toEqual(400);
            expect(res.body.errors).toBeDefined();
        });

        it('should reject missing fields', async () => {
            const res = await request(app)
                .post('/api/v1/auth/register')
                .send({ email: validUser.email });
            expect(res.statusCode).toEqual(400);
        });
    });

    describe('POST /api/v1/auth/verify-email', () => {
        it('should verify with correct OTP', async () => {
            await User.create(validUser);
            const otpCode = '123456';
            const hashedOtp = await bcrypt.hash(otpCode, 10);
            await OTP.create({ email: validUser.email, otp: hashedOtp, type: 'VERIFICATION', expiresAt: Date.now() + 10 * 60 * 1000 });

            const res = await request(app)
                .post('/api/v1/auth/verify-email')
                .send({ email: validUser.email, otp: otpCode });
            
            expect(res.statusCode).toEqual(200);
            const user = await User.findOne({ email: validUser.email });
            expect(user.isVerified).toBeTruthy();
        });

        it('should reject with wrong OTP', async () => {
            await User.create(validUser);
            const hashedOtp = await bcrypt.hash('123456', 10);
            await OTP.create({ email: validUser.email, otp: hashedOtp, type: 'VERIFICATION', expiresAt: Date.now() + 10 * 60 * 1000 });

            const res = await request(app)
                .post('/api/v1/auth/verify-email')
                .send({ email: validUser.email, otp: '654321' });
            
            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toContain('Invalid OTP');
        });

        it('should reject expired OTP', async () => {
            await User.create(validUser);
            const hashedOtp = await bcrypt.hash('123456', 10);
            await OTP.create({ email: validUser.email, otp: hashedOtp, type: 'VERIFICATION', expiresAt: Date.now() - 1000 });

            const res = await request(app)
                .post('/api/v1/auth/verify-email')
                .send({ email: validUser.email, otp: '123456' });
            
            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toContain('Invalid OTP');
        });
    });

    describe('POST /api/v1/auth/login', () => {
        beforeEach(async () => {
            const hashedPassword = await bcrypt.hash(validUser.password, 10);
            await User.create({ ...validUser, password: hashedPassword, isVerified: true });
        });

        it('should login with valid credentials', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({ email: validUser.email, password: validUser.password });
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.data.accessToken).toBeDefined();
        });

        it('should reject invalid password', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({ email: validUser.email, password: 'WrongPassword1!' });
            
            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toContain('Invalid email or password');
        });

        it('should reject unverified user', async () => {
            await User.updateOne({ email: validUser.email }, { isVerified: false });
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({ email: validUser.email, password: validUser.password });
            
            expect(res.statusCode).toEqual(403);
            expect(res.body.message).toContain('not verified');
        });
    });

    describe('POST /api/v1/auth/logout', () => {
        let accessToken;
        beforeEach(async () => {
            const hashedPassword = await bcrypt.hash(validUser.password, 10);
            await User.create({ ...validUser, password: hashedPassword, isVerified: true });
            const loginRes = await request(app)
                .post('/api/v1/auth/login')
                .send({ email: validUser.email, password: validUser.password });
            accessToken = loginRes.body.data.accessToken;
        });

        it('should logout user, invalidate token, and remove refresh token', async () => {
            const res = await request(app)
                .post('/api/v1/auth/logout')
                .set('Authorization', `Bearer ${accessToken}`);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toContain('Logged out successfully');
            
            // Checking Redis mock del call
            const redis = require('../src/config/redis');
            expect(redis.del).toHaveBeenCalled();
        });
    });
});
