import { Column, Table } from "@/components/common/table";
import { Doctor } from "@/lib/api/doctors/types";
import { Check, Cross } from "lucide-react";

const columns: Column<Doctor>[] = [
  {
    key: "doctorId",
    header: "ID",
    cell: (row) => <span>{row.doctorId}</span>,
  },
  {
    key: "name",
    header: "Nombres",
    cell: (row) => (
      <span>
        {row.name} {row.lastName}
      </span>
    ),
  },
  {
    key: "specialty",
    header: "Especialidad",
    cell: (row) => (
      <span>{row.specialty ?? "No ha seleccionado una especialidad"}</span>
    ),
  },
  {
    key: "phone",
    header: "Teléfono",
    cell: (row) => (
      <span>{row.phone ?? "No ha ingresado un número de teléfono"}</span>
    ),
  },
  {
    key: "confirmed",
    header: "Email confirmado",
    cell: (row) => (
      <span className="flex justify-center">
        {row.confirmed ? <Check /> : <Cross />}
      </span>
    ),
  },
];

interface Props {
  data: Doctor[];
}

export const DoctorListTable = ({ data }: Props) => {
  return (
    <Table
      getRowKey={(row) => row.doctorId}
      columns={columns}
      rows={data}
      empty="No hay doctores asignados a esta clínica"
    />
  );
};
