export interface Pet {
  id: string;
  user_id: string;
  name: string;
  breed: string | null;
  birth_date: string | null;
  gender: string | null;
  weight_kg: number | null;
  photo_url: string | null;
  chip_id: string | null;
  color: string | null;
  theme_color: string | null;
  is_neutered: boolean | null;
  created_at: string;
}

export interface Vaccine {
  id: string;
  pet_id: string;
  name: string;
  date_given: string;
  next_due: string | null;
  vet_name: string | null;
  notes: string | null;
  created_at: string;
}

export interface VetVisit {
  id: string;
  pet_id: string;
  date: string;
  reason: string;
  vet_name: string | null;
  location: string | null;
  diagnosis: string | null;
  treatment: string | null;
  cost: number | null;
  notes: string | null;
  created_at: string;
}

export interface Grooming {
  id: string;
  pet_id: string;
  date: string;
  type: string;
  groomer_name: string | null;
  location: string | null;
  cost: number | null;
  notes: string | null;
  created_at: string;
}

export interface Food {
  id: string;
  pet_id: string;
  brand: string;
  food_type: string | null;
  /** @deprecated use food_type */
  type: string | null;
  daily_grams: number | null;
  bag_size: number | null;
  bag_unit: string | null;
  amount_grams: number | null;
  frequency: string | null;
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
  created_at: string;
}

export interface Flight {
  id: string;
  pet_id: string;
  airline: string;
  flight_number: string | null;
  origin: string;
  destination: string;
  flight_date: string;
  cabin_or_cargo: string;
  crate_approved: boolean;
  vet_certificate: boolean;
  chip_verified: boolean;
  vaccines_updated: boolean;
  import_permit: boolean;
  health_certificate: boolean;
  notes: string | null;
  created_at: string;
}

export interface FlightDocument {
  id: string;
  flight_id: string;
  name: string;
  file_url: string;
  created_at: string;
}

export interface Adventure {
  id: string;
  pet_id: string;
  title: string;
  description: string | null;
  date: string;
  location: string | null;
  photo_url: string | null;
  created_at: string;
}

export interface WeightRecord {
  id: string;
  pet_id: string;
  weight_kg: number;
  date: string;
  notes: string | null;
  created_at: string;
}
