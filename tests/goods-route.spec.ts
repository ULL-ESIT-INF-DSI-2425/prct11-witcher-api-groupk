import { beforeAll, describe, expect, test, beforeEach } from "vitest";
import request from 'supertest';
import { app } from "../src/routes/main-app.js";
import { Good } from "../src/items/good";

const bien1 = {
  "name": "Bien1",
	"description": "RecuperaVida",
	"weight": 0.5,
	"crowns": 10
}

const bien2 = {
  "name": "Bien2",
	"description": "RecuperaVida",
	"weight": 0.5,
	"crowns": 10
}

const bien3 = {
  "name": "Bien3",
	"description": "RecuperaVida",
	"weight": 0.5,
	"crowns": 10
}

beforeAll(async () => {
	await Good.deleteMany();
  await new Good(bien1).save();
  await new Good(bien2).save();
  await new Good(bien3).save();
});

describe('/goods', () => {
  describe('POST /goods', () => {
    describe('Creaciones correctas', () => {
      test('Crea un nuevo bien 1', async () => {
        const res = await request(app)
          .post('/goods')
          .send({
            name: 'Bien10',
            description: 'Descripcion',
            weight: 10,
            crowns: 10
          })
          .expect(201);

          expect(res.body).to.include({
            name: 'Bien10',
            description: 'Descripcion',
            weight: 10,
            crowns: 10
          });
      });

      test('Crea un nuevo bien 2', async () => {
        const res = await request(app)
        .post('/goods')
        .send({
          name: 'Bien20',
          description: 'Descripcion1',
          weight: 15,
          crowns: 10
        })
        .expect(201);

        expect(res.body).to.include({
          name: 'Bien20',
          description: 'Descripcion1',
          weight: 15,
          crowns: 10
        });
      });

      test('Crea un nuevo bien 3', async () => {
        const res = await request(app)
        .post('/goods')
        .send({
          name: 'Bien30',
          description: 'Descripcion2',
          weight: 10,
          crowns: 20
        })
        .expect(201);

        expect(res.body).to.include({
          name: 'Bien30',
          description: 'Descripcion2',
          weight: 10,
          crowns: 20
        });
      });
    });

    describe('Creaciones incorrectas', () => {
      test('Crea un nuevo con nombre repetido', async () => {
        await request(app)
          .post('/goods')
          .send({
            name: 'Bien1',
            description: 'Descripcion',
            weight: 10,
            crowns: 10
          })
          .expect(400);
      });

      test('Crea un nuevo con nombre incorrecto', async () => {
        await request(app)
          .post('/goods')
          .send({
            name: '/',
            description: 'Descripcion',
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
          weight: 10,
          crowns: -10
        }).expect(400);
      });
    });
	});

	describe('GET /goods', () => {
			describe('obtenciones correctas', () => {
				test('Obtener el Bien1', async () => {
					const res = await request(app).get("/goods?name=Bien1").expect(200);

          expect(res.body[0]).to.include({
            name: "Bien1",
            description: "RecuperaVida",
            weight: 0.5,
            crowns: 10
          })
				})

				test('Obtener los bienes con descripción RecuperaVida', async () => {
					const res = await request(app).get("/goods?description=RecuperaVida");
          expect(res.statusCode).toBe(200);

          expect(res.body[0]).to.include({
            name: "Bien1",
            description: "RecuperaVida",
            weight: 0.5,
            crowns: 10
          })

          expect(res.body[1]).to.include({
            name: "Bien2",
            description: "RecuperaVida",
            weight: 0.5,
            crowns: 10
          })

          expect(res.body[2]).to.include({
            name: "Bien3",
            description: "RecuperaVida",
            weight: 0.5,
            crowns: 10
          })
				})

				test('Obtener un bien con varios argumentos', async () => {
					const res = await request(app).get("/goods?name=Bien3&description=RecuperaVida&crowns=10").expect(200);

          expect(res.body[0]).to.include({
            name: "Bien3",
            description: "RecuperaVida",
            weight: 0.5,
            crowns: 10
          })
				})
			})

      describe('obtenciones incorrectas', () => {
        test('Bien inexistente debe devolver 404', async () => {
          await request(app).get("/goods?name=inexistente").expect(404);
        });

        test('Bien inexistente debe devolver 404', async () => {
          await request(app).get("/goods?name=inexistente&description=RecuperaVida").expect(404);
        });

        test('Solicitud que debe devolver 500', async () => {
          await request(app).get('/goods?weight=notANumber').expect(500);
        });
      })
	});

  describe("GET /goods/:id", () => {
    let createdGoodId: string;
  
    beforeAll(async () => {
      const response = await request(app)
        .post("/goods")
        .send({
          name: 'Bien15',
					description: 'Descripcion',
					weight: 10,
					crowns: 10
        })
        .expect(201);
  
      createdGoodId = response.body._id;
    });
  
    test("Muestra un bien por su ID", async () => {
      const response = await request(app)
        .get(`/goods/${createdGoodId}`)
        .expect(200);
  
      expect(response.body).to.include({
        name: 'Bien15',
				description: 'Descripcion',
				weight: 10,
				crowns: 10
      });
  
      const goodFromDb = await Good.findById(createdGoodId);
      expect(goodFromDb).not.toBeNull();
      expect(goodFromDb!.name).to.equal("Bien15");
    });

		test("Muestra error 404", async () => {
      await request(app)
        .get(`/goods/64f123456789012345678999`)
        .expect(404);
    });

		test("Muestra error 500", async () => {
      const response = await request(app)
        .get(`/goods/091735234571`)
        .expect(500);
    });
  });
});

