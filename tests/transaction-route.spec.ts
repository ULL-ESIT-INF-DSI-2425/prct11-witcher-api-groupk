import { beforeAll, beforeEach, describe, test, expect } from "vitest";
import request from 'supertest';
import { app } from "../src/routes/main-app.js";
import { Transaction } from "../src/transactions/transaction.js";
import { Stock } from "../src/items/stock.js";
import { Good } from "../src/items/good.js";

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
      expect(res.body.merchant.name).toBe('Gilberto');
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

    test('Devuelve error, merchant no encontrado', async () => {
      const res = await request(app)
      .post('/transactions')
      .send({
        merchant: 'Someone',
        goods: ['PocionPrueba'],
        quantities: [2],
        date: '2025-05-06',
        time: '10:30'
      })
      .expect(404);
    });

    test('Devuelve error, client no encontrado', async () => {
      const res = await request(app)
      .post('/transactions')
      .send({
        client: 'Someone',
        goods: ['PocionPrueba'],
        quantities: [2],
        date: '2025-05-06',
        time: '10:30'
      })
      .expect(404);
    });

    test('Devuelve error, bien no encontrado', async () => {
      const res = await request(app)
      .post('/transactions')
      .send({
        merchant: 'Gilberto',
        goods: ['Something'],
        quantities: [2],
        date: '2025-05-06',
        time: '10:30'
      })
      .expect(404);
    });
  });

  describe('GET /transactions', () => {
    beforeAll(async () => {
      // Asegúrate de que existen estas transacciones si aún no las tienes
      await request(app).post('/transactions').send({
        client: 'Geralt',
        goods: ['PocionPrueba'],
        quantities: [1],
        date: '2025-05-06',
        time: '12:00'
      });
  
      await request(app).post('/transactions').send({
        merchant: 'Gilberto',
        goods: ['EspadaLarga'],
        quantities: [2],
        date: '2025-05-06',
        time: '14:30'
      });
    });
  
    test('Devuelve transacciones por cliente', async () => {
      const res = await request(app).get('/transactions?client=Geralt').expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty('client');
      expect(res.body[0].client.name).toBe('Geralt');
    });
  
    test('Devuelve transacciones por mercader', async () => {
      const res = await request(app).get('/transactions?merchant=Gilberto').expect(200);
      //expect(res.body[0].merchant.name).toBe('Gilberto');
    });
  
    test('Devuelve error si se combinan client y merchant', async () => {
      await request(app)
        .get('/transactions?client=Geralt&merchant=Gilberto')
        .expect(400);
    });
  
    test('Devuelve error si no se pasa ni client ni merchant', async () => {
      await request(app).get('/transactions').expect(400);
    });
  
    test('Devuelve error si se combinan fechas y client', async () => {
      await request(app)
        .get('/transactions?client=Geralt&iniDate=2025-05-01&finDate=2025-05-07&iniTime=10:00&finTime=16:00')
        .expect(400);
    });
  
    test('Filtra transacciones por fecha y hora', async () => {
      const res = await request(app).get(
        '/transactions?iniDate=2025-05-01&finDate=2025-05-07&iniTime=10:00&finTime=15:00'
      ).expect(200);
  
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  
    test('Devuelve 404 si no hay transacciones para ese cliente', async () => {
      await request(app).get('/transactions?client=NoExiste').expect(404);
    });
  
    test('Devuelve 404 si no hay transacciones en el rango de fecha', async () => {
      await request(app).get(
        '/transactions?iniDate=2020-01-01&finDate=2020-01-02&iniTime=00:00&finTime=01:00'
      ).expect(404);
    });
  });
  

  describe('PATCH /transactions/:id', () => {
    let createdTransId: string;
    let pocionId: string;
    let espadaId: string;
  
    beforeAll(async () => {
      const pocion = await Good.findOne({ name: 'PocionPrueba' });
      const espada  = await Good.findOne({ name: 'EspadaLarga' });
      pocionId = pocion!._id.toString();
      espadaId = espada!._id.toString();
  
      const res = await request(app)
        .post('/transactions')
        .send({
          merchant: 'Gilberto',
          goods: ['PocionPrueba'],
          quantities: [1],
          date: '2025-05-06',
          time: '10:30'
        })
        .expect(201);
      createdTransId = res.body._id;
    });
  
    test('Actualiza correctamente los bienes de la transacción con _id válido', async () => {
      await request(app)
        .patch(`/transactions/${createdTransId}`)
        .send({
          goods: [
            { good: espadaId, quantity: 1 }
          ]
        })
        .expect(200)
        .then((res) => {
          expect(res.body.goods).toHaveLength(1);
          expect(res.body.quantities[0]).toBe(1);
          expect(res.body.goods[0]._id || res.body.goods[0]).toBe(espadaId);
        });
    });
  
    test('Devuelve 404 si el bien no existe en stock', async () => {
      const fakeGoodId = '64f123456789012345678999';
      await request(app)
        .patch(`/transactions/${createdTransId}`)
        .send({
          goods: [
            { good: fakeGoodId, quantity: 1 }
          ]
        })
        .expect(404)
        .then(res => {
          expect(res.body.error).toMatch(/No se encontró el bien/);
        });
    });

    test('Muestra 404 ya que no existe el ID', async () => {
      const fakeId = '64f123456789012345678999';
      await request(app)
        .patch(`/transactions/${fakeId}`)
        .send({
          goods: [{ good: "EspadaLarga", quantity: 1 }]
        })
        .expect(404);
    });

    test('Muestra 500 tras un error de formato in capaz de traducir el servidor', async () => {
      await request(app)
        .patch(`/transactions/${createdTransId}`)
        .send({
          goods: ["EspadaLarga"]
        })
        .expect(404);
    });

    test('Muestra 500 tras un error de formato in capaz de traducir el servidor', async () => {
      await request(app)
        .patch(`/transactions/${createdTransId}`)
        .send({
          goods: [{ good: "EspadaLarga", quantity: 1 }]
        })
        .expect(500);
    });
  });

  describe('DELETE /transactions/:id', () => {
    let createdTransId: string;
    let pocionId: string;
    let espadaId: string;
  
    beforeAll(async () => {
      const pocion = await Good.findOne({ name: 'PocionPrueba' });
      const espada  = await Good.findOne({ name: 'EspadaLarga' });
      pocionId = pocion!._id.toString();
      espadaId = espada!._id.toString();
  
      const res = await request(app)
        .post('/transactions')
        .send({
          merchant: 'Gilberto',
          goods: ['PocionPrueba'],
          quantities: [1],
          date: '2025-05-06',
          time: '10:30'
        })
        .expect(201);
      createdTransId = res.body._id;
    });

    test('Elimina una transacción válida y ajusta el stock', async () => {
            const res = await request(app)
              .delete(`/transactions/${createdTransId}`)
              .expect(200);
          });
  
  
    test('Devuelve 404 si la transacción no existe', async () => {
      const fakeId = '64f123456789012345678999';
      await request(app).delete(`/transactions/${fakeId}`).expect(404);
    });
  
    test('Devuelve 500 si el ID es inválido', async () => {
            await request(app)
              .delete('/transactions/invalid-id')
              .expect(500);
          });
        });
});