package model

import (
	"time"

	"github.com/clinica-citas/backend/internal/domain"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Doctor struct {
	ID        domain.UUID  `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	ClinicID  domain.UUID  `gorm:"type:uuid;not null"`
	Name      string       `gorm:"not null;size:255"`
	Specialty string       `gorm:"size:255"`
	Email     domain.Email `gorm:"size:255"`
	Phone     string       `gorm:"size:50"`
	Active    bool         `gorm:"not null;default:true"`
	AuditFields

	Clinic    Clinic           `gorm:"foreignKey:ClinicID"`
	Schedules []DoctorSchedule `gorm:"foreignKey:DoctorID"`
}

func (m *Doctor) ToDomain() *domain.Doctor {
	d := &domain.Doctor{
		ID:        m.ID,
		ClinicID:  m.ClinicID,
		Name:      m.Name,
		Specialty: m.Specialty,
		Email:     m.Email,
		Phone:     m.Phone,
		Active:    m.Active,
		AuditFields: domain.AuditFields{
			CreatedAt: m.CreatedAt,
			UpdatedAt: m.UpdatedAt,
		},
		Clinic: *m.Clinic.ToDomain(),
	}

	if m.DeletedAt != nil && m.DeletedAt.Valid {
		d.AuditFields.DeletedAt = &m.DeletedAt.Time
	}

	for _, s := range m.Schedules {
		d.Schedules = append(d.Schedules, *s.ToDomain())
	}

	return d
}

func DoctorFromDomain(doc *domain.Doctor) *Doctor {
	m := &Doctor{
		ID:        uuid.UUID(doc.ID),
		ClinicID:  uuid.UUID(doc.ClinicID),
		Name:      doc.Name,
		Specialty: doc.Specialty,
		Email:     doc.Email,
		Phone:     doc.Phone,
		Active:    doc.Active,
	}

	if doc.AuditFields.DeletedAt != nil {
		m.DeletedAt = &gorm.DeletedAt{Time: *doc.DeletedAt, Valid: true}
	}

	return m
}

type DoctorSchedule struct {
	ID        domain.UUID      `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	DoctorID  domain.UUID      `gorm:"type:uuid;not null"`
	DayOfWeek domain.DayOfWeek `gorm:"not null"`
	StartTime string           `gorm:"not null;size:5"`
	EndTime   string           `gorm:"not null;size:5"`
	CreatedAt time.Time        `gorm:"autoCreateTime"`
	UpdatedAt time.Time        `gorm:"autoUpdateTime"`
	DeletedAt gorm.DeletedAt   `gorm:"index"`
}

func (m *DoctorSchedule) ToDomain() *domain.DoctorSchedule {
	s := &domain.DoctorSchedule{
		ID:        m.ID,
		DoctorID:  m.DoctorID,
		DayOfWeek: m.DayOfWeek,
		StartTime: m.StartTime,
		EndTime:   m.EndTime,
		AuditFields: domain.AuditFields{
			CreatedAt: m.CreatedAt,
			UpdatedAt: m.UpdatedAt,
		},
	}

	if m.DeletedAt.Valid {
		s.AuditFields.DeletedAt = &m.DeletedAt.Time
	}

	return s
}

func DoctorScheduleFromDomain(ds *domain.DoctorSchedule) *DoctorSchedule {
	m := &DoctorSchedule{
		ID:        uuid.UUID(ds.ID),
		DoctorID:  uuid.UUID(ds.DoctorID),
		DayOfWeek: ds.DayOfWeek,
		StartTime: ds.StartTime,
		EndTime:   ds.EndTime,
	}

	if ds.AuditFields.DeletedAt != nil {
		m.DeletedAt = gorm.DeletedAt{Time: *ds.DeletedAt, Valid: true}
	}

	return m
}
