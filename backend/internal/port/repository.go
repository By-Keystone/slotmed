package port

import (
	"context"
	"errors"
	"time"

	"github.com/clinica-citas/backend/internal/domain"
	"github.com/google/uuid"
)

// ErrNotFound is returned by repository adapters when a record does not exist.
// Use cases check for this error and map it to their own domain errors.
var ErrNotFound = errors.New("record not found")

type ClinicRepository interface {
	Create(ctx context.Context, clinic *domain.Clinic) error
	Update(ctx context.Context, clinic *domain.Clinic) error
	FindByID(ctx context.Context, id domain.UUID) (*domain.Clinic, error)
	FindAllByUserId(ctx context.Context, userId string) ([]domain.Clinic, error)
	GetAll(ctx context.Context) ([]domain.Clinic, error)
}

type DoctorRepository interface {
	Create(ctx context.Context, doctor *domain.Doctor) error
	Update(ctx context.Context, doctor *domain.Doctor) error
	FindByID(ctx context.Context, id domain.UUID) (*domain.Doctor, error)
	ReplaceSchedules(ctx context.Context, doctorID uuid.UUID, schedules []domain.DoctorSchedule) error
	FindSchedulesByDoctorID(ctx context.Context, doctorID uuid.UUID) ([]domain.DoctorSchedule, error)
}

type AppointmentRepository interface {
	Create(ctx context.Context, appointment *domain.Appointment) error
	Update(ctx context.Context, appointment *domain.Appointment) error
	FindByID(ctx context.Context, id domain.UUID) (*domain.Appointment, error)
	FindByDoctorAndDate(ctx context.Context, doctorID uuid.UUID, date time.Time) ([]domain.Appointment, error)
}

type UserRepository interface {
	Create(ctx context.Context, user *domain.User) error
	GetByAuthId(ctx context.Context, authId string) (*domain.User, error)
}
