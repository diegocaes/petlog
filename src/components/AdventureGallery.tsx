import { useState } from 'react';
import { X, MapPin, Calendar, Trash2 } from 'lucide-react';
import type { Adventure } from '../types/supabase';

interface Props {
  adventures: Adventure[];
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdventureGallery({ adventures }: Props) {
  const [lightbox, setLightbox] = useState<Adventure | null>(null);

  if (adventures.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-sm border border-[#EBE4D6]/50">
        <p className="text-4xl mb-3">📸</p>
        <p className="text-gray-500">Aún no hay aventuras registradas</p>
        <p className="text-sm text-gray-400 mt-1">Sube la primera foto de tu mascota</p>
      </div>
    );
  }

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {adventures.map((adventure) => (
          <button
            key={adventure.id}
            onClick={() => setLightbox(adventure)}
            className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition-all hover:shadow-md active:scale-95"
          >
            {adventure.photo_url ? (
              <img
                src={adventure.photo_url}
                alt={adventure.title}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-[#F5F0E8] to-[#EBE4D6] text-3xl">
                🐾
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-3 pt-8">
              <p className="text-xs font-semibold text-white truncate">{adventure.title}</p>
              {adventure.location && (
                <p className="text-[10px] text-white/70 truncate flex items-center gap-0.5 mt-0.5">
                  <MapPin size={10} /> {adventure.location}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl bg-white overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute right-3 top-3 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>

            {/* Image */}
            {lightbox.photo_url ? (
              <img
                src={lightbox.photo_url}
                alt={lightbox.title}
                className="w-full max-h-[60vh] object-contain bg-gray-900"
              />
            ) : (
              <div className="flex h-48 w-full items-center justify-center bg-linear-to-br from-[#F5F0E8] to-[#EBE4D6] text-6xl">
                🐾
              </div>
            )}

            {/* Info */}
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-800">{lightbox.title}</h3>
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {formatDate(lightbox.date)}
                </span>
                {lightbox.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {lightbox.location}
                  </span>
                )}
              </div>
              {lightbox.description && (
                <p className="mt-3 text-sm text-gray-600">{lightbox.description}</p>
              )}
              <form method="POST" className="mt-4">
                <input type="hidden" name="_action" value="delete" />
                <input type="hidden" name="adventure_id" value={lightbox.id} />
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 size={14} />
                  Eliminar
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
