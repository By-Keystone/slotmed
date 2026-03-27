package model

import (
	"time"

	"github.com/clinica-citas/backend/internal/domain"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Appointment struct {
	ID       domain.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	DoctorID domain.UUID `gorm:"type:uuid;not null"`
	ClinicID domain.UUID `gorm:"type:uuid;not null"`

	PatientName  string `gorm:"not null;size:255"`
	PatientPhone string `gorm:"not null;size:50"`

	AppointmentDate time.Time                `gorm:"not null"`
	StartTime       string                   `gorm:"not null"`
	EndTime         string                   `gorm:"not null"`
	Status          domain.AppointmentStatus `gorm:"not null"`
	Notes           string                   `gorm:"size:100"`

	AuditFields

	CancelledAt *time.Time
	ScheduledAt time.Time `gorm:"not null"`

	Doctor Doctor `gorm:"foreignKey:DoctorID"`
	Clinic Clinic `gorm:"foreignKey:ClinicID"`
}

func (m *Appointment) ToDomain() *domain.Appointment {
	a := &domain.Appointment{
		ID:              m.ID,
		DoctorID:        m.DoctorID,
		ClinicID:        m.ClinicID,
		PatientName:     m.PatientName,
		PatientPhone:    m.PatientPhone,
		AppointmentDate: m.AppointmentDate,
		StartTime:       m.StartTime,
		EndTime:         m.EndTime,
		Status:          m.Status,
		Notes:           m.Notes,
		AuditFields: domain.AuditFields{
			CreatedAt: m.CreatedAt,
			UpdatedAt: m.UpdatedAt,
		},
		CancelledAT: m.CancelledAt,
		ScheduledAt: m.ScheduledAt,
		Doctor:      *m.Doctor.ToDomain(),
		Clinic:      *m.Clinic.ToDomain(),
	}

	if m.DeletedAt != nil && m.DeletedAt.Valid {
		a.AuditFields.DeletedAt = &m.DeletedAt.Time
	}

	return a
}

func AppointmentFromDomain(a *domain.Appointment) *Appointment {
	m := &Appointment{
		ID:              uuid.UUID(a.ID),
		DoctorID:        uuid.UUID(a.DoctorID),
		ClinicID:        uuid.UUID(a.ClinicID),
		PatientName:     a.PatientName,
		PatientPhone:    a.PatientPhone,
		AppointmentDate: a.AppointmentDate,
		StartTime:       a.StartTime,
		EndTime:         a.EndTime,
		Status:          a.Status,
		Notes:           a.Notes,
		CancelledAt:     a.CancelledAT,
		ScheduledAt:     a.ScheduledAt,
	}

	if a.AuditFields.DeletedAt != nil {
		m.DeletedAt = &gorm.DeletedAt{Time: *a.DeletedAt, Valid: true}
	}

	return m
}
