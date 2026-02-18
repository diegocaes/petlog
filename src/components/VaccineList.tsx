import { Syringe, AlertTriangle, Trash2, Clock } from 'lucide-react';
import type { Vaccine } from '../types/supabase';

interface Props {
  vaccines: Vaccine[];
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

function isOverdue(dateStr: string): boolean {
  return new Date(dateStr + 'T00:00:00') < new Date();
}

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default function VaccineList({ vaccines }: Props) {
  if (vaccines.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-sm border border-[#EBE4D6]/50">
        <p className="text-4xl mb-3">💉</p>
        <p className="text-gray-500">Aún no hay vacunas registradas</p>
        <p className="text-sm text-gray-400 mt-1">Registra la primera vacuna arriba</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {vaccines.map((vaccine) => {
        const overdue = vaccine.next_due && isOverdue(vaccine.next_due);
        const daysLeft = vaccine.next_due ? daysUntil(vaccine.next_due) : null;

        return (
          <div
            key={vaccine.id}
            className={`rounded-3xl bg-white p-5 shadow-sm border transition-all ${
              overdue ? 'border-red-200 bg-red-50/30' : 'border-[#EBE4D6]/50'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className={`shrink-0 rounded-xl p-2.5 ${
                  overdue ? 'bg-red-100 text-red-500' : 'bg-green-50 text-[#166534]'
                }`}>
                  <Syringe size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800">{vaccine.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Aplicada: {formatDate(vaccine.date_given)}
                    {vaccine.vet_name && ` · ${vaccine.vet_name}`}
                  </p>
                  {vaccine.next_due && (
                    <div className={`mt-2 flex items-center gap-1.5 text-xs font-medium ${
                      overdue ? 'text-red-500' : daysLeft !== null && daysLeft <= 30 ? 'text-amber-600' : 'text-[#166534]'
                    }`}>
                      {overdue ? <AlertTriangle size={12} /> : <Clock size={12} />}
                      <span>
                        {overdue
                          ? `Vencida hace ${Math.abs(daysLeft!)} días`
                          : `Próxima: ${formatDate(vaccine.next_due)} (${daysLeft} días)`
                        }
                      </span>
                    </div>
                  )}
                  {vaccine.notes && (
                    <p className="text-xs text-gray-400 mt-1">{vaccine.notes}</p>
                  )}
                </div>
              </div>
              <form method="POST">
                <input type="hidden" name="_action" value="delete" />
                <input type="hidden" name="vaccine_id" value={vaccine.id} />
                <button
                  type="submit"
                  className="shrink-0 rounded-xl p-2 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-400"
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
}
