import { describe, test, beforeAll, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/routes/main-app.js';

describe('Pruebas de /{*splat}', () => {
  test('Error con ruta inexistente (Post)', async () => {
    await request(app).post('/clients').expect(501);
  });

  test('Error con ruta inexistente II (Post)', async () => {
    await request(app).post('/something').expect(501);
  });

  test('Error con ruta inexistente (Get)', async () => {
    await request(app).get('/clients').expect(501);
  });

  test('Error con ruta inexistente (Patch)', async () => {
    await request(app).patch('/something').expect(501);
  });

  test('Error con ruta inexistente (Delete)', async () => {
    await request(app).delete('/noDestination').expect(501);
  });
});