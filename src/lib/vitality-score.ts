/**
 * PetLog Vitality Score Engine
 *
 * Modelo propietario de salud canina — 5 pilares, 0–100 puntos.
 *
 * Fundamentación científica: docs/vitality-score-research.md
 *
 * Pilares:
 *  P1: Peso corporal (20 pts) — WSAVA BCS, VetCompass/Pegram 2021
 *  P2: Cuidado preventivo (20 pts) — GeroScience 2024, AVMA
 *  P3: Raza + Edad (20 pts) — Gough/Thomas, Cornell, Nature 2023
 *  P4: Actividad y bienestar (20 pts) — Dog Aging Project 2023
 *  P5: Nutrición (20 pts) — Purina MER, PMC diet study
 *
 * PRINCIPIOS DE DISEÑO:
 *  - Nunca mostrar score hasta tener suficientes datos (mínimo 2 pilares calculables)
 *  - Tono siempre positivo y de recomendación, nunca alarmante
 *  - Flags máximo severidad "naranja" cuando no hay historial suficiente
 *  - Siempre aclarar que no es diagnóstico médico
 */

import { getBreedProfile, isSenior } from './breed-data';

// ─── Tipos de entrada ───────────────────────────────────────────────────────

export interface PetData {
  breed: string | null;
  birth_date: string | null;   // ISO date: "2020-05-15"
  weight_kg: number | null;
  gender: string | null;       // 'macho' | 'hembra'
  is_neutered: boolean | null;
}

export interface WeightRecord {
  weight_kg: number;
  date: string; // ISO date
}

export interface VaccineRecord {
  name: string;
  date_given: string; // ISO date
}

export interface VetVisit {
  visit_date: string; // ISO date
}

export interface GroomingRecord {
  date: string; // ISO date
}

export interface AdventureRecord {
  date: string; // ISO date
}

export interface FoodRecord {
  brand: string | null;
  daily_grams: number | null;
  bag_size: number | null;
  bag_unit: string | null; // 'g' | 'kg' | 'lb'
  food_type: string | null;
}

export interface ScoreInput {
  pet: PetData;
  weightRecords: WeightRecord[];
  vaccines: VaccineRecord[];
  vetVisits: VetVisit[];
  groomings: GroomingRecord[];
  adventures: AdventureRecord[];
  foods: FoodRecord[];
}

// ─── Tipos de salida ─────────────────────────────────────────────────────────

export type ScoreCategory = 'excellent' | 'good' | 'fair' | 'attention' | 'building';

/** Estado de datos disponibles para calcular el score */
export type DataSufficiency =
  | 'ready'        // suficientes datos para un score significativo
  | 'building'     // datos en recolección — score estimado parcial
  | 'too_early';   // demasiado pronto para mostrar score (< 2 pilares)

export interface PillarScore {
  name: string;
  emoji: string;
  score: number;
  max: number;
  pct: number;
  status: string;
  /** Sugerencias — siempre en tono de ayuda, nunca alarmante */
  tips: string[];
  /** true si este pilar no tiene datos suficientes para calcularse */
  isEstimated: boolean;
}

export interface ScoreFlag {
  id: string;
  /** 'tip' = amarillo suave, 'suggestion' = naranja, 'reminder' = azul */
  severity: 'tip' | 'suggestion' | 'reminder';
  message: string;
  action: string;
  href: string;
}

export interface VitalityScoreResult {
  /** Score total 0–100 */
  total: number;
  /** Categoría cualitativa */
  category: ScoreCategory;
  /** Color hex del indicador */
  color: string;
  /** Mensaje principal — siempre friendly */
  headline: string;
  /** Sub-mensaje — contexto o siguiente paso */
  subline: string;
  /** Desglose por pilares */
  pillars: PillarScore[];
  /** Sugerencias activas */
  flags: ScoreFlag[];
  /** Estado de suficiencia de datos */
  dataSufficiency: DataSufficiency;
  /** Cuántos pilares tienen datos reales (no estimados) */
  pilarsWithData: number;
  /** Cuántos datos más faltan para score completo */
  missingDataCount: number;
  /** Edad calculada en años */
  ageYears: number | null;
  /** Si es considerado senior según raza */
  isSenior: boolean;
}

// ─── Helpers internos ────────────────────────────────────────────────────────

