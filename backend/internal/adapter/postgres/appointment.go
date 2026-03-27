package postgres

import (
	"context"
	"errors"
	"time"

	"github.com/clinica-citas/backend/internal/domain"
	"github.com/clinica-citas/backend/internal/port"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type appointmentRepository struct {
	db *gorm.DB
}

func NewAppointmentRepository(db *gorm.DB) port.AppointmentRepository {
	return &appointmentRepository{db: db}
}

func (r *appointmentRepository) Create(ctx context.Context, appointment *domain.Appointment) error {
	return r.db.WithContext(ctx).Create(appointment).Error
}

func (r *appointmentRepository) Update(ctx context.Context, appointment *domain.Appointment) error {
	return r.db.WithContext(ctx).Save(appointment).Error
}

func (r *appointmentRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.Appointment, error) {
	var appointment domain.Appointment
	err := r.db.WithContext(ctx).First(&appointment, "id = ?", id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, port.ErrNotFound
		}
		return nil, err
	}
	return &appointment, nil
}

func (r *appointmentRepository) FindByDoctorAndDate(ctx context.Context, doctorID uuid.UUID, date time.Time) ([]domain.Appointment, error) {
	var appointments []domain.Appointment
	err := r.db.WithContext(ctx).
		Where("doctor_id = ? AND appointment_date = ? AND status != ?",
			doctorID,
			date.Format("2006-01-02"),
			domain.AppointmentStatusCancelled,
		).
		Order("start_time").
		Find(&appointments).Error
	return appointments, err
}
