export const DOG_BREEDS = [
  'Beagle',
  'Border Collie',
  'Boxer',
  'Bulldog',
  'Chihuahua',
  'Cocker Spaniel',
  'Dachshund',
  'Doberman',
  'French Bulldog',
  'German Shepherd',
  'Golden Retriever',
  'Great Dane',
  'Husky',
  'Jack Russell Terrier',
  'Labrador Retriever',
  'Maltese',
  'Pitbull',
  'Poodle',
  'Pomeranian',
  'Rottweiler',
  'Schnauzer',
  'Shih Tzu',
  'Weimaraner',
  'Yorkshire Terrier',
  'Mixed / Rescue',
  'Other',
] as const;

export type DogBreed = (typeof DOG_BREEDS)[number];

export interface BreedFact { emoji: string; fact: string; }

export const BREED_FACTS: Partial<Record<DogBreed, BreedFact[]>> = {
  'Golden Retriever': [
    { emoji: '🏊', fact: 'Son nadadores natos — aman el agua.' },
    { emoji: '🧠', fact: 'Son el 4° perro más inteligente del mundo.' },
    { emoji: '🥚', fact: 'Pueden llevar un huevo en la boca sin romperlo.' },
  ],
  'Labrador Retriever': [
    { emoji: '🏆', fact: 'La raza más popular del mundo por más de 30 años.' },
    { emoji: '👃', fact: 'Su olfato es 100.000 veces más potente que el humano.' },
    { emoji: '🌊', fact: 'Su pelaje repele el agua gracias a una capa impermeable.' },
  ],
  'German Shepherd': [
    { emoji: '👮', fact: 'La raza más usada por policías y militares del mundo.' },
    { emoji: '🧠', fact: 'Aprenden nuevas órdenes en menos de 5 repeticiones.' },
    { emoji: '💨', fact: 'Pueden correr hasta 48 km/h.' },
  ],
  'French Bulldog': [
    { emoji: '✈️', fact: 'No pueden volar solos — sus narinas cortas dificultan la respiración en alturas.' },
    { emoji: '🏊', fact: 'La mayoría no sabe nadar por su cuerpo robusto y cabeza pesada.' },
    { emoji: '🎭', fact: 'Su oreja en forma de murciélago es su rasgo más distintivo.' },
  ],
  'Bulldog': [
    { emoji: '😴', fact: 'Duermen hasta 12-14 horas al día.' },
    { emoji: '🇬🇧', fact: 'Son el símbolo nacional del Reino Unido.' },
    { emoji: '❄️', fact: 'Odian el calor — son sensibles a las altas temperaturas.' },
  ],
  'Beagle': [
    { emoji: '👃', fact: 'Tienen 220 millones de receptores olfativos (los humanos tenemos 5 millones).' },
    { emoji: '🎵', fact: 'En vez de ladrar, "aúllan" con un sonido musical característico.' },
    { emoji: '🔍', fact: 'Son el perro más usado en aeropuertos para detectar contrabando.' },
  ],
  'Poodle': [
    { emoji: '🧠', fact: 'Son el 2° perro más inteligente del mundo, justo detrás del Border Collie.' },
    { emoji: '🎪', fact: 'Originalmente eran perros de caza acuática, no de circo.' },
    { emoji: '💇', fact: 'Su pelo no se cae — sigue creciendo como el cabello humano.' },
  ],
  'Rottweiler': [
    { emoji: '💪', fact: 'Tienen una de las mordidas más fuertes del reino animal (148 kg de presión).' },
    { emoji: '🐄', fact: 'Eran usados para guiar ganado en la Alemania antigua.' },
    { emoji: '❤️', fact: 'Son perros extremadamente leales y apegados a su familia.' },
  ],
  'Yorkshire Terrier': [
    { emoji: '🦁', fact: 'A pesar de su tamaño, creen que son perros grandes.' },
    { emoji: '💇', fact: 'Su pelo es más parecido al cabello humano que a pelaje normal.' },
    { emoji: '🐭', fact: 'Originalmente eran cazadores de ratas en las fábricas de Yorkshire.' },
  ],
  'Dachshund': [
    { emoji: '🌭', fact: 'Su nombre en alemán significa "perro tejón" — ¡cazaban tejones!' },
    { emoji: '🏎️', fact: 'En Alemania tienen carreras de Dachshunds que son un deporte popular.' },
    { emoji: '🦴', fact: 'Su columna extra larga los hace propensos a problemas de espalda.' },
  ],
  'Husky': [
    { emoji: '❄️', fact: 'Pueden sobrevivir temperaturas de -60°C.' },
    { emoji: '🗣️', fact: 'Son famosos por "hablar" — emiten sonidos parecidos al habla humana.' },
    { emoji: '👁️', fact: 'Pueden tener ojos de diferentes colores (heterocromía) naturalmente.' },
  ],
  'Border Collie': [
    { emoji: '🧠', fact: 'Son el perro más inteligente del mundo — aprenden en 1-2 repeticiones.' },
    { emoji: '👁️', fact: 'Su "mirada fija" puede controlar rebaños de cientos de ovejas.' },
    { emoji: '🏃', fact: 'Necesitan hasta 2 horas de ejercicio diario para estar felices.' },
  ],
  'Mixed / Rescue': [
    { emoji: '❤️', fact: 'Los perros mestizos suelen tener menos problemas genéticos que los de raza pura.' },
    { emoji: '🏆', fact: 'Al adoptarlo, salvaste una vida y ganaste un amigo para siempre.' },
    { emoji: '🧬', fact: 'Su mezcla de razas los hace únicos — ¡no hay dos iguales en el mundo!' },
  ],
};
