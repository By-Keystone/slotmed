package usecase

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/clinica-citas/backend/internal/domain"
	"github.com/clinica-citas/backend/internal/port"
	"github.com/google/uuid"
)

type ScheduleBlockRequest struct {
	DayOfWeek domain.DayOfWeek `json:"day_of_week"`
	StartTime string           `json:"start_time"` // "HH:MM"
	EndTime   string           `json:"end_time"`   // "HH:MM"
}

type CreateDoctorRequest struct {
	Name      string       `json:"name"`
	Specialty string       `json:"specialty"`
	Email     domain.Email `json:"email"`
	Phone     string       `json:"phone"`
	ClinicId  domain.UUID  `json:"clinicId"`
}

type UpdateDoctorRequest struct {
	Name      *string       `json:"name"`
	Specialty *string       `json:"specialty"`
	Email     *domain.Email `json:"email"`
	Phone     *string       `json:"phone"`
	Active    *bool         `json:"active"`
}

type DoctorUseCase interface {
	Create(ctx context.Context, req CreateDoctorRequest) (*domain.Doctor, error)
	Update(ctx context.Context, id uuid.UUID, req UpdateDoctorRequest) (*domain.Doctor, error)
	SetSchedules(ctx context.Context, doctorID uuid.UUID, blocks []ScheduleBlockRequest) ([]domain.DoctorSchedule, error)
	GetSchedules(ctx context.Context, doctorID uuid.UUID) ([]domain.DoctorSchedule, error)
}

type doctorUseCase struct {
	repo       port.DoctorRepository
	clinicRepo port.ClinicRepository
}

func NewDoctorUseCase(repo port.DoctorRepository, clinicRepo port.ClinicRepository) DoctorUseCase {
	return &doctorUseCase{repo: repo, clinicRepo: clinicRepo}
}

func (uc *doctorUseCase) Create(ctx context.Context, req CreateDoctorRequest) (*domain.Doctor, error) {
	if req.Name == "" {
		return nil, errors.New("name is required")
	}

	if _, err := uc.clinicRepo.FindByID(ctx, req.ClinicId); err != nil {
		if errors.Is(err, port.ErrNotFound) {
			return nil, ErrClinicNotFound
		}
		return nil, err
	}

	doctor := &domain.Doctor{
		ClinicID:  req.ClinicId,
		Name:      req.Name,
		Specialty: req.Specialty,
		Email:     req.Email,
		Phone:     req.Phone,
	}

	if err := uc.repo.Create(ctx, doctor); err != nil {
		return nil, err
	}
	return doctor, nil
}

func (uc *doctorUseCase) Update(ctx context.Context, id uuid.UUID, req UpdateDoctorRequest) (*domain.Doctor, error) {
	doctor, err := uc.repo.FindByID(ctx, id)
	if err != nil {
		if errors.Is(err, port.ErrNotFound) {
			return nil, ErrDoctorNotFound
		}
		return nil, err
	}

	if req.Name != nil {
		if *req.Name == "" {
			return nil, errors.New("name cannot be empty")
		}
		doctor.Name = *req.Name
	}
	if req.Specialty != nil {
		doctor.Specialty = *req.Specialty
	}
	if req.Email != nil {
		doctor.Email = *req.Email
	}
	if req.Phone != nil {
		doctor.Phone = *req.Phone
	}

	if req.Active != nil {
		doctor.Active = *req.Active
	}

	if err := uc.repo.Update(ctx, doctor); err != nil {
		return nil, err
	}
	return doctor, nil
}

func (uc *doctorUseCase) SetSchedules(ctx context.Context, doctorID uuid.UUID, blocks []ScheduleBlockRequest) ([]domain.DoctorSchedule, error) {
	if _, err := uc.repo.FindByID(ctx, doctorID); err != nil {
		if errors.Is(err, port.ErrNotFound) {
			return nil, ErrDoctorNotFound
		}
		return nil, err
	}

	if err := validateScheduleBlocks(blocks); err != nil {
		return nil, err
	}

	schedules := make([]domain.DoctorSchedule, len(blocks))
	for i, b := range blocks {
		schedules[i] = domain.DoctorSchedule{
			DoctorID:  doctorID,
			DayOfWeek: b.DayOfWeek,
			StartTime: b.StartTime,
			EndTime:   b.EndTime,
		}
	}

	if err := uc.repo.ReplaceSchedules(ctx, doctorID, schedules); err != nil {
		return nil, err
	}
	return schedules, nil
}

func (uc *doctorUseCase) GetSchedules(ctx context.Context, doctorID uuid.UUID) ([]domain.DoctorSchedule, error) {
	if _, err := uc.repo.FindByID(ctx, doctorID); err != nil {
		if errors.Is(err, port.ErrNotFound) {
			return nil, ErrDoctorNotFound
		}
		return nil, err
	}
	return uc.repo.FindSchedulesByDoctorID(ctx, doctorID)
}

func validateScheduleBlocks(blocks []ScheduleBlockRequest) error {
	type interval struct{ start, end time.Time }
	byDay := make(map[domain.DayOfWeek][]interval)

	for i, b := range blocks {
		if !b.DayOfWeek.IsValid() {
			return fmt.Errorf("block %d: %w", i, ErrInvalidDayOfWeek)
		}
		start, err := parseHHMM(b.StartTime)
		if err != nil {
			return fmt.Errorf("block %d start_time: %w", i, ErrInvalidTime)
		}
		end, err := parseHHMM(b.EndTime)
		if err != nil {
			return fmt.Errorf("block %d end_time: %w", i, ErrInvalidTime)
		}
		if !start.Before(end) {
			return fmt.Errorf("block %d: %w", i, ErrStartAfterEnd)
		}
		for _, existing := range byDay[b.DayOfWeek] {
			if start.Before(existing.end) && end.After(existing.start) {
				return fmt.Errorf("block %d: %w", i, ErrScheduleOverlap)
			}
		}
		byDay[b.DayOfWeek] = append(byDay[b.DayOfWeek], interval{start, end})
	}
	return nil
}
