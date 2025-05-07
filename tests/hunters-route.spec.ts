import { beforeAll, describe, test, expect } from "vitest";
import request from 'supertest';
import { app } from "../src/routes/main-app.js";
import { Client } from "../src/characters/client.js";

const hunter1 = {
  name: "Hunter1",
  location: "LaLaguna",
  race: "Human"
}

const hunter2 = {
  name: "Hunter2",
  location: "LaLaguna",
  race: "Human"
}

const hunter3 = {
  name: "Hunter3",
  location: "LaLaguna",
  race: "Human"
}

beforeAll(async () => {
  await Client.deleteMany();
  await new Client(hunter1).save();
  await new Client(hunter2).save();
  await new Client(hunter3).save();
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
        .expect(201);
      });

      test('Crea un nuevo cliente 2', async () => {
        await request(app)
        .post('/hunters')
        .send({
          name: 'Elf1',
          location: 'Lugar1',
          race: 'Elf'
        })
        .expect(201);
      });

      test('Crea un nuevo cliente 3', async () => {
        await request(app)
        .post('/hunters')
        .send({
          name: 'Wizard1',
          location: 'Lugar2',
          race: 'Wizard'
        })
        .expect(201);
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
    describe('obtenciones correctas', () => {
      test('Obtener el Hunter1', async () => {
        await request(app).get("/hunters?name=Hunter1").expect(200);
      })

      test('Obtener el Hunter2', async () => {
        await request(app).get("/hunters?name=Hunter2").expect(200);
      })

      test('Obtener el Hunter3', async () => {
        await request(app).get("/hunters?name=Hunter3").expect(200);
      })
    })

    describe('obtenciones incorrectas', () => {
      test('Cazador inexistente debe devolver 404', async () => {
        await request(app).get("/hunters?name=inexistente").expect(404);
      });
    })
  });

  describe("GET /hunters/:id", () => {
    let createdHunterId: string;
  
    beforeAll(async () => {
      const response = await request(app)
        .post("/hunters")
        .send({
          name: 'Hunter15',
          location: 'LaLaguna',
          race: 'Human'
        })
        .expect(201);
  
      createdHunterId = response.body._id;
    });
    
      test("Muestra un bien por su ID", async () => {
        const response = await request(app)
          .get(`/hunters/${createdHunterId}`)
          .expect(200);
    
        expect(response.body).to.include({
          name: 'Hunter15',
          location: 'LaLaguna',
          race: 'Human'
        });

    
        const hunterFromDb = await Client.findById(createdHunterId);
        expect(hunterFromDb).not.toBeNull();
        expect(hunterFromDb!.name).to.equal("Hunter15");
      });
  
      test("Muestra error 404", async () => {
        await request(app)
          .get(`/hunters/64f123456789012345678999`)
          .expect(404);
      });
  
      test("Muestra error 500", async () => {
        const response = await request(app)
          .get(`/hunters/091735234571`)
          .expect(500);
      });
    });

  describe('PATCH /hunters', () => {
    test('Actualiza ', async () => {
      await request(app)
        .post('/hunters')
        .send({
          name: 'Elf5',
          location: 'Lugar10',
          race: 'Elf'
        })
        .expect(201);

        await request(app)
        .patch('/hunters?name=Elf5')
        .send({
          name: 'Elf5',
          location: 'Lugar106',
          race: 'Elf'
        })
        .expect(200);
    });

    test('Cazador inexistente debe devolver 404', async () => {
      await request(app)
        .post('/hunters')
        .send({
          name: 'Elf6',
          location: 'Lugar10',
          race: 'Elf'
        })
        .expect(201);

        await request(app)
        .patch('/hunters?name=Elf898')
        .send({
          name: 'Elf6',
          location: 'Lugar10',
          race: 'Elf'
        })
        .expect(404);
    });

    test('Cazador inexistente debe devolver 400', async () => {
      await request(app)
        .post('/hunters')
        .send({
          name: 'Elf8',
          location: 'Lugar10',
          race: 'Elf'
        })
        .expect(201);

        await request(app)
        .patch('/hunters?name=Elf8')
        .send({ foo: 'bar' })
        .expect(400);
    });

    test('Cazador inexistente debe devolver 400', async () => {
      await request(app)
        .post('/hunters')
        .send({
          name: 'Elf7',
          location: 'Lugar10',
          race: 'Elf'
        })
        .expect(201);

        await request(app)
        .patch('/hunters?name=Elf7')
        .send({
          name: 'Elf6',
          race: 'Elf'
        })
        .expect(500);
    });
    
  });

  describe('PATCH /hunters/:id', () => {
    let createdHunterId: string;
  
    beforeAll(async () => {
      const response = await request(app)
        .post("/hunters")
        .send({
          name: 'Elf150',
          location: 'Lugar10',
          race: 'Elf'
        })
        .expect(201);
    
      createdHunterId = response.body._id;
    });

    test('Actualiza correctamente el nombre del hunter', async () => {
      await request(app)
        .patch(`/hunters/${createdHunterId}`)
        .send({
          name: 'Elf150',
          location: 'Lugar101',
          race: 'Elf'
        })
        .expect(200);
    });

    test('Devuelve 404 si el ID no existe', async () => {
      const fakeId = '64f123456789012345678999';
      await request(app)
        .patch(`/hunters/${fakeId}`)
        .send({})
        .expect(404);
    });

    test('Devuelve 400 si se intenta actualizar campo no permitido', async () => {
      await request(app)
        .patch(`/hunters/${createdHunterId}`)
        .send({ forbiddenField: 'Te olvidaste de actualizar un campo' })
        .expect(400);
    });

    test('Devuelve 400 si el ID es inválido', async () => {
      await request(app)
        .patch('/hunters/invalid-id')
        .send({ name: 'ELf0' })
        .expect(500); 
    });
  });

  describe('DELETE /hunters', () => {
    test('Elimina un hunter por query name', async () => {
      await request(app)
        .post('/hunters')
        .send({
          name: 'Elf155',
          location: 'Lugar',
          race: 'Elf'
        })
        .expect(201);
    
      await request(app)
        .delete('/hunters?name=Elf155')
        .expect(200);
    });

    test('Devuelve 404 si no se encuentra ningún hunter con ese filtro', async () => {
      await request(app).delete("/hunters?name=inexistente").expect(404);
    });

    test('Devuelve 400 si no se pasa ningún filtro', async () => {
      const res = await request(app).delete('/hunters').expect(400);
      expect(res.body.error).toBe('A name must be provided');
    });
  });

  describe('DELETE /hunters/:id', () => {
    let hunterId: string;
  
  beforeAll(async () => {
    const response = await request(app)
      .post("/hunters")
      .send({
        name: 'Elf50',
          location: 'Lugar',
          race: 'Elf'
      })
      .expect(201);
  
			hunterId = response.body._id;
  });
  test('Elimina correctamente un bien existente', async () => {
    await request(app)
      .delete(`/hunters/${hunterId}`)
      .expect(200);

    const deleted = await Client.findById(hunterId);
    expect(deleted).toBeNull();
  });

  test('Devuelve 404 si el bien no existe', async () => {
    const fakeId = `64f123456789012345678999`; 
    await request(app)
      .delete(`/hunters/${fakeId}`)
      .expect(404);
  });

  test('Devuelve 500 si el ID es inválido', async () => {
    await request(app)
      .delete('/hunters/invalid-id')
      .expect(500);
  });
  });
});