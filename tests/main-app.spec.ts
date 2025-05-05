import { describe, test, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/routes/main-app.js';
import { Good } from '../src/items/good.js';
import { Client } from '../src/characters/client.js';
import { Merchant } from '../src/characters/merchant.js';
import { Transaction } from '../src/transactions/transaction.js';

beforeAll(async () => {
    await Good.deleteMany();
    await Client.deleteMany();
    await Merchant.deleteMany();
    await Transaction.deleteMany();
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

describe('/transactions', () => {
    describe('POST /transactions', () => {
        
    });

    describe('GET /transactions', () => {
        
    });

    describe('PATCH /transactions', () => {
        
    });

    describe('DELETE /transactions', () => {
        
    });
});