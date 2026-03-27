package domain

import (
	"time"
)

const (
	AppointmentStatusPending   AppointmentStatus = "pending"
	AppointmentStatusConfirmed AppointmentStatus = "confirmed"
	AppointmentStatusCancelled AppointmentStatus = "cancelled"
	AppointmentStatusCompleted AppointmentStatus = "completed"
)

type Appointment struct {
	ID       UUID
	DoctorID UUID
	ClinicID UUID

	// Patient info (no full patient entity — patient registers directly when booking)
	PatientName  string
	PatientPhone string

	// Scheduling
	AppointmentDate time.Time
	StartTime       string
	EndTime         string
	Status          AppointmentStatus
	Notes           string

	AuditFields

	// Relations
	Doctor Doctor
	Clinic Clinic

	CancelledAT *time.Time
	ScheduledAt time.Time
}
