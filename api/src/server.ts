import { app } from './app.js'

// Le .env n'est pas versionné : absent au clone ou en prod, on tombe alors
// sur les variables d'environnement du système. On ne veut pas planter pour ça.
try {
  process.loadEnvFile()
} catch {
  // pas de fichier .env, rien à charger
}

const port = Number(process.env.PORT ?? 3000)

app.listen(port, () => {
  console.log(`API HealthSync à l'écoute sur http://localhost:${port}`)
})
