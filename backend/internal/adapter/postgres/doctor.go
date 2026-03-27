package postgres

import (
	"context"
	"errors"

	"github.com/clinica-citas/backend/internal/adapter/postgres/model"
	"github.com/clinica-citas/backend/internal/domain"
	"github.com/clinica-citas/backend/internal/port"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type doctorRepository struct {
	db *gorm.DB
}

func NewDoctorRepository(db *gorm.DB) port.DoctorRepository {
	return &doctorRepository{db: db}
}

func (r *doctorRepository) Create(ctx context.Context, doctor *domain.Doctor) error {
	m := model.DoctorFromDomain(doctor)
	return r.db.WithContext(ctx).Create(m).Error
}

func (r *doctorRepository) Update(ctx context.Context, doctor *domain.Doctor) error {
	return r.db.WithContext(ctx).Save(doctor).Error
}

func (r *doctorRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.Doctor, error) {
	var doctor domain.Doctor
	err := r.db.WithContext(ctx).First(&doctor, "id = ?", id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, port.ErrNotFound
		}
		return nil, err
	}
	return &doctor, nil
}

func (r *doctorRepository) ReplaceSchedules(ctx context.Context, doctorID uuid.UUID, schedules []domain.DoctorSchedule) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("doctor_id = ?", doctorID).Delete(&domain.DoctorSchedule{}).Error; err != nil {
			return err
		}
		if len(schedules) == 0 {
			return nil
		}
		return tx.Create(&schedules).Error
	})
}

func (r *doctorRepository) FindSchedulesByDoctorID(ctx context.Context, doctorID uuid.UUID) ([]domain.DoctorSchedule, error) {
	var schedules []domain.DoctorSchedule
	err := r.db.WithContext(ctx).
		Where("doctor_id = ?", doctorID).
		Order("day_of_week, start_time").
		Find(&schedules).Error
	return schedules, err
}
