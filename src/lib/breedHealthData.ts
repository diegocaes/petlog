/**
 * Breed health data for the PetLog dog health scoring system.
 *
 * Sources:
 * - AKC Official Breed Standards (images.akc.org/pdf/breeds/standards/)
 * - WSAVA Hereditary Disease Guidelines (wsava.org/global-guidelines/hereditary-disease/)
 * - Gough, Thomas & O'Neill — "Breed Predispositions to Disease in Dogs and Cats", 3rd Ed. (Wiley, 2018)
 * - VetCompass Programme, Royal Veterinary College UK (rvc.ac.uk/vetcompass)
 * - OFA (Orthopedic Foundation for Animals) breed statistics (ofa.org)
 * - PennHIP breed data
 * - Frontiers in Veterinary Science — Dog Aging Project lifetime prevalence study (2023)
 * - UFAW breed-specific welfare notes (ufaw.org.uk)
 * - PubMed studies cited inline
 *
 * Weight ranges represent the combined male/female adult range per AKC/FCI breed standards.
 * lifespanYears is the published average midpoint lifespan from breed health surveys.
 */

export type SizeCategory = 'toy' | 'small' | 'medium' | 'large' | 'giant';
export type RiskLevel = 'low' | 'medium' | 'high' | 'very_high';

export type HealthRisk =
  | 'obesity'
  | 'hip_dysplasia'
  | 'elbow_dysplasia'
  | 'exercise_induced_collapse'
  | 'cancer'
  | 'cardiac_disease'
  | 'dilated_cardiomyopathy'
  | 'mitral_valve_disease'
  | 'arrhythmia'
  | 'degenerative_myelopathy'
  | 'brachycephalic_syndrome'
  | 'dental_disease'
  | 'epilepsy'
  | 'eye_disease'
  | 'skin_disease'
  | 'bloat'
  | 'patellar_luxation'
  | 'hypothyroidism'
  | 'tracheal_collapse'
  | 'intervertebral_disc_disease'
  | 'progressive_retinal_atrophy'
  | 'addisons_disease'
  | 'osteosarcoma'
  | 'histiocytic_sarcoma'
  | 'von_willebrand_disease'
  | 'hyperuricosuria'
  | 'deafness'
  | 'syringomyelia'
  | 'pancreatitis'
  | 'renal_dysplasia'
  | 'portosystemic_shunt'
  | 'glaucoma'
  | 'ear_infections'
  | 'multiple_drug_sensitivity'
  | 'urinary_stones';

export interface BreedHealthData {
  idealWeightKgMin: number;
  idealWeightKgMax: number;
  sizeCategory: SizeCategory;
  /** Average lifespan in years (midpoint from published breed health survey data) */
  lifespanYears: number;
  /** Top 3–4 veterinary-confirmed health predispositions for the breed */
  risks: HealthRisk[];
  dentalRisk: RiskLevel;
  cardiacRisk: RiskLevel;
  obesityRisk: RiskLevel;
}

/**
 * Keyed by breed slug (snake_case).
 * Weights are in kg covering the combined male + female adult range per breed standard.
 */
