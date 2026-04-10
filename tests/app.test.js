const request = require('supertest');
const app = require('../app');

describe('Weblinks API', () => {

    it('GET /api/weblinks should return all weblinks', async () => {
        const res = await request(app).get('/api/weblinks');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('POST /api/weblinks should create a new weblink', async () => {
        const newLink = {
            title: 'Test Site',
            url: 'https://test.com',
            rating: 5,
            category: 'Test'
        };

        const res = await request(app)
            .post('/api/weblinks')
            .send(newLink);

        expect(res.statusCode).toBe(201);
        expect(res.body.title).toBe(newLink.title);
    });

});