import { beforeAll, describe, test } from "vitest";
import request from 'supertest';
import { app } from "../src/routes/main-app.js";
import { Good } from "../src/items/good";

beforeAll(async () => {
    await Good.deleteMany();
});

describe('/goods', () => {
    describe('POST /goods', () => {
        describe('Creaciones correctas', () => {
            test('Crea un nuevo bien 1', async () => {
                await request(app)
                    .post('/goods')
                    .send({
                        name: 'Bien1',
                        description: 'Descripcion',
                        materials: ['Material1'],
                        weight: 10,
                        crowns: 10
                    })
                    .expect(200);
            });
    
            test('Crea un nuevo bien 2', async () => {
                await request(app)
                    .post('/goods')
                    .send({
                        name: 'Bien2',
                        description: 'Descripcion1',
                        materials: ['Material2'],
                        weight: 15,
                        crowns: 10
                    })
                    .expect(200);
            });
    
            test('Crea un nuevo bien 3', async () => {
                await request(app)
                    .post('/goods')
                    .send({
                        name: 'Bien3',
                        description: 'Descripcion2',
                        materials: ['Material3'],
                        weight: 10,
                        crowns: 20
                    })
                    .expect(200);
            });
        });

        describe('Creaciones incorrectas', () => {
            test('Crea un nuevo con nombre incorrecto', async () => {
                await request(app)
                    .post('/goods')
                    .send({
                        name: '/',
                        description: 'Descripcion',
                        materials: ['Material1'],
                        weight: 10,
                        crowns: 10
                    })
                    .expect(400);
            });
    
            test('Crea un nuevo con descripción incorrecta', async () => {
                await request(app)
                    .post('/goods')
                    .send({
                        name: 'Bien4',
                        description: '/',
                        materials: ['Material1'],
                        weight: 10,
                        crowns: 10
                    })
                    .expect(400);
            });
    
            test('Crea un nuevo con materiales incorrectos', async () => {
                await request(app)
                    .post('/goods')
                    .send({
                        name: 'Bien4',
                        description: 'Descripcion',
                        materials: ['/'],
                        weight: 10,
                        crowns: 10
                    })
                    .expect(400);
            });
    
            test('Crea un nuevo con ningún material', async () => {
                await request(app)
                    .post('/goods')
                    .send({
                        name: 'Bien4',
                        description: 'Descripcion',
                        materials: ['/'],
                        weight: 10,
                        crowns: 10
                    })
                    .expect(400);
            });
    
            test('Crea un nuevo con peso incorrecto', async () => {
                await request(app)
                    .post('/goods')
                    .send({
                        name: 'Bien4',
                        description: 'Descripcion',
                        materials: ['Material1'],
                        weight: -10,
                        crowns: 10
                    })
                    .expect(400);
            });
    
            test('Crea un nuevo con nombre incorrecto', async () => {
                await request(app)
                    .post('/goods')
                    .send({
                        name: 'Bien4',
                        description: 'Descripcion',
                        materials: ['Material1'],
                        weight: 10,
                        crowns: -10
                    })
                    .expect(400);
            });
        });
    });

    describe('GET /goods', () => {
        
    });

    describe('PATCH /goods', () => {
        
    });

    describe('DELETE /goods', () => {
        
    });
});