function daysBetween(dateA: string, dateB: Date = new Date()): number {
  const a = new Date(dateA);
  return Math.floor((dateB.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function ageInYears(birthDate: string | null): number | null {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  const years = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  return m < 0 || (m === 0 && today.getDate() < birth.getDate()) ? years - 1 : years;
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

/** Vacunas core según AVMA/WSAVA */
const CORE_VACCINE_KEYWORDS = ['rabia', 'rabies', 'parvovirus', 'parvo', 'moquillo', 'distemper', 'adenovirus', 'hepatitis'];

function isCoreVaccine(name: string): boolean {
  const n = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return CORE_VACCINE_KEYWORDS.some(v => n.includes(v));
}

/**
 * MER (Metabolic Energy Requirement) — Purina para perros adultos activos:
 * MER (kcal/día) = 132 × peso_kg^0.75
 */
function estimateDailyKcalNeed(weightKg: number): number {
  return 132 * Math.pow(weightKg, 0.75);
}

const FOOD_TYPE_KCAL_PER_G: Record<string, number> = {
  croquetas: 3.3,
  premium: 3.8,
  veterinario: 3.8,
  raw: 1.8,
  humedo: 1.0,
  casero: 1.5,
};

function getFoodKcalPerG(foodType: string | null): number {
  if (!foodType) return 3.3;
  const t = foodType.toLowerCase();
  for (const [key, val] of Object.entries(FOOD_TYPE_KCAL_PER_G)) {
    if (t.includes(key)) return val;
  }
  return 3.3;
}

// ─── Pilar 1: Peso Corporal ──────────────────────────────────────────────────

function scorePeso(input: ScoreInput): PillarScore {
  const { pet, weightRecords } = input;
  const breed = getBreedProfile(pet.breed);
  const tips: string[] = [];
  const latestWeight = weightRecords[0]?.weight_kg ?? pet.weight_kg;

  if (!latestWeight) {
    return {
      name: 'Peso', emoji: '⚖️', score: 10, max: 20, pct: 50,
      status: 'Pendiente de registro',
      tips: ['Registrar el peso regularmente ayuda a detectar cambios a tiempo'],
      isEstimated: true,
    };
  }

  const ideal = (breed.idealWeightKgMin + breed.idealWeightKgMax) / 2;
  const desvPct = Math.abs((latestWeight - ideal) / ideal) * 100;

  let pts: number;
  if (desvPct <= 5) {
    pts = 20;
  } else if (desvPct <= 10) {
    pts = Math.max(14, 20 - Math.floor((desvPct - 5) * 1.2));
  } else if (desvPct <= 20) {
    pts = Math.max(6, 14 - Math.floor((desvPct - 10) * 0.8));
  } else {
    pts = Math.max(2, 6 - Math.floor((desvPct - 20) * 0.3));
  }

  // Bono/penalización por tendencia — solo si hay historial
  if (weightRecords.length >= 2) {
    const prev = weightRecords[1].weight_kg;
    const diff = latestWeight - prev;
    const isOver = latestWeight > breed.idealWeightKgMax;
    const isUnder = latestWeight < breed.idealWeightKgMin;

    if (isOver && diff > 0) {
      pts = Math.max(2, pts - 2);
      tips.push('Su peso está aumentando un poco — revisar las porciones puede ayudar');
    } else if (isOver && diff < 0) {
      pts = Math.min(20, pts + 1); // bajando desde sobrepeso, positivo
    } else if (isUnder && diff < 0) {
      pts = Math.max(2, pts - 2);
      tips.push('Se nota una ligera pérdida de peso — vale la pena comentárselo al vet en la próxima visita');
    }
  }

  const isOver = latestWeight > breed.idealWeightKgMax;
  const isUnder = latestWeight < breed.idealWeightKgMin;

  let status: string;
  if (desvPct <= 5) {
    status = `Peso ideal · ${latestWeight} kg`;
  } else if (isOver) {
    status = `Algo por encima del rango ideal · ${latestWeight} kg`;
    tips.push(`El rango recomendado para ${breed.displayName} es ${breed.idealWeightKgMin}–${breed.idealWeightKgMax} kg`);
  } else if (isUnder) {
    status = `Algo por debajo del rango ideal · ${latestWeight} kg`;
    tips.push(`El rango recomendado para ${breed.displayName} es ${breed.idealWeightKgMin}–${breed.idealWeightKgMax} kg`);
  } else {
    status = `Buen peso · ${latestWeight} kg`;
  }

  return {
    name: 'Peso', emoji: '⚖️',
    score: clamp(pts, 2, 20), max: 20, pct: clamp(pts * 5, 10, 100),
    status, tips: tips.slice(0, 2), isEstimated: false,
  };
}

// ─── Pilar 2: Cuidado Preventivo ─────────────────────────────────────────────

function scoreCuidado(input: ScoreInput): PillarScore {
  const { vaccines, vetVisits } = input;
  const tips: string[] = [];
  const hasAnyData = vaccines.length > 0 || vetVisits.length > 0;

  if (!hasAnyData) {
    return {
      name: 'Cuidado preventivo', emoji: '🩺', score: 10, max: 20, pct: 50,
      status: 'Pendiente de registro',
      tips: ['Agrega vacunas y visitas al vet para completar este indicador'],
      isEstimated: true,
    };
  }

  // Sub-score vacunas (10 pts)
  let vaccineScore = 0;
  if (vaccines.length === 0) {
    vaccineScore = 3; // neutral, no penaliza fuerte sin datos
    tips.push('Registra las vacunas para monitorear el calendario de inmunización');
  } else {
    const coreNames = ['rabia', 'parvovirus', 'moquillo', 'adenovirus'];
    const coveredCore = coreNames.filter(core =>
      vaccines.some(v => isCoreVaccine(v.name) &&
        v.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .includes(core.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
      )
    ).length;

    vaccineScore = Math.max(3, Math.round((coveredCore / coreNames.length) * 8));

    const anyRecent = vaccines.some(v => daysBetween(v.date_given) < 548);
    if (anyRecent) {
      vaccineScore = Math.min(10, vaccineScore + 2);
    } else {
      tips.push('Puede ser buen momento para revisar el calendario de vacunas con el vet');
    }
  }

  // Sub-score visitas al vet (10 pts)
  let vetScore = 0;
  if (vetVisits.length === 0) {
    vetScore = 3;
    tips.push('Registrar las visitas al veterinario ayuda a llevar un seguimiento completo');
  } else {
    const daysSince = daysBetween(vetVisits[0].visit_date);
    if (daysSince <= 365) {
      vetScore = 10;
    } else if (daysSince <= 548) {
      vetScore = 7;
    } else if (daysSince <= 730) {
      vetScore = 4;
      tips.push('Llevan un tiempo sin visita registrada — un chequeo anual es ideal');
    } else {
      vetScore = 1;
      tips.push('Sería buena idea agendar un chequeo de rutina pronto');
    }
  }

  const total = clamp(vaccineScore + vetScore, 2, 20);
  let status: string;
  if (total >= 18) status = 'Cuidado preventivo al día';
  else if (total >= 14) status = 'Buen seguimiento preventivo';
  else if (total >= 8) status = 'Algunos registros pendientes';
  else status = 'Comenzando a registrar historial';

  return {
    name: 'Cuidado preventivo', emoji: '🩺',
    score: total, max: 20, pct: clamp(total * 5, 10, 100),
    status, tips: tips.slice(0, 2), isEstimated: vaccines.length === 0 && vetVisits.length === 0,
  };
}

// ─── Pilar 3: Raza + Edad ────────────────────────────────────────────────────

function scoreRazaEdad(input: ScoreInput): PillarScore {
  const { pet, weightRecords, groomings } = input;
  const breed = getBreedProfile(pet.breed);
  const age = ageInYears(pet.birth_date);
  const tips: string[] = [];
  let pts = 20;
  let isEstimated = false;

  const hasBreed = pet.breed && pet.breed !== 'Other' && pet.breed !== 'mixed';
  const hasAge = age !== null;

  if (!hasBreed && !hasAge) {
    return {
      name: 'Raza y edad', emoji: '🧬', score: 12, max: 20, pct: 60,
      status: 'Perfil incompleto',
      tips: ['Agregar raza y fecha de nacimiento permite personalizar el análisis'],
      isEstimated: true,
    };
  }

  if (!hasBreed) {
    isEstimated = true;
    pts = Math.min(pts, 15);
    tips.push('Agrega la raza en el perfil para un análisis más preciso');
  }

  if (!hasAge) {
    isEstimated = true;
    pts = Math.min(pts, 15);
    tips.push('La fecha de nacimiento permite detectar riesgos asociados a la edad');
  }

  // Riesgo dental por edad y raza — solo informativo, no alarmante
  if (hasAge && age! >= 2) {
    const isDentalRisk = breed.dentalRisk === 'high' || breed.dentalRisk === 'very_high'
      || breed.sizeCategory === 'toy' || breed.sizeCategory === 'small'
      || breed.risks.includes('brachycephalic_syndrome');
    const groomingDays = groomings[0] ? daysBetween(groomings[0].date) : 999;

    if (isDentalRisk && groomingDays > 60) {
      pts -= 3;
      tips.push('La salud dental es importante en esta raza — una limpieza periódica marca la diferencia');
    }
  }

  // Riesgo cardíaco por raza — recordatorio suave, no alarmante
  if (hasAge && age! >= 5 && breed.cardiacRisk === 'very_high') {
    pts -= 3;
    tips.push(`En ${breed.displayName}, se recomienda revisión cardíaca de rutina a partir de los 5 años`);
  }

  // Obesidad: raza de riesgo + castrado + adulto mayor
  if (hasAge && age! >= 6 && breed.obesityRisk === 'very_high' && pet.is_neutered) {
    const latestWeight = weightRecords[0]?.weight_kg ?? pet.weight_kg;
    if (latestWeight && latestWeight > breed.idealWeightKgMax) {
      pts -= 2;
      tips.push('Las razas con tendencia a subir de peso necesitan porciones controladas en esta etapa');
    }
  }

  // Senior: mensaje de cuidado, no de alarma
  if (hasAge && isSenior(pet.breed, age!)) {
    pts -= 2;
    if (tips.length < 2) {
      tips.push('En la etapa senior, los chequeos más frecuentes ayudan a detectar cambios a tiempo');
    }
  }

  let status: string;
  const breedName = hasBreed ? breed.displayName : 'Raza mixta';
  if (pts >= 18) status = `${breedName} · Sin alertas activas`;
  else if (pts >= 14) status = `${breedName} · Algunas recomendaciones`;
  else if (pts >= 8) status = `${breedName} · Atención sugerida`;
  else status = `${breedName} · Varias áreas de atención`;

  return {
    name: 'Raza y edad', emoji: '🧬',
    score: clamp(pts, 2, 20), max: 20, pct: clamp(pts * 5, 10, 100),
    status, tips: tips.slice(0, 2), isEstimated,
  };
}

// ─── Pilar 4: Actividad y Bienestar ──────────────────────────────────────────

function scoreActividad(input: ScoreInput): PillarScore {
  const { adventures, groomings } = input;
  const tips: string[] = [];
  const hasAnyData = adventures.length > 0 || groomings.length > 0;

  if (!hasAnyData) {
    return {
      name: 'Actividad', emoji: '🏃', score: 10, max: 20, pct: 50,
      status: 'Pendiente de registro',
      tips: ['Registrar paseos y aventuras ayuda a visualizar su nivel de actividad'],
      isEstimated: true,
    };
  }

  // Sub-score aventuras últimos 30 días (12 pts)
  const recentActs = adventures.filter(a => daysBetween(a.date) <= 30).length;
  let actScore: number;
  if (recentActs >= 4) {
    actScore = 12;
  } else if (recentActs >= 2) {
    actScore = 8;
  } else if (recentActs >= 1) {
    actScore = 5;
  } else {
    actScore = 2;
    if (adventures.length > 0) {
      tips.push('Lleva un tiempo sin registrar salidas — ¿hay aventuras recientes sin anotar?');
    } else {
      tips.push('Registra los paseos y salidas para ver la actividad mensual');
    }
  }

  // Sub-score grooming (8 pts)
  const groomDays = groomings[0] ? daysBetween(groomings[0].date) : 999;
  let groomScore: number;
  if (groomDays <= 30) {
    groomScore = 8;
  } else if (groomDays <= 60) {
    groomScore = 5;
  } else if (groomDays <= 90) {
    groomScore = 2;
  } else {
    groomScore = 1;
    if (groomings.length > 0) {
      tips.push('Hace un tiempo desde el último grooming registrado');
    }
  }

  const total = clamp(actScore + groomScore, 2, 20);
  let status: string;
  if (total >= 17) status = 'Muy activo/a y bien cuidado/a';
  else if (total >= 12) status = 'Buena actividad general';
  else if (total >= 7) status = 'Actividad moderada';
  else status = 'Pocos registros de actividad';

  return {
    name: 'Actividad', emoji: '🏃',
    score: total, max: 20, pct: clamp(total * 5, 10, 100),
    status, tips: tips.slice(0, 2),
    isEstimated: adventures.length === 0 && groomings.length === 0,
  };
}

// ─── Pilar 5: Nutrición ───────────────────────────────────────────────────────

function scoreNutricion(input: ScoreInput): PillarScore {
  const { pet, weightRecords, foods } = input;
  const tips: string[] = [];

  if (foods.length === 0) {
    return {
      name: 'Nutrición', emoji: '🍖', score: 10, max: 20, pct: 50,
      status: 'Pendiente de registro',
      tips: ['Registra el alimento actual para obtener un análisis nutricional personalizado'],
      isEstimated: true,
    };
  }

  const f = foods[0];

  // Calidad del alimento (10 pts)
  let qualityScore = 5;
  if (f.brand) qualityScore += 2;
  if (f.food_type) {
    const t = f.food_type.toLowerCase();
    if (t.includes('veterinario') || t.includes('premium')) qualityScore += 3;
    else if (t.includes('croquetas') || t.includes('kibble')) qualityScore += 2;
    else qualityScore += 1;
  }
  qualityScore = Math.min(10, qualityScore);

  // Precisión de porción (10 pts)
  let portionScore = 0;
  const latestWeight = weightRecords[0]?.weight_kg ?? pet.weight_kg;

  if (f.daily_grams && latestWeight) {
    const kcalNeed = estimateDailyKcalNeed(latestWeight);
    const kcalPerG = getFoodKcalPerG(f.food_type);
    const kcalProvided = f.daily_grams * kcalPerG;
    const deviation = Math.abs(1 - kcalProvided / kcalNeed) * 100;

    if (deviation <= 10) {
      portionScore = 10;
    } else if (deviation <= 20) {
      portionScore = 8;
    } else if (deviation <= 35) {
      portionScore = 5;
      const idealG = Math.round(kcalNeed / kcalPerG);
      tips.push(`La ración estimada sería ~${idealG} g/día según su peso — puede ajustarse con el vet`);
    } else {
      portionScore = 3;
      const idealG = Math.round(kcalNeed / kcalPerG);
      tips.push(`La ración actual difiere del estimado (~${idealG} g/día) — vale la pena revisarla`);
    }
  } else if (f.daily_grams) {
    portionScore = 6;
    tips.push('Registra el peso actual para calcular si la ración es adecuada');
  } else {
    portionScore = 2;
    tips.push('Agrega los gramos diarios para validar la porción');
  }

  const total = clamp(qualityScore + portionScore, 2, 20);
  let status: string;
  if (total >= 17) status = 'Nutrición muy bien documentada';
  else if (total >= 12) status = `${f.brand ?? 'Alimento'} registrado`;
  else if (total >= 7) status = 'Alimentación con datos parciales';
  else status = 'Alimentación comenzando a registrarse';

  return {
    name: 'Nutrición', emoji: '🍖',
    score: total, max: 20, pct: clamp(total * 5, 10, 100),
    status, tips: tips.slice(0, 2), isEstimated: false,
  };
}

// ─── Suficiencia de datos ─────────────────────────────────────────────────────

/**
 * Determina cuántos datos "reales" tiene el usuario.
 * Pensado para mostrar un estado de "recolectando datos" en vez de un score bajo.
 */
function evaluateDataSufficiency(input: ScoreInput): {
  sufficiency: DataSufficiency;
  pilarsWithData: number;
  missingDataCount: number;
} {
  const { pet, weightRecords, vaccines, vetVisits, groomings, adventures, foods } = input;

  const hasWeight = !!(weightRecords[0]?.weight_kg ?? pet.weight_kg);
  const hasVaccinesOrVet = vaccines.length > 0 || vetVisits.length > 0;
  const hasBreedOrAge = !!(pet.breed && pet.breed !== 'Other') || !!pet.birth_date;
  const hasActivity = adventures.length > 0 || groomings.length > 0;
  const hasFood = foods.length > 0;

  const dataPoints = [hasWeight, hasVaccinesOrVet, hasBreedOrAge, hasActivity, hasFood];
  const withData = dataPoints.filter(Boolean).length;
  const missing = dataPoints.filter(b => !b).length;

  let sufficiency: DataSufficiency;
  if (withData >= 4) {
    sufficiency = 'ready';
  } else if (withData >= 2) {
    sufficiency = 'building';
  } else {
    sufficiency = 'too_early';
  }

  return { sufficiency, pilarsWithData: withData, missingDataCount: missing };
}

// ─── Flags de sugerencias (siempre en tono amable) ───────────────────────────

function buildFlags(input: ScoreInput): ScoreFlag[] {
  const { pet, weightRecords, vaccines, vetVisits, groomings, adventures, foods } = input;
  const breed = getBreedProfile(pet.breed);
  const age = ageInYears(pet.birth_date);
  const flags: ScoreFlag[] = [];

  // Sugerencia: peso por encima del rango (nunca "sobrepeso crítico")
  const latestWeight = weightRecords[0]?.weight_kg ?? pet.weight_kg;
  const prevWeight = weightRecords[1]?.weight_kg;
  if (latestWeight && latestWeight > breed.idealWeightKgMax * 1.08) {
    const gaining = prevWeight && latestWeight > prevWeight;
    flags.push({
      id: 'weight_check',
      severity: gaining ? 'suggestion' : 'tip',
      message: gaining
        ? `El peso está aumentando gradualmente (${latestWeight} kg) — puede valer la pena ajustar la dieta`
        : `El peso está un poco por encima del rango ideal para ${breed.displayName}`,
      action: 'Ver historial de peso',
      href: '/salud/peso',
    });
  }

  // Recordatorio: visita al vet — solo si hay historial Y han pasado más de 14 meses
  if (vetVisits.length > 0) {
    const daysSince = daysBetween(vetVisits[0].visit_date);
    if (daysSince > 425) { // ~14 meses
      flags.push({
        id: 'vet_reminder',
        severity: 'reminder',
        message: 'Ha pasado más de un año desde la última visita registrada al vet',
        action: 'Agendar chequeo de rutina',
        href: '/salud/historial',
      });
    }
  }

  // Sugerencia: vacunas — solo si las tiene registradas y parecen antiguas
  if (vaccines.length > 0) {
    const anyRecent = vaccines.some(v => daysBetween(v.date_given) < 365);
    if (!anyRecent) {
      flags.push({
        id: 'vaccine_check',
        severity: 'tip',
        message: 'Las vacunas registradas pueden estar próximas a actualizarse',
        action: 'Revisar calendario de vacunación',
        href: '/salud/vacunas',
      });
    }
  }

  // Recordatorio: salud dental para razas de riesgo ≥ 2 años
  if (age !== null && age >= 2) {
    const isDentalBreed = breed.dentalRisk === 'high' || breed.dentalRisk === 'very_high'
      || breed.risks.includes('dental_disease')
      || breed.risks.includes('brachycephalic_syndrome');
    const groomDays = groomings[0] ? daysBetween(groomings[0].date) : 999;

    if (isDentalBreed && groomDays > 75) {
      flags.push({
        id: 'dental_tip',
        severity: 'tip',
        message: 'La salud dental es especialmente importante en esta raza — limpieza periódica recomendada',
        action: 'Ver registro de grooming',
        href: '/salud/grooming',
      });
    }
  }

  // Recordatorio: revisión cardíaca para razas de riesgo (solo ≥6 años y sin visita reciente)
  if (breed.cardiacRisk === 'very_high' && age !== null && age >= 6) {
    const lastVisitDays = vetVisits[0] ? daysBetween(vetVisits[0].visit_date) : 999;
    if (lastVisitDays > 365) {
      flags.push({
        id: 'cardiac_tip',
        severity: 'suggestion',
        message: `En ${breed.displayName} se recomienda monitoreo cardíaco a partir de los 5–6 años`,
        action: 'Comentarlo con el veterinario',
        href: '/salud/historial',
      });
    }
  }

  // Recordatorio: senior — chequeos más frecuentes (solo si hay historial vet existente)
  if (age !== null && isSenior(pet.breed, age) && vetVisits.length > 0) {
    const lastVisitDays = daysBetween(vetVisits[0].visit_date);
    if (lastVisitDays > 210) {
      flags.push({
        id: 'senior_care',
        severity: 'reminder',
        message: 'En la etapa senior se recomienda un chequeo cada 6 meses',
        action: 'Ver historial veterinario',
        href: '/salud/historial',
      });
    }
  }

  // Recordatorio: faltan datos clave (solo si hay pocos datos)
  if (foods.length === 0) {
    flags.push({
      id: 'food_missing',
      severity: 'tip',
      message: 'Registrar el alimento completa el análisis nutricional',
      action: 'Agregar alimento',
      href: '/alimentacion',
    });
  }

  // Ordenar: suggestion primero, luego reminder, luego tip
  const order: Record<string, number> = { suggestion: 0, reminder: 1, tip: 2 };
  return flags
    .sort((a, b) => order[a.severity] - order[b.severity])
    .slice(0, 4); // máximo 4 flags
}

// ─── Categorías del score ─────────────────────────────────────────────────────

const SCORE_CATEGORIES: Array<{
  min: number;
  category: ScoreCategory;
  color: string;
  headline: string;
  sublines: string[];
}> = [
  {
    min: 85, category: 'excellent', color: '#22c55e',
    headline: 'En excelente forma',
    sublines: ['Todo apunta a un estado de salud muy bueno', 'Sigue así — lo estás haciendo genial'],
  },
  {
    min: 70, category: 'good', color: '#7CB974',
    headline: 'Muy buen estado',
    sublines: ['Hay pequeñas oportunidades de mejora', 'Un par de ajustes y llegamos al máximo'],
  },
  {
    min: 55, category: 'fair', color: '#F59E0B',
    headline: 'Buen comienzo',
    sublines: ['Completa más registros para un análisis más preciso', 'Cada dato que agregas mejora el score'],
  },
  {
    min: 40, category: 'fair', color: '#F97316',
    headline: 'Perfil en construcción',
    sublines: ['Aún faltan datos para un análisis completo', 'Empieza por registrar el peso y las vacunas'],
  },
  {
    min: 0, category: 'building', color: '#94A3B8',
    headline: 'Comenzando el historial',
    sublines: ['Agrega más datos para ver el Vitality Score completo', 'Cuantos más registros, más preciso el análisis'],
  },
];

// ─── Función principal ────────────────────────────────────────────────────────

/**
 * Calcula el PetLog Vitality Score completo.
 *
 * Nunca muestra "crítico" — el peor estado visible es "perfil en construcción".
 * Tampoco usa lenguaje médico afirmativo — solo sugerencias y recomendaciones.
 */
export function calculateVitalityScore(input: ScoreInput): VitalityScoreResult {
  const p1 = scorePeso(input);
  const p2 = scoreCuidado(input);
  const p3 = scoreRazaEdad(input);
  const p4 = scoreActividad(input);
  const p5 = scoreNutricion(input);

  const pillars = [p1, p2, p3, p4, p5];
  const { sufficiency, pilarsWithData, missingDataCount } = evaluateDataSufficiency(input);

  // Score bruto
  const rawTotal = clamp(pillars.reduce((sum, p) => sum + p.score, 0), 0, 100);

  // Si hay muy pocos datos, no mostrar score numérico realista
  // Mostramos el score pero con contexto claro de "construyendo"
  const total = sufficiency === 'too_early'
    ? Math.min(rawTotal, 55) // cap en 55 si hay muy pocos datos
    : rawTotal;

  const cat = SCORE_CATEGORIES.find(c => total >= c.min) ?? SCORE_CATEGORIES[SCORE_CATEGORIES.length - 1];
  const flags = buildFlags(input);

  const age = ageInYears(input.pet.birth_date);

  // Subline contextual según estado de datos
  let subline: string;
  if (sufficiency === 'too_early') {
    subline = 'Agrega más datos para ver el análisis completo';
  } else if (sufficiency === 'building') {
    subline = `Score basado en ${pilarsWithData} de 5 áreas — ${missingDataCount} pendientes`;
  } else {
    const sublines = cat.sublines;
    subline = sublines[Math.floor(Math.random() * sublines.length)];
  }

  return {
    total,
    category: cat.category,
    color: cat.color,
    headline: cat.headline,
    subline,
    pillars,
    flags,
    dataSufficiency: sufficiency,
    pilarsWithData,
    missingDataCount,
    ageYears: age,
    isSenior: age !== null ? isSenior(input.pet.breed, age) : false,
  };
}
