export const DOG_BREEDS = [
  'Labrador Retriever',
  'Pastor Alemán',
  'Golden Retriever',
  'Bulldog Francés',
  'Bulldog Inglés',
  'Poodle / Caniche',
  'Beagle',
  'Rottweiler',
  'Yorkshire Terrier',
  'Boxer',
  'Dachshund / Teckel',
  'Husky Siberiano',
  'Chihuahua',
  'Schnauzer',
  'Cocker Spaniel',
  'Jack Russell Terrier',
  'Adoptado / Mestizo',
  'Otro',
] as const;

export type DogBreed = (typeof DOG_BREEDS)[number];
