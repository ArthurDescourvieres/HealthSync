import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { loadSync } from '@grpc/proto-loader'
import { loadPackageDefinition, Server, ServerCredentials } from '@grpc/grpc-js'
import type { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const packageDefinition = loadSync(join(__dirname, '../proto/patients.proto'), {
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
})

const proto = loadPackageDefinition(packageDefinition) as any

// En attendant la partie de konstantine
const idPatient = new Set(['11111111-1111-4111-8111-111111111111'])

const server = new Server()

server.addService(proto.healthsync.patients.PatientService.service, {
      VerifierExistence(appel: ServerUnaryCall<any, any>, callback: sendUnaryData<any>) {
            const existe = idPatient.has(appel.request.patientId)
            callback(null, { existe })
      },
})

const port = Number(process.env.GRPC_PORT ?? 50051)

server.bindAsync(`0.0.0.0:${port}`, ServerCredentials.createInsecure(), (erreur, portLie) => {
      if (erreur) {
            console.error('Échec du démarrage du serveur gRPC :', erreur.message)
            return
      }

      console.log(`Service gRPC Patients (stub) à l'écoute sur le port ${portLie}`)
})