import { CheckCircle } from "lucide-react";
import { BookingPatient } from "./patient-step";

interface Props {
  specialtyName: string;
  doctorName: string;
  date: string;
  time: string;
  patient: BookingPatient;
}

export function SuccessStep({
  specialtyName,
  doctorName,
  date,
  time,
  patient,
}: Props) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100">
        <CheckCircle className="h-7 w-7 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900">¡Cita reservada!</h2>
      <p className="mt-2 text-sm text-gray-500">
        Te esperamos, {patient.name}. Guarda los detalles de tu cita.
      </p>

      <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm text-gray-600">
        <p>
          <span className="font-medium text-gray-900">{specialtyName}</span>{" "}
          con <span className="font-medium text-gray-900">{doctorName}</span>
        </p>
        <p className="mt-0.5">
          {date} a las {time}
        </p>
        <p className="mt-0.5">Teléfono: {patient.phone}</p>
      </div>
    </div>
  );
}
