import { ClinicWithUser } from "@/lib/api/clinic/types";
import { Column, Table } from "../common/table";

interface Props {
  clinics: ClinicWithUser[];
}

const columns: Column<ClinicWithUser>[] = [
  {
    key: "name",
    header: "Nombre de la clínica",
    align: "center",
    cell: (row) => <span>{row.name}</span>,
  },
  {
    key: "address",
    header: "Dirección",
    align: "center",
    cell: (row) => <span>{row.address}</span>,
  },
  {
    key: "phone",
    header: "Número de teléfono",
    align: "center",
    cell: (row) => <span>{row.phone}</span>,
  },
  {
    key: "createdBy",
    header: "Propietario",
    align: "center",
    cell: (row) => (
      <span>
        {row.createdBy.name} {row.createdBy.lastName}
      </span>
    ),
  },
];

export const ClinicsTable = ({ clinics }: Props) => {
  return <Table getRowKey={(row) => row.id} rows={clinics} columns={columns} />;
};
