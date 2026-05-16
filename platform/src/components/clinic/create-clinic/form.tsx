import { ClinicBaseForm } from "../base-form";

interface Props { 
    formId: string;
    action: (formData: FormData) => void;
}
export function CreateClinicForm({ formId, action }: Props){
    return <ClinicBaseForm formId={formId} action={action}/>
}