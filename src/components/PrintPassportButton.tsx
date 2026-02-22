import { Printer } from 'lucide-react';

export default function PrintPassportButton() {
  return (
    <a
      href="/print"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-2xl bg-accent px-5 py-3 font-semibold text-white shadow-md transition-all hover:bg-accent-dark active:scale-95"
    >
      <Printer size={18} />
      Imprimir para aeropuerto
    </a>
  );
}
