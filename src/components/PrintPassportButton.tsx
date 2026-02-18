import { Printer } from 'lucide-react';

export default function PrintPassportButton() {
  return (
    <a
      href="/print"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-2xl bg-[#166534] px-5 py-3 font-semibold text-white shadow-md transition-all hover:bg-[#1B7D40] active:scale-95"
    >
      <Printer size={18} />
      Imprimir para aeropuerto
    </a>
  );
}
