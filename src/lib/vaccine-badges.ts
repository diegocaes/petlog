// Mapea palabras clave en el nombre de la vacuna → archivo de badge en /public/badges/
// El match es case-insensitive y busca si el nombre CONTIENE la keyword.
// Agrega más entradas según las vacunas que registres.

export const VACCINE_BADGE_MAP: { keyword: string; badge: string; label: string }[] = [
  { keyword: 'rabia',        badge: 'rabia',        label: 'Rabia' },
  { keyword: 'parvo',        badge: 'parvovirus',   label: 'Parvovirus' },
  { keyword: 'moquillo',     badge: 'moquillo',     label: 'Moquillo' },
  { keyword: 'bordetella',   badge: 'bordetella',   label: 'Bordetella' },
  { keyword: 'lepto',        badge: 'leptospirosis',label: 'Leptospirosis' },
  { keyword: 'influenza',    badge: 'influenza',    label: 'Influenza' },
  { keyword: 'coronavirus',  badge: 'coronavirus',  label: 'Coronavirus' },
  { keyword: 'lyme',         badge: 'lyme',         label: 'Lyme' },
  { keyword: 'hepatitis',    badge: 'hepatitis',    label: 'Hepatitis' },
  { keyword: 'triple',       badge: 'triple-felina',label: 'Triple' },
  { keyword: 'sextuple',     badge: 'sextuple',     label: 'Séxtuple' },
  { keyword: 'octuple',      badge: 'octuple',      label: 'Óctuple' },
];

/** Devuelve la ruta del badge y el label corto para un nombre de vacuna. */
export function getVaccineBadge(name: string): { src: string; label: string } {
  const lower = name.toLowerCase();
  const match = VACCINE_BADGE_MAP.find((v) => lower.includes(v.keyword));
  return {
    src: match ? `/badges/${match.badge}.png` : '/badges/default.png',
    label: match?.label ?? name,
  };
}
