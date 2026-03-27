package postgres

import (
	"context"
	"errors"

	"github.com/clinica-citas/backend/internal/adapter/postgres/model"
	"github.com/clinica-citas/backend/internal/domain"
	"github.com/clinica-citas/backend/internal/port"
	"gorm.io/gorm"
)

type clinicRepository struct {
	db *gorm.DB
}

func NewClinicRepository(db *gorm.DB) port.ClinicRepository {
	return &clinicRepository{db: db}
}

func (r *clinicRepository) Create(ctx context.Context, clinic *domain.Clinic) error {
	m := model.ClinicFromDomain(clinic)
	if err := r.db.WithContext(ctx).Create(m).Error; err != nil {
		return err
	}
	clinic.ID = m.ID
	return nil
}

func (r *clinicRepository) Update(ctx context.Context, clinic *domain.Clinic) error {
	m := model.ClinicFromDomain(clinic)
	return r.db.WithContext(ctx).Save(m).Error
}

func (r *clinicRepository) FindByID(ctx context.Context, id domain.UUID) (*domain.Clinic, error) {
	var m model.Clinic
	err := r.db.WithContext(ctx).First(&m, "id = ?", id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, port.ErrNotFound
		}
		return nil, err
	}
	return m.ToDomain(), nil
}

func (r *clinicRepository) FindAllByUserId(ctx context.Context, userId string) ([]domain.Clinic, error) {
	var ms []model.Clinic
	if err := r.db.WithContext(ctx).Where("created_by = ?", userId).Find(&ms).Error; err != nil {
		return nil, err
	}
	clinics := make([]domain.Clinic, len(ms))
	for i, m := range ms {
		clinics[i] = *m.ToDomain()
	}
	return clinics, nil
}

func (r *clinicRepository) GetAll(ctx context.Context) ([]domain.Clinic, error) {
	var ms []model.Clinic

	if err := r.db.WithContext(ctx).Find(&ms).Error; err != nil {
		return nil, err
	}

	clinics := make([]domain.Clinic, len(ms))

	for i, m := range ms {
		clinics[i] = *m.ToDomain()
	}
	return clinics, nil
}
