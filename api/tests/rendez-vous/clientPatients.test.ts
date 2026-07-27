import { describe, it, expect } from 'vitest'
import { verifierExistencePatient } from '../../src/rendez-vous/clientPatients.js'

describe('verifierExistencePatient', () => {
  it('retourne true pour un patient connu du stub', async () => {
    const existe = await verifierExistencePatient('11111111-1111-4111-8111-111111111111')

    expect(existe).toBe(true)
  })

  it('retourne false pour un patient inconnu', async () => {
    const existe = await verifierExistencePatient('inconnu')

    expect(existe).toBe(false)
  })
})