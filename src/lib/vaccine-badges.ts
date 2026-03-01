// Las 6 vacunas esenciales para perros en Panamá.
// Cuando tengas el PNG, ponlo en /public/badges/ con el nombre del campo `badge`.

export const VACCINE_BADGE_MAP: { keyword: string; badge: string; label: string }[] = [
  { keyword: 'rabia',      badge: 'rabia',      label: 'Rabia' },
  { keyword: 'parvo',      badge: 'parvo',      label: 'Parvovirus' },
  { keyword: 'moquillo',   badge: 'moquillo',   label: 'Moquillo' },
  { keyword: 'bordetella', badge: 'bordetella', label: 'Bordetella' },
  { keyword: 'lepto',      badge: 'Lepto',      label: 'Leptospirosis' },
  { keyword: 'hepatitis',  badge: 'Hepatitis',  label: 'Hepatitis' },
];

/** Devuelve la ruta del badge (o null si no hay imagen) y el label corto. */
export function getVaccineBadge(name: string): { src: string | null; label: string } {
  const lower = name.toLowerCase();
  const match = VACCINE_BADGE_MAP.find((v) => lower.includes(v.keyword));
  return {
    src: match ? `/badges/vacunas/${match.badge}.png` : null,
    label: match?.label ?? name,
  };
}
