import { chargerEnv } from './chargerEnv.js'

chargerEnv()

const { app } = await import('./app.js')

const port = Number(process.env.PORT ?? 3000)

app.listen(port, () => {
  console.log(`API HealthSync à l'écoute sur http://localhost:${port}`)
})
