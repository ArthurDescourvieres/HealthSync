import { Router } from "express";
import { z } from "zod";
import argon2 from "argon2";
import { pool } from "../db/pool.js";

const InscriptionSchema = z.object({
  nom: z.string().trim().min(1),
  prenom: z.string().trim().min(1),
  email: z.email(),
  telephone: z.string().trim().min(1),
  dateNaissance: z.coerce.date().max(new Date(), {
    error: "La date de naissance doit être dans le passé",
  }),
  motDePasse: z
    .string()
    .min(12, { error: "Le mot de passe doit contenir au moins 12 caractères" })
    .regex(/[A-Za-z]/, {
      error: "Le mot de passe doit contenir au moins une lettre",
    })
    .regex(/[0-9]/, {
      error: "Le mot de passe doit contenir au moins un chiffre",
    }),
});

export const authRouteur = Router();

authRouteur.post("/auth/register", async (req, res) => {
  const schema = InscriptionSchema.safeParse(req.body);
  if (!schema.success) {
    const { fieldErrors } = z.flattenError(schema.error);
    return res.status(422).json({
      erreur: "Corps de requête invalide",
      champs: fieldErrors,
    });
  }

  const { nom, prenom, telephone, dateNaissance, motDePasse } = schema.data;
  const email = schema.data.email.trim().toLowerCase();

  const hash = await argon2.hash(motDePasse);

  try {
    const resultat = await pool.query(
      `INSERT INTO patients (nom, prenom, email, telephone, date_naissance, mot_de_passe_hash, role)
       VALUES ($1, $2, $3, $4, $5, $6, 'patient')
       RETURNING id, nom, prenom, email, telephone, date_naissance, role`,
      [nom, prenom, email, telephone, dateNaissance, hash],
    );

    return res.status(201).json(resultat.rows[0]);
  } catch (erreur) {
    if ((erreur as { code?: string }).code === "23505") {
      return res.status(409).json({ erreur: "Email déjà utilisé" });
    }
    throw erreur;
  }
});
