import { Router } from "express";
import { z } from "zod";
import { estCreneauValide } from "./estCreneauValide.js";

const RendezVousSchema = z.object({
  debut: z.coerce.date(),
  fin: z.coerce.date(),
});

export const rendezVousRouteur = Router();

rendezVousRouteur.post("/rendez-vous", (req, res) => {
  const schema = RendezVousSchema.safeParse(req.body);
  if (!schema.success) {
    return res.status(400).json({ erreur: "Corps de requête invalide" });
  }

  const { debut, fin } = schema.data;

  if (!estCreneauValide(debut, fin)) {
    return res.status(400).json({ erreur: "Créneau invalide" });
  }

  res.status(501).json({ erreur: "Création non implémentée" });
});
