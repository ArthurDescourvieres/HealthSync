import express from 'express'
import { rendezVousRouteur } from './rendez-vous/routeur.js'

export const app = express()

app.use(express.json())

app.use(rendezVousRouteur)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})