export const BREED_HEALTH_DATA: Record<string, BreedHealthData> = {

  // ─── RETRIEVERS ────────────────────────────────────────────────────────────

  labrador_retriever: {
    // AKC std: males 65–80 lb, females 55–70 lb → 25–36 kg
    idealWeightKgMin: 25,
    idealWeightKgMax: 36,
    sizeCategory: 'large',
    lifespanYears: 12,
    // OFA: #1 breed for hip dysplasia submissions; VetCompass: obesity & EIC well-documented
    risks: ['obesity', 'hip_dysplasia', 'elbow_dysplasia', 'exercise_induced_collapse'],
    dentalRisk: 'low',
    cardiacRisk: 'low',
    obesityRisk: 'very_high',
  },

  golden_retriever: {
    // AKC std: males 65–75 lb, females 55–65 lb → 25–34 kg
    idealWeightKgMin: 25,
    idealWeightKgMax: 34,
    sizeCategory: 'large',
    lifespanYears: 11,
    // Golden Retriever Lifetime Study (Morris Animal Foundation): cancer ~61% cause of death
    risks: ['cancer', 'hip_dysplasia', 'elbow_dysplasia', 'cardiac_disease'],
    dentalRisk: 'low',
    cardiacRisk: 'medium',
    obesityRisk: 'high',
  },

  flat_coated_retriever: {
    // AKC std: 25–36 kg
    idealWeightKgMin: 25,
    idealWeightKgMax: 36,
    sizeCategory: 'large',
    lifespanYears: 9,
    // >50% die of cancer; histiocytic sarcoma predominant (PubMed 19453365); median lifespan ~9 yrs
    risks: ['cancer', 'histiocytic_sarcoma', 'hip_dysplasia', 'glaucoma'],
    dentalRisk: 'low',
    cardiacRisk: 'low',
    obesityRisk: 'medium',
  },

  // ─── GERMAN SHEPHERD ───────────────────────────────────────────────────────

  german_shepherd: {
    // AKC: males 30–40 kg, females 22–32 kg
    idealWeightKgMin: 22,
    idealWeightKgMax: 40,
    sizeCategory: 'large',
    lifespanYears: 11,
    // Gough/Thomas/O'Neill: degenerative myelopathy, hip dysplasia, bloat, perianal fistula
    risks: ['degenerative_myelopathy', 'hip_dysplasia', 'elbow_dysplasia', 'bloat'],
    dentalRisk: 'low',
    cardiacRisk: 'low',
    obesityRisk: 'medium',
  },

  // ─── BULLDOGS & BRACHYCEPHALIC ─────────────────────────────────────────────

  french_bulldog: {
    // AKC std: max 28 lb (12.7 kg); in practice 8–13 kg
    idealWeightKgMin: 8,
    idealWeightKgMax: 13,
    sizeCategory: 'small',
    lifespanYears: 9,
    // VetCompass UK (Pegram 2021): BOAS, skin fold dermatitis, eye disease most prevalent
    risks: ['brachycephalic_syndrome', 'skin_disease', 'eye_disease', 'intervertebral_disc_disease'],
    dentalRisk: 'very_high',
    cardiacRisk: 'medium',
    obesityRisk: 'high',
  },

  bulldog: {
    // AKC std: approx 23 kg (50 lb) for males; females slightly less
    idealWeightKgMin: 18,
    idealWeightKgMax: 25,
    sizeCategory: 'medium',
    lifespanYears: 8,
    // Nature Scientific Reports 2020: skin fold, BOAS, patellar luxation top UK conditions
    risks: ['brachycephalic_syndrome', 'skin_disease', 'hip_dysplasia', 'patellar_luxation'],
    dentalRisk: 'very_high',
    cardiacRisk: 'medium',
    obesityRisk: 'high',
  },

  pug: {
    // AKC std: 6–8 kg (14–18 lb)
    idealWeightKgMin: 6,
    idealWeightKgMax: 8,
    sizeCategory: 'toy',
    lifespanYears: 11,
    // UFAW: brachycephalic ocular syndrome; obesity very prevalent; skin fold dermatitis
    risks: ['brachycephalic_syndrome', 'eye_disease', 'obesity', 'skin_disease'],
    dentalRisk: 'very_high',
    cardiacRisk: 'low',
    obesityRisk: 'very_high',
  },

  shih_tzu: {
    // AKC std: 4–7 kg (9–16 lb)
    idealWeightKgMin: 4,
    idealWeightKgMax: 7,
    sizeCategory: 'toy',
    lifespanYears: 13,
    // UFAW brachycephalic ocular syndrome; dental disease due to small jaw; renal dysplasia
    risks: ['brachycephalic_syndrome', 'eye_disease', 'dental_disease', 'renal_dysplasia'],
    dentalRisk: 'very_high',
    cardiacRisk: 'low',
    obesityRisk: 'medium',
  },

  boston_terrier: {
    // AKC std: three weight classes, up to 25 lb (~11 kg)
    idealWeightKgMin: 5,
    idealWeightKgMax: 11,
    sizeCategory: 'small',
    lifespanYears: 13,
    // Brachycephalic + screw-tail spinal malformation; eye disease; patellar luxation
    risks: ['brachycephalic_syndrome', 'eye_disease', 'intervertebral_disc_disease', 'patellar_luxation'],
    dentalRisk: 'high',
    cardiacRisk: 'low',
    obesityRisk: 'medium',
  },

  // ─── POODLES ───────────────────────────────────────────────────────────────

  poodle_standard: {
    // AKC std: over 15 in at shoulder; 20–32 kg
    idealWeightKgMin: 20,
    idealWeightKgMax: 32,
    sizeCategory: 'medium',
    lifespanYears: 13,
    // Poodle Club of America: Addison's disease, bloat, hip dysplasia, sebaceous adenitis
    risks: ['addisons_disease', 'bloat', 'hip_dysplasia', 'eye_disease'],
    dentalRisk: 'medium',
    cardiacRisk: 'low',
    obesityRisk: 'low',
  },

  poodle_miniature: {
    // AKC std: 10–15 in; 5–9 kg
    idealWeightKgMin: 5,
    idealWeightKgMax: 9,
    sizeCategory: 'small',
    lifespanYears: 14,
    // PRA well-documented in miniature poodles; patellar luxation; tracheal collapse; epilepsy
    risks: ['progressive_retinal_atrophy', 'patellar_luxation', 'tracheal_collapse', 'epilepsy'],
    dentalRisk: 'high',
    cardiacRisk: 'low',
    obesityRisk: 'low',
  },

  poodle_toy: {
    // AKC std: under 10 in; 2–4 kg
    idealWeightKgMin: 2,
    idealWeightKgMax: 4,
    sizeCategory: 'toy',
    lifespanYears: 15,
    // Tracheal collapse + dental disease typical in toy poodles; patellar luxation; PRA
    risks: ['tracheal_collapse', 'dental_disease', 'patellar_luxation', 'progressive_retinal_atrophy'],
    dentalRisk: 'very_high',
    cardiacRisk: 'low',
    obesityRisk: 'low',
  },

  // ─── HOUNDS ────────────────────────────────────────────────────────────────

  beagle: {
    // AKC std: two varieties — up to 13 in or 13–15 in; 8–14 kg combined range
    idealWeightKgMin: 8,
    idealWeightKgMax: 14,
    sizeCategory: 'small',
    lifespanYears: 13,
    // VetCompass: ear infections, hypothyroidism, obesity; epilepsy known in breed
    risks: ['obesity', 'ear_infections', 'hypothyroidism', 'epilepsy'],
    dentalRisk: 'medium',
    cardiacRisk: 'low',
    obesityRisk: 'very_high',
  },

  dachshund: {
    // AKC std: standard 7–14 kg; miniature <5 kg. Combined range
    idealWeightKgMin: 4,
    idealWeightKgMax: 14,
    sizeCategory: 'small',
    lifespanYears: 14,
    // Gough/Thomas: IVDD paramount in breed; patellar luxation; dental disease; obesity
    risks: ['intervertebral_disc_disease', 'obesity', 'patellar_luxation', 'dental_disease'],
    dentalRisk: 'high',
    cardiacRisk: 'low',
    obesityRisk: 'very_high',
  },

  basset_hound: {
    // AKC std: 18–27 kg (40–60 lb)
    idealWeightKgMin: 18,
    idealWeightKgMax: 27,
    sizeCategory: 'medium',
    lifespanYears: 12,
    // Long back (chondrodystrophy) → IVDD; floppy ears → ear infections; obesity; glaucoma
    risks: ['intervertebral_disc_disease', 'ear_infections', 'obesity', 'glaucoma'],
    dentalRisk: 'medium',
    cardiacRisk: 'low',
    obesityRisk: 'very_high',
  },

  greyhound: {
    // AKC std: males 27–40 kg, females 27–34 kg
    idealWeightKgMin: 27,
    idealWeightKgMax: 40,
    sizeCategory: 'large',
    lifespanYears: 13,
    // Osteosarcoma risk in large deep-chested breed; bloat; sensitive skin; dental disease
    risks: ['osteosarcoma', 'bloat', 'skin_disease', 'dental_disease'],
    dentalRisk: 'high',
    cardiacRisk: 'low',
    obesityRisk: 'low',
  },

  whippet: {
    // AKC std: 7–14 kg (18–30 lb)
    idealWeightKgMin: 7,
    idealWeightKgMax: 14,
    sizeCategory: 'medium',
    lifespanYears: 14,
    // Generally very healthy; cardiac (mitral valve); eye disease; hypothyroidism
    risks: ['cardiac_disease', 'eye_disease', 'hypothyroidism', 'skin_disease'],
    dentalRisk: 'medium',
    cardiacRisk: 'medium',
    obesityRisk: 'low',
  },

  rhodesian_ridgeback: {
    // AKC std: males 36 kg (80 lb), females 32 kg (70 lb)
    idealWeightKgMin: 29,
    idealWeightKgMax: 41,
    sizeCategory: 'large',
    lifespanYears: 11,
    // Dermoid sinus (breed-specific); hip dysplasia; bloat; hypothyroidism
    risks: ['hip_dysplasia', 'bloat', 'hypothyroidism', 'elbow_dysplasia'],
    dentalRisk: 'low',
    cardiacRisk: 'low',
    obesityRisk: 'medium',
  },

  // ─── WORKING / GUARDIAN ────────────────────────────────────────────────────

  rottweiler: {
    // AKC std: males 50–60 kg, females 35–48 kg
    idealWeightKgMin: 35,
    idealWeightKgMax: 60,
    sizeCategory: 'large',
    lifespanYears: 9,
    // OFA: high hip dysplasia; osteosarcoma; subaortic stenosis; elbow dysplasia
    risks: ['osteosarcoma', 'hip_dysplasia', 'elbow_dysplasia', 'cardiac_disease'],
    dentalRisk: 'low',
    cardiacRisk: 'medium',
    obesityRisk: 'medium',
  },

  doberman_pinscher: {
    // AKC std: males 40–45 kg, females 32–35 kg
    idealWeightKgMin: 32,
    idealWeightKgMax: 45,
    sizeCategory: 'large',
    lifespanYears: 10,
    // DCM extremely prevalent (>50% by age 8 by echo); von Willebrand disease; DM
    risks: ['dilated_cardiomyopathy', 'von_willebrand_disease', 'degenerative_myelopathy', 'hip_dysplasia'],
    dentalRisk: 'low',
    cardiacRisk: 'very_high',
    obesityRisk: 'medium',
  },

  boxer: {
    // AKC std: males 27–32 kg, females 25–29 kg
    idealWeightKgMin: 25,
    idealWeightKgMax: 32,
    sizeCategory: 'medium',
    lifespanYears: 10,
    // Boxer cardiomyopathy (ARVC) is breed-specific; cancer; brachycephalic; hip dysplasia
    risks: ['arrhythmia', 'cancer', 'brachycephalic_syndrome', 'hip_dysplasia'],
    dentalRisk: 'medium',
    cardiacRisk: 'very_high',
    obesityRisk: 'medium',
  },

  great_dane: {
    // AKC std: males ~70 kg, females ~55 kg; range 50–90 kg
    idealWeightKgMin: 50,
    idealWeightKgMax: 90,
    sizeCategory: 'giant',
    lifespanYears: 8,
    // Bloat #1 cause of death in breed; DCM; osteosarcoma; wobbler syndrome
    risks: ['bloat', 'dilated_cardiomyopathy', 'osteosarcoma', 'hip_dysplasia'],
    dentalRisk: 'low',
    cardiacRisk: 'very_high',
    obesityRisk: 'medium',
  },

  mastiff: {
    // AKC std: males >68 kg, females >54 kg
    idealWeightKgMin: 54,
    idealWeightKgMax: 90,
    sizeCategory: 'giant',
    lifespanYears: 8,
    // Hip dysplasia; bloat; osteosarcoma; cardiac disease (DCM)
    risks: ['hip_dysplasia', 'bloat', 'osteosarcoma', 'cardiac_disease'],
    dentalRisk: 'low',
    cardiacRisk: 'medium',
    obesityRisk: 'high',
  },

  bernese_mountain_dog: {
    // AKC std: males 38–50 kg, females 34–41 kg
    idealWeightKgMin: 34,
    idealWeightKgMax: 50,
    sizeCategory: 'large',
    lifespanYears: 8,
    // Histiocytic sarcoma: ~25% of BMDs (PMC3139364); cancer leads cause of death
    risks: ['histiocytic_sarcoma', 'cancer', 'hip_dysplasia', 'elbow_dysplasia'],
    dentalRisk: 'low',
    cardiacRisk: 'low',
    obesityRisk: 'medium',
  },

  saint_bernard: {
    // AKC std: males 64–82 kg, females 54–64 kg
    idealWeightKgMin: 54,
    idealWeightKgMax: 82,
    sizeCategory: 'giant',
    lifespanYears: 8,
    // Hip dysplasia; elbow dysplasia; bloat; osteosarcoma
    risks: ['hip_dysplasia', 'elbow_dysplasia', 'bloat', 'osteosarcoma'],
    dentalRisk: 'low',
    cardiacRisk: 'medium',
    obesityRisk: 'high',
  },

  newfoundland: {
    // AKC std: males ~68 kg, females ~54 kg
    idealWeightKgMin: 54,
    idealWeightKgMax: 68,
    sizeCategory: 'giant',
    lifespanYears: 9,
    // DCM well-documented in breed; hip dysplasia; elbow dysplasia; subaortic stenosis
    risks: ['dilated_cardiomyopathy', 'hip_dysplasia', 'elbow_dysplasia', 'bloat'],
    dentalRisk: 'low',
    cardiacRisk: 'high',
    obesityRisk: 'medium',
  },

  // ─── TERRIERS ──────────────────────────────────────────────────────────────

  yorkshire_terrier: {
    // AKC std: max 7 lb (~3.2 kg); typical 2–3.5 kg
    idealWeightKgMin: 2,
    idealWeightKgMax: 3,
    sizeCategory: 'toy',
    lifespanYears: 14,
    // Gough/Thomas: tracheal collapse, dental disease, patellar luxation, portosystemic shunt
    risks: ['tracheal_collapse', 'dental_disease', 'patellar_luxation', 'portosystemic_shunt'],
    dentalRisk: 'very_high',
    cardiacRisk: 'low',
    obesityRisk: 'medium',
  },

  jack_russell_terrier: {
    // AKC/UKC: 5–8 kg (11–17 lb)
    idealWeightKgMin: 5,
    idealWeightKgMax: 8,
    sizeCategory: 'small',
    lifespanYears: 14,
    // Patellar luxation; primary lens luxation; deafness (in white dogs); epilepsy
    risks: ['patellar_luxation', 'eye_disease', 'deafness', 'epilepsy'],
    dentalRisk: 'medium',
    cardiacRisk: 'low',
    obesityRisk: 'low',
  },

  scottish_terrier: {
    // AKC std: 8.5–10 kg (18–22 lb)
    idealWeightKgMin: 8,
    idealWeightKgMax: 10,
    sizeCategory: 'small',
    lifespanYears: 12,
    // Scottie cramp; von Willebrand disease; cancer (high rate in breed); dental disease
    risks: ['cancer', 'von_willebrand_disease', 'epilepsy', 'dental_disease'],
    dentalRisk: 'high',
    cardiacRisk: 'low',
    obesityRisk: 'medium',
  },

  soft_coated_wheaten_terrier: {
    // AKC std: males 16–20 kg, females 14–17 kg
    idealWeightKgMin: 14,
    idealWeightKgMax: 20,
    sizeCategory: 'medium',
    lifespanYears: 13,
    // Breed-specific: protein-losing nephropathy, protein-losing enteropathy, renal dysplasia
    risks: ['renal_dysplasia', 'hypothyroidism', 'ear_infections', 'skin_disease'],
    dentalRisk: 'medium',
    cardiacRisk: 'low',
    obesityRisk: 'medium',
  },

  staffordshire_bull_terrier: {
    // AKC std: males 13–17 kg, females 11–15 kg
    idealWeightKgMin: 11,
    idealWeightKgMax: 17,
    sizeCategory: 'medium',
    lifespanYears: 13,
    // VetCompass UK: skin disease, dental, patellar luxation, eye disease common
    risks: ['skin_disease', 'eye_disease', 'patellar_luxation', 'dental_disease'],
    dentalRisk: 'high',
    cardiacRisk: 'low',
    obesityRisk: 'medium',
  },

  wire_fox_terrier: {
    // AKC std: males ~8 kg, females ~7 kg
    idealWeightKgMin: 6,
    idealWeightKgMax: 9,
    sizeCategory: 'small',
    lifespanYears: 14,
    // Primary lens luxation; patellar luxation; Legg-Calvé-Perthes; dental disease
    risks: ['eye_disease', 'patellar_luxation', 'dental_disease', 'epilepsy'],
    dentalRisk: 'high',
    cardiacRisk: 'low',
    obesityRisk: 'low',
  },

  // ─── SPANIELS ──────────────────────────────────────────────────────────────

  cavalier_king_charles_spaniel: {
    // AKC std: 5.5–8.5 kg (12–18 lb)
    idealWeightKgMin: 5,
    idealWeightKgMax: 9,
    sizeCategory: 'small',
    lifespanYears: 11,
    // MVD affects >50% by age 5, nearly all by age 10 (cavalierhealth.org); syringomyelia
    risks: ['mitral_valve_disease', 'syringomyelia', 'eye_disease', 'hip_dysplasia'],
    dentalRisk: 'medium',
    cardiacRisk: 'very_high',
    obesityRisk: 'high',
  },

  cocker_spaniel: {
    // AKC std (American Cocker): males 11–14 kg, females 9–12 kg
    idealWeightKgMin: 9,
    idealWeightKgMax: 14,
    sizeCategory: 'small',
    lifespanYears: 13,
    // Eye disease (PRA, cataracts); ear infections; hypothyroidism; hip dysplasia
    risks: ['eye_disease', 'ear_infections', 'hypothyroidism', 'hip_dysplasia'],
    dentalRisk: 'medium',
    cardiacRisk: 'low',
    obesityRisk: 'medium',
  },

  english_springer_spaniel: {
    // AKC std: males 22–25 kg, females 18–22 kg
    idealWeightKgMin: 18,
    idealWeightKgMax: 25,
    sizeCategory: 'medium',
    lifespanYears: 13,
    // PRA; ear infections; hip dysplasia; intervertebral disc disease
    risks: ['progressive_retinal_atrophy', 'ear_infections', 'hip_dysplasia', 'intervertebral_disc_disease'],
    dentalRisk: 'medium',
    cardiacRisk: 'low',
    obesityRisk: 'medium',
  },

  brittany: {
    // AKC std: 14–18 kg (30–40 lb)
    idealWeightKgMin: 14,
    idealWeightKgMax: 18,
    sizeCategory: 'medium',
    lifespanYears: 13,
    // Hip dysplasia; epilepsy; hypothyroidism; cancer
    risks: ['hip_dysplasia', 'epilepsy', 'hypothyroidism', 'cancer'],
    dentalRisk: 'low',
    cardiacRisk: 'low',
    obesityRisk: 'low',
  },

  // ─── HERDING ───────────────────────────────────────────────────────────────

  border_collie: {
    // AKC std: males 14–20 kg, females 12–19 kg
    idealWeightKgMin: 12,
    idealWeightKgMax: 20,
    sizeCategory: 'medium',
    lifespanYears: 13,
    // Collie eye anomaly (CEA); hip dysplasia; epilepsy; progressive retinal atrophy
    risks: ['eye_disease', 'epilepsy', 'hip_dysplasia', 'degenerative_myelopathy'],
    dentalRisk: 'low',
    cardiacRisk: 'low',
    obesityRisk: 'low',
  },

  australian_shepherd: {
    // AKC std: males 23–29 kg, females 14–20 kg
    idealWeightKgMin: 16,
    idealWeightKgMax: 32,
    sizeCategory: 'medium',
    lifespanYears: 13,
    // MDR1 (multiple drug sensitivity) well-documented; epilepsy; hip dysplasia; eye disease
    risks: ['multiple_drug_sensitivity', 'epilepsy', 'hip_dysplasia', 'eye_disease'],
    dentalRisk: 'low',
    cardiacRisk: 'low',
    obesityRisk: 'low',
  },

  collie: {
    // AKC std (Rough & Smooth): males 27–34 kg, females 23–29 kg
    idealWeightKgMin: 23,
    idealWeightKgMax: 34,
    sizeCategory: 'medium',
    lifespanYears: 13,
    // Collie eye anomaly; MDR1 sensitivity; PRA; hip dysplasia
    risks: ['eye_disease', 'multiple_drug_sensitivity', 'progressive_retinal_atrophy', 'hip_dysplasia'],
    dentalRisk: 'low',
    cardiacRisk: 'low',
    obesityRisk: 'medium',
  },

  corgi_pembroke: {
    // AKC std: males ~14 kg, females ~12 kg (27–30 lb / 25–28 lb)
    idealWeightKgMin: 10,
    idealWeightKgMax: 14,
    sizeCategory: 'small',
    lifespanYears: 13,
    // DM very prevalent; hip dysplasia; PRA; obesity
    risks: ['degenerative_myelopathy', 'hip_dysplasia', 'progressive_retinal_atrophy', 'obesity'],
    dentalRisk: 'medium',
    cardiacRisk: 'low',
    obesityRisk: 'high',
  },

  corgi_cardigan: {
    // AKC std: males 14–17 kg, females 11–15 kg
    idealWeightKgMin: 11,
    idealWeightKgMax: 17,
    sizeCategory: 'small',
    lifespanYears: 13,
    // PRA; hip dysplasia; degenerative myelopathy; intervertebral disc disease
    risks: ['progressive_retinal_atrophy', 'hip_dysplasia', 'degenerative_myelopathy', 'intervertebral_disc_disease'],
    dentalRisk: 'medium',
    cardiacRisk: 'low',
    obesityRisk: 'high',
  },

  // ─── NORDIC / SPITZ ────────────────────────────────────────────────────────

  siberian_husky: {
    // AKC std: males 20–27 kg, females 16–23 kg
    idealWeightKgMin: 16,
    idealWeightKgMax: 27,
    sizeCategory: 'medium',
    lifespanYears: 13,
    // Eye disease (hereditary cataracts, PRA well-documented); epilepsy; hip dysplasia lower prevalence
    risks: ['eye_disease', 'epilepsy', 'progressive_retinal_atrophy', 'hip_dysplasia'],
    dentalRisk: 'low',
    cardiacRisk: 'low',
    obesityRisk: 'low',
  },

  samoyed: {
    // AKC std: males 20–30 kg, females 16–20 kg
    idealWeightKgMin: 16,
    idealWeightKgMax: 30,
    sizeCategory: 'medium',
    lifespanYears: 12,
    // Samoyed hereditary glomerulopathy (X-linked renal disease); hip dysplasia; eye disease; cardiac
    risks: ['hip_dysplasia', 'renal_dysplasia', 'eye_disease', 'cardiac_disease'],
    dentalRisk: 'low',
    cardiacRisk: 'medium',
    obesityRisk: 'medium',
  },

  pomeranian: {
    // AKC std: 1.4–3.2 kg (3–7 lb)
    idealWeightKgMin: 1,
    idealWeightKgMax: 3,
    sizeCategory: 'toy',
    lifespanYears: 14,
    // Tracheal collapse; dental disease; patellar luxation; alopecia X
    risks: ['tracheal_collapse', 'dental_disease', 'patellar_luxation', 'skin_disease'],
    dentalRisk: 'very_high',
    cardiacRisk: 'low',
    obesityRisk: 'medium',
  },

  chow_chow: {
    // AKC std: 20–32 kg (44–70 lb)
    idealWeightKgMin: 20,
    idealWeightKgMax: 32,
    sizeCategory: 'medium',
    lifespanYears: 11,
    // Hip dysplasia; elbow dysplasia; entropion (eye disease); hypothyroidism
    risks: ['hip_dysplasia', 'eye_disease', 'hypothyroidism', 'elbow_dysplasia'],
    dentalRisk: 'medium',
    cardiacRisk: 'low',
    obesityRisk: 'medium',
  },

  // ─── SETTERS & POINTERS ────────────────────────────────────────────────────

  irish_setter: {
    // AKC std: males 29–34 kg, females 25–29 kg
    idealWeightKgMin: 25,
    idealWeightKgMax: 32,
    sizeCategory: 'large',
    lifespanYears: 13,
    // Breed-specific PRA (rcd1 mutation on PDE6B gene); bloat; hip dysplasia; epilepsy
    risks: ['progressive_retinal_atrophy', 'bloat', 'hip_dysplasia', 'epilepsy'],
    dentalRisk: 'low',
    cardiacRisk: 'low',
    obesityRisk: 'medium',
  },

  english_setter: {
    // AKC std: males 29–36 kg, females 20–25 kg
    idealWeightKgMin: 20,
    idealWeightKgMax: 36,
    sizeCategory: 'large',
    lifespanYears: 12,
    // Hip dysplasia; deafness; progressive retinal atrophy; epilepsy
    risks: ['hip_dysplasia', 'deafness', 'progressive_retinal_atrophy', 'epilepsy'],
    dentalRisk: 'low',
    cardiacRisk: 'low',
    obesityRisk: 'medium',
  },

  german_shorthaired_pointer: {
    // AKC std: males 25–32 kg, females 20–27 kg
    idealWeightKgMin: 20,
    idealWeightKgMax: 32,
    sizeCategory: 'medium',
    lifespanYears: 13,
    // Hip dysplasia; bloat; cancer; eye disease
    risks: ['hip_dysplasia', 'bloat', 'cancer', 'eye_disease'],
    dentalRisk: 'low',
    cardiacRisk: 'low',
    obesityRisk: 'low',
  },

  weimaraner: {
    // AKC std: males 32–37 kg, females 25–32 kg
    idealWeightKgMin: 25,
    idealWeightKgMax: 37,
    sizeCategory: 'large',
    lifespanYears: 12,
    // Bloat (deep-chested); hip dysplasia; hypothyroidism; von Willebrand disease
    risks: ['bloat', 'hip_dysplasia', 'hypothyroidism', 'von_willebrand_disease'],
    dentalRisk: 'low',
    cardiacRisk: 'low',
    obesityRisk: 'medium',
  },

  vizsla: {
    // AKC std: males 20–27 kg, females 18–25 kg
    idealWeightKgMin: 18,
    idealWeightKgMax: 27,
    sizeCategory: 'medium',
    lifespanYears: 13,
    // Epilepsy (partially genetic); hip dysplasia; progressive retinal atrophy; cancer
    risks: ['epilepsy', 'hip_dysplasia', 'progressive_retinal_atrophy', 'cancer'],
    dentalRisk: 'low',
    cardiacRisk: 'low',
    obesityRisk: 'low',
  },

  // ─── DALMATIAN ─────────────────────────────────────────────────────────────

  dalmatian: {
    // AKC std: males 27–32 kg, females 22–25 kg
    idealWeightKgMin: 22,
    idealWeightKgMax: 32,
    sizeCategory: 'large',
    lifespanYears: 13,
    // Hyperuricosuria → urate stones (breed-specific SLC2A9 mutation); congenital deafness (piebald gene); skin disease
    risks: ['hyperuricosuria', 'deafness', 'urinary_stones', 'skin_disease'],
    dentalRisk: 'low',
    cardiacRisk: 'low',
    obesityRisk: 'medium',
  },

  // ─── SHAR PEI ──────────────────────────────────────────────────────────────

  shar_pei: {
    // AKC std: 18–29 kg (40–65 lb)
    idealWeightKgMin: 18,
    idealWeightKgMax: 29,
    sizeCategory: 'medium',
    lifespanYears: 10,
    // Familial Shar Pei fever (autoinflammatory); skin fold dermatitis; entropion; ear infections
    risks: ['skin_disease', 'eye_disease', 'renal_dysplasia', 'ear_infections'],
    dentalRisk: 'medium',
    cardiacRisk: 'low',
    obesityRisk: 'medium',
  },

  // ─── SMALL COMPANION / TOY ─────────────────────────────────────────────────

  chihuahua: {
    // AKC std: max 2.7 kg (6 lb)
    idealWeightKgMin: 1,
    idealWeightKgMax: 3,
    sizeCategory: 'toy',
    lifespanYears: 15,
    // Dental disease (>80% by age 2, VetCompass); patellar luxation; tracheal collapse; epilepsy
    risks: ['dental_disease', 'patellar_luxation', 'tracheal_collapse', 'epilepsy'],
    dentalRisk: 'very_high',
    cardiacRisk: 'low',
    obesityRisk: 'medium',
  },

  maltese: {
    // AKC std: max 3.2 kg (7 lb)
    idealWeightKgMin: 1,
    idealWeightKgMax: 3,
    sizeCategory: 'toy',
    lifespanYears: 14,
    // Dental disease; patellar luxation; portosystemic shunt; tracheal collapse
    risks: ['dental_disease', 'patellar_luxation', 'portosystemic_shunt', 'tracheal_collapse'],
    dentalRisk: 'very_high',
    cardiacRisk: 'low',
    obesityRisk: 'low',
  },

  papillon: {
    // AKC std: 2–5 kg (4–10 lb)
    idealWeightKgMin: 2,
    idealWeightKgMax: 5,
    sizeCategory: 'toy',
    lifespanYears: 15,
    // Patellar luxation; epilepsy; dental disease; progressive retinal atrophy
    risks: ['patellar_luxation', 'epilepsy', 'dental_disease', 'progressive_retinal_atrophy'],
    dentalRisk: 'high',
    cardiacRisk: 'low',
    obesityRisk: 'low',
  },

  lhasa_apso: {
    // AKC std: 5–8 kg (11–18 lb)
    idealWeightKgMin: 5,
    idealWeightKgMax: 8,
    sizeCategory: 'small',
    lifespanYears: 14,
    // Eye disease (PRA, dry eye); renal dysplasia; intervertebral disc disease; dental disease
    risks: ['eye_disease', 'renal_dysplasia', 'intervertebral_disc_disease', 'dental_disease'],
    dentalRisk: 'high',
    cardiacRisk: 'low',
    obesityRisk: 'medium',
  },

  bichon_frise: {
    // AKC std: 5–10 kg (11–22 lb)
    idealWeightKgMin: 5,
    idealWeightKgMax: 10,
    sizeCategory: 'small',
    lifespanYears: 14,
    // Dental disease; patellar luxation; bladder stones (calcium oxalate); allergic skin disease
    risks: ['dental_disease', 'patellar_luxation', 'skin_disease', 'urinary_stones'],
    dentalRisk: 'very_high',
    cardiacRisk: 'low',
    obesityRisk: 'medium',
  },

  // ─── SCHNAUZERS ────────────────────────────────────────────────────────────

  schnauzer_miniature: {
    // AKC std: 5–9 kg (11–20 lb)
    idealWeightKgMin: 5,
    idealWeightKgMax: 9,
    sizeCategory: 'small',
    lifespanYears: 14,
    // Pancreatitis (hyperlipidemia); calcium oxalate urolithiasis; dental disease; eye disease (PRA, cataracts)
    risks: ['pancreatitis', 'urinary_stones', 'dental_disease', 'eye_disease'],
    dentalRisk: 'very_high',
    cardiacRisk: 'low',
    obesityRisk: 'medium',
  },

  schnauzer_standard: {
    // AKC std: males 14–20 kg, females 14–18 kg
    idealWeightKgMin: 14,
    idealWeightKgMax: 20,
    sizeCategory: 'medium',
    lifespanYears: 14,
    // Hip dysplasia; follicular dermatitis; eye disease (PRA); epilepsy
    risks: ['hip_dysplasia', 'skin_disease', 'eye_disease', 'epilepsy'],
    dentalRisk: 'medium',
    cardiacRisk: 'low',
    obesityRisk: 'medium',
  },

  schnauzer_giant: {
    // AKC std: males 34–43 kg, females 25–34 kg
    idealWeightKgMin: 25,
    idealWeightKgMax: 43,
    sizeCategory: 'large',
    lifespanYears: 12,
    // Hip dysplasia; bloat; dilated cardiomyopathy; cancer
    risks: ['hip_dysplasia', 'bloat', 'dilated_cardiomyopathy', 'cancer'],
    dentalRisk: 'medium',
    cardiacRisk: 'high',
    obesityRisk: 'medium',
  },

  // ─── MIXED / UNKNOWN ───────────────────────────────────────────────────────

  mixed_unknown: {
    // Wide range; adjusted per individual BCS assessment. Typical medium mixed dog.
    idealWeightKgMin: 10,
    idealWeightKgMax: 30,
    sizeCategory: 'medium',
    lifespanYears: 13,
    // Crossbreeds generally have lower genetic disease burden (hybrid vigour)
    risks: ['obesity', 'dental_disease', 'skin_disease', 'ear_infections'],
    dentalRisk: 'medium',
    cardiacRisk: 'low',
    obesityRisk: 'medium',
  },
};
