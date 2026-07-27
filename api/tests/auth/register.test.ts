/// <reference types="vitest/globals" />

import argon2 from 'argon2'
import { pool } from '../../src/db/pool.js'
import { app } from '../../src/app.js'
import request from 'supertest'

const payloadValide = {
  nom: 'Dupont',
  prenom: 'Alice',
  email: 'alice.register@example.com',
  telephone: '0601020304',
  dateNaissance: '1990-05-12',
  motDePasse: 'Motdepasse123',
}

const emailsDeTest = [payloadValide.email, 'bob.register@example.com']

async function nettoyerPatients() {
  await pool.query('DELETE FROM patients WHERE email = ANY($1)', [emailsDeTest])
}

describe('POST /auth/register', () => {
  beforeAll(nettoyerPatients)
  afterAll(nettoyerPatients)

  it('renvoie 201 avec le patient créé, sans le mot de passe', async () => {
    const reponse = await request(app).post('/auth/register').send(payloadValide)

    expect(reponse.status).toBe(201)
    expect(reponse.body).toMatchObject({
      nom: 'Dupont',
      prenom: 'Alice',
      email: payloadValide.email,
      telephone: '0601020304',
      role: 'patient',
    })
    expect(reponse.body.id).toBeDefined()
    expect(reponse.body).not.toHaveProperty('mot_de_passe')
    expect(reponse.body).not.toHaveProperty('mot_de_passe_hash')
    expect(reponse.body).not.toHaveProperty('motDePasse')
  })

  it('stocke le mot de passe haché avec argon2, jamais en clair', async () => {
    const resultat = await pool.query(
      'SELECT mot_de_passe_hash FROM patients WHERE email = $1',
      [payloadValide.email],
    )

    expect(resultat.rows).toHaveLength(1)
    const hash = resultat.rows[0].mot_de_passe_hash
    expect(hash).toMatch(/^\$argon2/)
    expect(hash).not.toContain(payloadValide.motDePasse)
    expect(await argon2.verify(hash, payloadValide.motDePasse)).toBe(true)
  })

  it('renvoie 409 quand l’email existe déjà en base', async () => {
    const reponse = await request(app)
      .post('/auth/register')
      .send({ ...payloadValide, email: payloadValide.email.toUpperCase() })

    expect(reponse.status).toBe(409)
  })

  it('renvoie 422 avec le détail des champs pour un email mal formé', async () => {
    const reponse = await request(app)
      .post('/auth/register')
      .send({ ...payloadValide, email: 'pas-un-email' })

    expect(reponse.status).toBe(422)
    expect(reponse.body.champs).toHaveProperty('email')
  })

  it('renvoie 422 avec le détail des champs pour un champ manquant', async () => {
    const { nom: _omis, ...sansNom } = payloadValide
    const reponse = await request(app).post('/auth/register').send(sansNom)

    expect(reponse.status).toBe(422)
    expect(reponse.body.champs).toHaveProperty('nom')
  })

  it('renvoie 422 avec le détail des champs pour un mot de passe trop court', async () => {
    const reponse = await request(app)
      .post('/auth/register')
      .send({ ...payloadValide, motDePasse: 'court1' })

    expect(reponse.status).toBe(422)
    expect(reponse.body.champs).toHaveProperty('motDePasse')
  })

  it('attribue toujours le rôle patient, même si l’appelant déclare admin', async () => {
    const reponse = await request(app)
      .post('/auth/register')
      .send({ ...payloadValide, email: 'bob.register@example.com', role: 'admin' })

    expect(reponse.status).toBe(201)
    expect(reponse.body.role).toBe('patient')

    const resultat = await pool.query(
      'SELECT role FROM patients WHERE email = $1',
      ['bob.register@example.com'],
    )
    expect(resultat.rows[0].role).toBe('patient')
  })
})
