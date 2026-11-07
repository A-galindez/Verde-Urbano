import { Droplets } from 'lucide-react';

export interface Recordatorio {
  planta: string;
  frecuencia_dias: number;
  fecha_plantacion: string;
  consejo: string;
}

interface RecordatorioCardProps {
  recordatorio: Recordatorio;
}

export default function RecordatorioCard({
  recordatorio,
}: RecordatorioCardProps) {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
      <h3 className="font-bold text-gray-900 mb-2">
        {recordatorio.planta}
      </h3>

      <p className="text-gray-700">
        {recordatorio.consejo}
      </p>
    </div>
  );
}