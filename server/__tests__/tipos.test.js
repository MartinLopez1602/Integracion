// server/__tests__/tipos.test.js
const request = require('supertest');
const app = require('../app'); // Usar la app principal en lugar de crear una nueva

describe('API de Tipos de Producto', () => {

  test('GET /api/tipo-producto retorna tipos de productos', async () => {
    const response = await request(app)
      .get('/api/tipo-producto')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    if (response.body.length > 0) {
      expect(response.body[0]).toHaveProperty('id_tipoprod');
      expect(response.body[0]).toHaveProperty('nombre_tipoprod');
    }
  });
});