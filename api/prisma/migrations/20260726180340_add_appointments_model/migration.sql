-- CreateTable
CREATE TABLE "appointment" (
    "id" UUID NOT NULL,
    "doctor_profile_id" UUID NOT NULL,
    "patient_name" TEXT NOT NULL,
    "patient_last_name" TEXT NOT NULL,
    "patient_phone" TEXT NOT NULL,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "duration_minutes" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "appointment_doctor_profile_id_scheduled_at_key" ON "appointment"("doctor_profile_id", "scheduled_at");

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_doctor_profile_id_fkey" FOREIGN KEY ("doctor_profile_id") REFERENCES "doctor_profile"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
