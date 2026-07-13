import { loadFeature, describeFeature } from '@amiceli/vitest-cucumber'
import { expect } from 'vitest'
import request from 'supertest'
import { app } from '../../src/app.js'

const feature = await loadFeature('./creneau.feature', { language: 'fr' })
const UNE_HEURE_MS = 60 * 60 * 1000


describeFeature(feature, ({ Scenario }) => {
      Scenario("Refus d'une demande dont la fin précède le début", ({ Given, When, Then }) =>
      {
            let debut: Date
            let fin: Date
            let statutReponse: number

            Given("une demande de rendez-vous avec un début dans le futur et une fin avant ce début"
            , () => {
                  debut = new Date(Date.now() + UNE_HEURE_MS)
                  fin = new Date(Date.now())
            })

            When("le patient envoie la demande", async () => {
                  const reponse = await request(app).post('/rendez-vous').send({debut, fin})
                  statutReponse = reponse.status
            })

            Then("l'API répond avec le code 400", () => {
                  expect(statutReponse).toBe(400)
            })
      })
      
      Scenario("Refus d'une demande dont le début est déjà passé", ({ Given, When, Then }) =>
      {
            let debut: Date
            let fin: Date
            let statutReponse: number

            Given("une demande de rendez-vous dont le début est déjà passé"
            , () => {
                  debut = new Date(Date.now() - UNE_HEURE_MS)
                  fin = new Date(Date.now() + UNE_HEURE_MS)
            })

            When("le patient envoie la demande", async () => {
                  const reponse = await request(app).post('/rendez-vous').send({debut, fin})
                  statutReponse = reponse.status
            })

            Then("l'API répond avec le code 400", () => {
                  expect(statutReponse).toBe(400)
            })
      })


})

