import {
  ShieldCheck,
  Stethoscope,
  Briefcase,
  Clock,
  HeartPulse,
} from "lucide-react";
import FormField from "./FormField";

export function DoctorRegistration({ register }: any) {
  return (
    <>
      <FormField
        label="Medical Registration ID"
        icon={<ShieldCheck size={18} />}
        placeholder="MC-12345"
        register={register("registrationId")}
      />

      <FormField
        label="Specialization"
        icon={<Stethoscope size={18} />}
        placeholder="Cardiologist"
        register={register("specialization")}
      />

      <FormField
        label="Qualification"
        icon={<Briefcase size={18} />}
        placeholder="MD, FACS"
        register={register("qualification")}
      />

      <FormField
        label="Experience (Years)"
        icon={<Clock size={18} />}
        type="number"
        placeholder="5"
        register={register("experience", { valueAsNumber: true })}
      />

      <FormField
        label="Consultation Fee ($)"
        icon={<HeartPulse size={18} />}
        type="number"
        placeholder="100"
        register={register("consultationFee", { valueAsNumber: true })}
      />
    </>
  );
}

