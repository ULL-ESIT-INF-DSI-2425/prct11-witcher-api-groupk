import { beforeAll, describe, test } from "vitest";
import request from 'supertest';
import { app } from "../src/routes/main-app.js";
import { Client } from "../src/characters/client.js";

beforeAll(async () => {
    await Client.deleteMany();
});

describe('/hunters', () => {
    describe('POST /hunters', () => {
        describe('Creaciones correctas', () => {
            test('Crea un nuevo cliente 1', async () => {
                await request(app)
                    .post('/hunters')
                    .send({
                        name: 'Human1',
                        location: 'Lugar1',
                        race: 'Human'
                    })
                    .expect(200);
            });

            test('Crea un nuevo cliente 2', async () => {
                await request(app)
                    .post('/hunters')
                    .send({
                        name: 'Elf1',
                        location: 'Lugar1',
                        race: 'Elf'
                    })
                    .expect(200);
            });

            test('Crea un nuevo cliente 3', async () => {
                await request(app)
                    .post('/hunters')
                    .send({
                        name: 'Wizard1',
                        location: 'Lugar2',
                        race: 'Wizard'
                    })
                    .expect(200);
            });
        });

        describe('Creaciones incorrectas', () => {
            test('Crea un nuevo cliente con nombre incorrecto', async () => {
                await request(app)
                    .post('/hunters')
                    .send({
                        name: '/',
                        location: 'Lugar1',
                        race: 'Human'
                    })
                    .expect(400);
            });
    
            test('Crea un nuevo cliente con localización incorrecta', async () => {
                await request(app)
                    .post('/hunters')
                    .send({
                        name: 'Human2',
                        location: '/',
                        race: 'Human'
                    })
                    .expect(400);
            });
    
            test('Crea un nuevo cliente con raza incorrecta', async () => {
                await request(app)
                    .post('/hunters')
                    .send({
                        name: 'Human2',
                        location: 'Lugar1',
                        race: 'AAA'
                    })
                    .expect(400);
            });
        });
    });

    describe('GET /hunters', () => {
        
    });

    describe('PATCH /hunters', () => {
        
    });

    describe('DELETE /hunters', () => {
        
    });
});