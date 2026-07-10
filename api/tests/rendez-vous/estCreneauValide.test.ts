/// <reference types="vitest/globals" />
import { estCreneauValide } from '../../src/rendez-vous/estCreneauValide.js'

const UNE_HEURE_MS = 60 * 60 * 1000

describe('estCreneauValide', () => {
  it('refuse un créneau dont la fin précède le début', () => {
    const debut = new Date(Date.now() + UNE_HEURE_MS)
    const fin = new Date(Date.now())

    expect(estCreneauValide(debut, fin)).toBe(false)
  })

  it('refuse un créneau dont le début est déjà passé', () => {
    const debut = new Date(Date.now() - UNE_HEURE_MS)
    const fin = new Date(Date.now() + UNE_HEURE_MS)

    expect(estCreneauValide(debut, fin)).toBe(false)
  })

  it('accepte un créneau futur avec une fin après le début', () => {
    const debut = new Date(Date.now() + UNE_HEURE_MS)
    const fin = new Date(Date.now() + 2 * UNE_HEURE_MS)

    expect(estCreneauValide(debut, fin)).toBe(true)
  })
})
