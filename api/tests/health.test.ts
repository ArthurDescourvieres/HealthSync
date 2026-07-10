/// <reference types="vitest/globals" />

describe('GET /health', () => {
  it('répond 200 avec le statut ok', async () => {
    const { default: request } = await import('supertest')
    const { app } = await import('../src/app.js')

    const reponse = await request(app).get('/health')

    expect(reponse.status).toBe(200)
    expect(reponse.body).toEqual({ status: 'ok' })
  })
})
