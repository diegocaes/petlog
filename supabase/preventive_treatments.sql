-- Tabla para tratamientos preventivos: antipulgas y desparasitante
-- Ejecutar en Supabase SQL Editor

CREATE TABLE IF NOT EXISTS preventive_treatments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id        UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  type          TEXT NOT NULL CHECK (type IN ('antipulgas', 'desparasitante')),
  date_given    DATE NOT NULL,
  product_name  TEXT,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index para queries frecuentes
CREATE INDEX IF NOT EXISTS idx_preventive_treatments_pet_id
  ON preventive_treatments(pet_id, type, date_given DESC);

-- RLS
ALTER TABLE preventive_treatments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own pet treatments"
  ON preventive_treatments
  FOR ALL
  USING (
    pet_id IN (
      SELECT id FROM pets WHERE user_id = auth.uid()
    )
  );
