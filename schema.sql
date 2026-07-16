CREATE EXTENSION IF NOT EXISTS pgcrypto;   
CREATE EXTENSION IF NOT EXISTS btree_gist; 


CREATE TYPE rdv_statut AS ENUM ('confirme', 'annule');


CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);

CREATE TABLE medecins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);

CREATE TABLE rendez_vous (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id  UUID NOT NULL REFERENCES patients(id),
    medecin_id  UUID NOT NULL REFERENCES medecins(id),
    debut       TIMESTAMPTZ NOT NULL,
    fin         TIMESTAMPTZ NOT NULL,
    statut      rdv_statut  NOT NULL DEFAULT 'confirme',
    motif       TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (fin > debut),

    CONSTRAINT no_double_booking
        EXCLUDE USING gist (
            medecin_id WITH =,
            tstzrange(debut, fin) WITH &&
        ) WHERE (statut = 'confirme')
);

CREATE INDEX idx_rdv_patient ON rendez_vous (patient_id);
CREATE INDEX idx_rdv_medecin ON rendez_vous (medecin_id);