describe('PATCH /goods', () => {
  
  test('Actualiza correctamente un bien por name', async () => {
		let res = await request(app)
      .post("/goods")
      .send({
        name: 'Bien122',
        description: 'Descripcion',
        weight: 10,
        crowns: 10
      })
      .expect(201);

      expect(res.body).to.include({
        name: 'Bien122',
        description: 'Descripcion',
        weight: 10,
        crowns: 10
      });
  
			res = await request(app)
      .patch(`/goods?name=Bien122`)
      .send({
        weight: 20,
        crowns: 20
      })
      .expect(200);

      expect(res.body).to.include({
        name: 'Bien122',
        description: 'Descripcion',
        weight: 20,
        crowns: 20
      });
  });

  test('Devuelve 404 si el bien no existe', async () => {
    await request(app)
      .patch('/goods')
      .query({ name: 'NoExiste' })
      .send({ description: 'Nada' })
      .expect(404);
  });

  test('Devuelve 400 si la actualización no es correcta', async () => {
    await request(app)
      .patch('/goods')
      .send({ description: '/' })
      .expect(400);
  });

  test('Devuelve 400 si no se pasan parámetros de query', async () => {
    await request(app)
      .patch('/goods')
      .send({ description: 'Nada' })
      .expect(400);
  });

  test('Devuelve 400 si no se pasa body', async () => {
    await request(app)
      .patch('/goods')
      .query({ name: 'EspadaRota' })
      .expect(400);
  });

  test('Devuelve 400 si el campo a actualizar no está permitido', async () => {
    await request(app)
      .patch('/goods')
      .query({ name: 'EspadaRota' })
      .send({ forbiddenField: 'X' })
      .expect(400);
  });
});

describe('PATCH /goods/:id', () => {
  let createdGoodId: string;
  
  beforeAll(async () => {
    const response = await request(app)
      .post("/goods")
      .send({
        name: 'Bien150',
        description: 'Descripcion',
        weight: 10,
        crowns: 10
      })
      .expect(201);
  
    createdGoodId = response.body._id;
  });

  test('Actualiza correctamente el nombre del bien', async () => {
    const res = await request(app)
      .patch(`/goods/${createdGoodId}`)
      .send({
        name: 'Bien150',  
        description: 'Descripcion',
        weight: 20,
        crowns: 10
      })
      .expect(200);

      expect(res.body).to.include({
        name: 'Bien150',  
        description: 'Descripcion',
        weight: 20,
        crowns: 10
      })
  });

  test('Devuelve 404 si el ID no existe', async () => {
    const fakeId = '64f123456789012345678999';
    await request(app)
      .patch(`/goods/${fakeId}`)
			.send({})
      .expect(404);
  });

  test('Devuelve 400 si el ID es inválido', async () => {
    await request(app)
      .patch('/goods/invalid-id')
      .send({ name: 'Espada Malformada' })
      .expect(400); 
  });

  test('Devuelve 400 si se intenta actualizar campo no permitido', async () => {
    await request(app)
      .patch(`/goods/${createdGoodId}`)
      .send({ forbiddenField: 'Te olvidaste de actualizar un campo' })
      .expect(400);
  });
});	

describe('DELETE /goods', () => {
  test('Elimina un bien por query name', async () => {
    await request(app)
			.post('/goods')
			.send({
					name: 'Bien100',
					description: 'Descripcion',
					weight: 10,
					crowns: 10
			})
			.expect(201);
  
    const res = await request(app)
      .delete('/goods?name=Bien100')
      .expect(200);

    expect(res.body).to.include({
      name: 'Bien100',
			description: 'Descripcion',
			weight: 10,
			crowns: 10
    })
  });

  test('Devuelve 404 si no se encuentra ningún bien con ese filtro', async () => {
    await request(app).delete("/goods?name=inexistente").expect(404);
  });

  test('Devuelve 400 si no se pasa ningún filtro', async () => {
    const res = await request(app).delete('/goods').expect(400);
    expect(res.body.error).toBe('A name must be provided');
  });
});

describe('DELETE /goods/:id', () => {
  let goodId: string;
  
  beforeAll(async () => {
    const response = await request(app)
      .post("/goods")
      .send({
        name: 'Bien155',
        description: 'Descripcion',
        weight: 10,
        crowns: 10
      })
      .expect(201);
  
			goodId = response.body._id;
  });

  test('Elimina correctamente un bien existente', async () => {
    const res = await request(app)
      .delete(`/goods/${goodId}`)
      .expect(200);

    expect(res.body).to.include({
      name: 'Bien155',
      description: 'Descripcion',
      weight: 10,
      crowns: 10
    })

    const deleted = await Good.findById(goodId);
    expect(deleted).toBeNull();
  });

  test('Devuelve 404 si el bien no existe', async () => {
    const fakeId = `64f123456789012345678999`; 
    await request(app)
      .delete(`/goods/${fakeId}`)
      .expect(404);
  });

  test('Devuelve 500 si el ID es inválido', async () => {
    await request(app)
      .delete('/goods/invalid-id')
      .expect(500);
  });
});