import { beforeAll, describe, test } from "vitest";
import request from 'supertest';
import { app } from "../src/routes/main-app.js";
import { Merchant } from "../src/characters/merchant.js";

beforeAll(async () => {
    await Merchant.deleteMany();
});

describe('/merchants', () => {
    describe('POST /merchants', () => {
        describe('Creaciones correctas', () => {
            test('Crea un nuevo mercader 1', async () => {
                await request(app)
                    .post('/merchants')
                    .send({
                        name: 'General1',
                        location: 'Lugar1',
                        type: 'General'
                    })
                    .expect(200);
            });

            test('Crea un nuevo mercader 2', async () => {
                await request(app)
                    .post('/merchants')
                    .send({
                        name: 'Blacksmith1',
                        location: 'Lugar2',
                        type: 'Blacksmith'
                    })
                    .expect(200);
            });

            test('Crea un nuevo mercader 3', async () => {
                await request(app)
                    .post('/merchants')
                    .send({
                        name: 'Alchemist1',
                        location: 'Lugar2',
                        type: 'Alchemist'
                    })
                    .expect(200);
            });
        });

        describe('Creaciones incorrectas', () => {
            test('Crea un nuevo cliente con nombre incorrecto', async () => {
                await request(app)
                    .post('/merchants')
                    .send({
                        name: '/',
                        location: 'Lugar1',
                        type: 'General'
                    })
                    .expect(200);
            });
    
            test('Crea un nuevo cliente con localización incorrecta', async () => {
                await request(app)
                    .post('/merchants')
                    .send({
                        name: 'General2',
                        location: '/',
                        race: 'General'
                    })
                    .expect(200);
            });
    
            test('Crea un nuevo cliente con raza incorrecta', async () => {
                await request(app)
                    .post('/merchants')
                    .send({
                        name: 'General2',
                        location: 'Lugar1',
                        race: 'AAA'
                    })
                    .expect(200);
            });
        });
    });

    describe('GET /merchants', () => {
        
    });

    describe('PATCH /merchants', () => {
        
    });

    describe('DELETE /merchants', () => {
        
    });
});