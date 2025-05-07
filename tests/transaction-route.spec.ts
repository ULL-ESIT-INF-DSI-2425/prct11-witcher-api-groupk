import { beforeAll, beforeEach, describe, test, expect } from "vitest";
import request from 'supertest';
import { app } from "../src/routes/main-app.js";
import { Transaction } from "../src/transactions/transaction.js";
import { Stock } from "../src/items/stock.js";
import { Client } from "../src/characters/client.js";

beforeAll(async () => {
    await Transaction.deleteMany();
});

describe('/transactions', () => {
  describe('POST /transactions', () => {
    let goodId: string;
  
    beforeAll(async () => {
      const goodRes = await request(app)
        .post('/goods')
        .send({
          name: 'PocionPrueba',
          description: 'Testing',
          materials: ['Materia'],
          weight: 1,
          crowns: 10
        })
        .expect(201);

        await request(app)
        .post('/goods')
        .send({
          name: 'EspadaLarga',
          description: 'Testing',
          materials: ['Materia'],
          weight: 1,
          crowns: 10
        })
        .expect(201);
  
      
      await request(app)
        .post('/hunters')
        .send({
          name: 'Geralt',
          location: 'KaerMorhen',
          race: 'Human'
        })
        .expect(201);

        await request(app)
        .post('/merchants')
        .send({
          name: 'Gilberto',
          location: 'KaerMorhen',
          type: 'Blacksmith'
        })
        .expect(201);

    goodId = goodRes.body._id;

    await Stock.create({
      good: goodId,
      quantity: 10
    });
  })
    
  
    test('Crea transacción de cliente correctamente', async () => {
      const res = await request(app)
       .post('/transactions')
       .send({
         merchant: 'Gilberto',
         goods: ['PocionPrueba'],
         quantities: [2],
         date: '2025-05-06',
         time: '10:30'
       })
       .expect(201);
  
        expect(res.body).toHaveProperty('_id');
        const clientName = Client.findOne()
        expect(res.body.client.name).toBe('Geralt');
        expect(res.body.goods[0].name).toBe('PocionPrueba');
        expect(res.body.quantities[0]).toBe(2);
        expect(res.body.crowns).toBe(20);
    });
  
    test('Devuelve error si se indican merchant y client a la vez', async () => {
      await request(app)
        .post('/transactions')
        .send({
          client: 'Geralt',
          merchant: 'Gilberto',
          goods: ['PocionPrueba'],
          quantities: [1],
          date: '2025-05-06',
          time: '10:30'
        })
        .expect(400);
    });
  
    test('Devuelve error si se indican cantidades diferentes a goods', async () => {
      await request(app)
        .post('/transactions')
        .send({
          merchant: 'Gilberto',
          goods: ['PocionPrueba'],
          quantities: [],
          date: '2025-05-06',
          time: '10:30'
        })
        .expect(400);
    });
  });

  describe('GET /transactions', () => {
      
  });

  describe('PATCH /transactions', () => {
      
  });

  describe('DELETE /transactions', () => {
      
  });
});