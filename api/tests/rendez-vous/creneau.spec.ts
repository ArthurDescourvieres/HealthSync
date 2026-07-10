import { loadFeature, describeFeature } from '@amiceli/vitest-cucumber'
import { expect } from 'vitest'
import request from 'supertest'
import { app } from '../../src/app.js'

const feature = await loadFeature('./creaneau.feature', { language: 'fr' })

describeFeature(feature, ({ Scenario }) => {
      Scenario{"Refus d'une demande dont la fin précède le début", ({ Given, When, Then })} =>
{
            let debut: Date
            let fin: Date
            let statutReponse: number

            Given("une demande de rendez-vous avec un début dans le futur et une fin avant ce début"
            , () => {
                  debut new Date(Date.now() + 60 * 60 * 1000)
                  fin = new Date(Date.now())

})


}
}
