import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { loadSync } from "@grpc/proto-loader";
import { loadPackageDefinition, credentials } from "@grpc/grpc-js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const packageDefinition = loadSync(
  join(__dirname, "../../../grpc-service/proto/patients.proto"),
  {
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  },
);

const proto = loadPackageDefinition(packageDefinition) as any;

const host = process.env.GRPC_PATIENTS_HOST ?? "localhost";
const port = process.env.GRPC_PATIENTS_PORT ?? "50051";

const client = new proto.healthsync.patients.PatientService(
  `${host}:${port}`,
  credentials.createInsecure(),
);

export function verifierExistencePatient(patientId: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    client.VerifierExistence(
      { patientId },
      (erreur: Error | null, reponse: { existe: boolean }) => {
        if (erreur) {
          reject(erreur);
          return;
        }
        resolve(reponse.existe);
      },
    );
  });
}
