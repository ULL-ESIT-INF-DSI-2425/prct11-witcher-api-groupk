import { beforeAll, describe, test, expect } from "vitest";
import request from 'supertest';
import { app } from "../src/routes/main-app.js";
import { Merchant } from "../src/characters/merchant.js";

const merchant1 = {
  name: "Merchant1",
  location: "LaLaguna",
  type: "Blacksmith"
}

const merchant2 = {
  name: "Merchant2",
  location: "LaLaguna",
  race: "Human"
}

const merchant3 = {
  name: "Merchant3",
  location: "LaLaguna",
  type: "Alchemist"
}

beforeAll(async () => {
  await Merchant.deleteMany();
  await new Merchant(merchant1).save();
  await new Merchant(merchant2).save();
  await new Merchant(merchant3).save();
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
        .expect(201);
      });

      test('Crea un nuevo mercader 2', async () => {
        await request(app)
        .post('/merchants')
        .send({
          name: 'Blacksmith1',
          location: 'Lugar2',
          type: 'Blacksmith'
        })
        .expect(201);
      });

      test('Crea un nuevo mercader 3', async () => {
        await request(app)
        .post('/merchants')
        .send({
          name: 'Alchemist1',
          location: 'Lugar2',
          type: 'Alchemist'
        })
        .expect(201);
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
        .expect(500);
      });
  
      test('Crea un nuevo cliente con localización incorrecta', async () => {
        await request(app)
        .post('/merchants')
        .send({
          name: 'General2',
          location: '/',
          race: 'General'
        })
        .expect(500);
      });
    });
  });

    describe('GET /merchants', () => {
        describe('obtenciones correctas', () => {
          test('Obtener el Merchant1', async () => {
            await request(app).get("/merchants?name=Merchant1").expect(200);
          })
    
          test('Obtener el Merchant2', async () => {
            await request(app).get("/merchants?name=Merchant2").expect(200);
          })
    
          test('Obtener el Merchant3', async () => {
            await request(app).get("/merchants?name=Merchant3").expect(200);
          })
        })
    
        describe('obtenciones incorrectas', () => {
          test('Cazador inexistente debe devolver 404', async () => {
            await request(app).get("/merchants?name=inexistente").expect(404);
          });
        })
      });
    
      describe("GET /merchants/:id", () => {
        let createdMerchantId: string;
      
        beforeAll(async () => {
          const response = await request(app)
            .post("/merchants")
            .send({
              name: 'Merchant15',
              location: 'LaLaguna',
              race: 'Human'
            })
            .expect(201);
      
          createdMerchantId = response.body._id;
        });
        
          test("Muestra un bien por su ID", async () => {
            const response = await request(app)
              .get(`/merchants/${createdMerchantId}`)
              .expect(200);
        
            expect(response.body).to.include({
              name: 'Merchant15',
              location: 'LaLaguna',
              type: 'General'
            });
    
        
            const merchantFromDb = await Merchant.findById(createdMerchantId);
            expect(merchantFromDb).not.toBeNull();
            expect(merchantFromDb!.name).to.equal("Merchant15");
          });
      
          test("Muestra error 404", async () => {
            await request(app)
              .get(`/merchants/64f123456789012345678999`)
              .expect(404);
          });
      
          test("Muestra error 500", async () => {
            const response = await request(app)
              .get(`/merchants/091735234571`)
              .expect(500);
          });
        });

    describe('PATCH /merchants', () => {
      test('Actualiza ', async () => {
        await request(app)
          .post('/merchants')
          .send({
            name: 'Alchemist10',
            location: 'Lugar2',
            type: 'Alchemist'
          })
          .expect(201);
  
          await request(app)
          .patch('/merchants?name=Alchemist10')
          .send({
            name: 'Alchemist10',
            location: 'Lugar20',
            type: 'Alchemist'
          })
          .expect(200);
      });

      test('Actualiza ', async () => {
        await request(app)
          .post('/merchants')
          .send({
            name: 'Alchemist15',
            location: 'Lugar2',
            type: 'Alchemist'
          })
          .expect(201);
  
          await request(app)
          .patch('/merchants?name=Elf5909')
          .send({
            name: 'Alchemist15',
            location: 'Lugar20',
            type: 'Alchemist'
          })
          .expect(404);
      });

      test('Actualiza ', async () => {
        await request(app)
          .post('/merchants')
          .send({
            name: 'Alchemist16',
            location: 'Lugar2',
            type: 'Alchemist'
          })
          .expect(201);
  
          await request(app)
          .patch('/merchants?name=Elf16')
          .send({
            foo: 'prueba'
          })
          .expect(400);
      });

      test('Actualiza ', async () => {
        await request(app)
          .post('/merchants')
          .send({
            name: 'Alchemist17',
            location: 'Lugar2',
            type: 'Alchemist'
          })
          .expect(201);
  
          await request(app)
          .patch('/merchants?name=Alchemist17')
          .send({
            name: 'Alchemist10',
            type: 'Alchemist'
          })
          .expect(500);
      });
    });

    describe('PATCH /merchants/:id', () => {
      let createdMerchantId: string;
  
    beforeAll(async () => {
      const response = await request(app)
        .post("/merchants")
        .send({
          name: 'Alchemist100',
          location: 'Lugar20',
          type: 'Alchemist'
        })
        .expect(201);
    
      createdMerchantId = response.body._id;
    });

    test('Actualiza correctamente el nombre del Merchant', async () => {
      await request(app)
        .patch(`/merchants/${createdMerchantId}`)
        .send({
          name: 'Alchemist100',
          location: 'Lugar200',
          type: 'Alchemist'
        })
        .expect(200);
    });

    test('Devuelve 404 si el ID no existe', async () => {
      const fakeId = '64f123456789012345678999';
      await request(app)
        .patch(`/merchants/${fakeId}`)
        .send({})
        .expect(404);
    });

    test('Devuelve 400 si se intenta actualizar campo no permitido', async () => {
      await request(app)
        .patch(`/merchants/${createdMerchantId}`)
        .send({ forbiddenField: 'Te olvidaste de actualizar un campo' })
        .expect(400);
    });

    test('Devuelve 400 si el ID es inválido', async () => {
      await request(app)
        .patch('/merchants/invalid-id')
        .send({ name: 'ELf0' })
        .expect(500); 
    });

    });

    describe('DELETE /merchants', () => {
      test('Elimina un merchant por query name', async () => {
        await request(app)
          .post('/merchants')
          .send({
            name: 'Alchemist1000',
            location: 'Lugar200',
            type: 'Alchemist'
          })
          .expect(201);
      
        await request(app)
          .delete('/merchants?name=Alchemist1000')
          .expect(200);
      });
  
      test('Devuelve 404 si no se encuentra ningún merchant con ese filtro', async () => {
        await request(app).delete("/merchants?name=inexistente").expect(404);
      });
  
      test('Devuelve 400 si no se pasa ningún filtro', async () => {
        const res = await request(app).delete('/merchants').expect(400);
        expect(res.body.error).toBe('A name must be provided');
      });
    });

    describe('DELETE /merchants/:id', () => {
      let merchantId: string;
  
      beforeAll(async () => {
        const response = await request(app)
          .post("/merchants")
          .send({
            name: 'Alchemist2000',
            location: 'Lugar200',
            type: 'Alchemist'
          })
          .expect(201);
      
          merchantId = response.body._id;
      });
      test('Elimina correctamente un bien existente', async () => {
        await request(app)
          .delete(`/merchants/${merchantId}`)
          .expect(200);
    
        const deleted = await Merchant.findById(merchantId);
        expect(deleted).toBeNull();
      });
    
      test('Devuelve 404 si el bien no existe', async () => {
        const fakeId = `64f123456789012345678999`; 
        await request(app)
          .delete(`/merchants/${fakeId}`)
          .expect(404);
      });
    
      test('Devuelve 500 si el ID es inválido', async () => {
        await request(app)
          .delete('/merchants/invalid-id')
          .expect(500);
      });
    });
});