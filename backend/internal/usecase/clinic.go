package usecase

import (
	"context"
	"errors"

	"github.com/clinica-citas/backend/internal/domain"
	"github.com/clinica-citas/backend/internal/port"
)

type CreateClinicRequest struct {
	Name      string       `json:"name"`
	Address   string       `json:"address"`
	Phone     string       `json:"phone"`
	Email     domain.Email `json:"email"`
	CreatedBy domain.UUID  `json:"createdBy"`
}

type UpdateClinicRequest struct {
	Name    *string       `json:"name"`
	Address *string       `json:"address"`
	Phone   *string       `json:"phone"`
	Email   *domain.Email `json:"email"`
	Active  *bool         `json:"active"`
}

type GetClinicResponse struct {
	Id      domain.UUID  `json:"id"`
	Name    string       `json:"name"`
	Address string       `json:"address"`
	Phone   string       `json:"phone"`
	Email   domain.Email `json:"email"`
}

type GetClinicByUserIdResponse struct {
	Id        domain.UUID  `json:"id"`
	Name      string       `json:"name"`
	Address   string       `json:"address"`
	Phone     string       `json:"phone"`
	Email     domain.Email `json:"email"`
	CreatedBy domain.UUID  `json:"createdBy"`
}

type ClinicUseCase interface {
	Create(ctx context.Context, req CreateClinicRequest) (*domain.Clinic, error)
	Update(ctx context.Context, id domain.UUID, req UpdateClinicRequest) (*domain.Clinic, error)
	GetClinicsByUserId(ctx context.Context, id string) ([]GetClinicByUserIdResponse, error)
	GetAll(ctx context.Context) ([]GetClinicResponse, error)
}

type clinicUseCase struct {
	repo     port.ClinicRepository
	userRepo port.UserRepository
}

func NewClinicUseCase(repo port.ClinicRepository) ClinicUseCase {
	return &clinicUseCase{repo: repo}
}

func (uc *clinicUseCase) Create(ctx context.Context, req CreateClinicRequest) (*domain.Clinic, error) {
	if req.Name == "" {
		return nil, errors.New("name is required")
	}

	clinic := &domain.Clinic{
		Name:      req.Name,
		Address:   req.Address,
		Phone:     req.Phone,
		Email:     req.Email,
		CreatedBy: domain.User{ID: req.CreatedBy},
	}

	if err := uc.repo.Create(ctx, clinic); err != nil {
		return nil, err
	}
	return clinic, nil
}

func (uc *clinicUseCase) Update(ctx context.Context, id domain.UUID, req UpdateClinicRequest) (*domain.Clinic, error) {
	clinic, err := uc.repo.FindByID(ctx, id)
	if err != nil {
		if errors.Is(err, port.ErrNotFound) {
			return nil, ErrClinicNotFound
		}
		return nil, err
	}

	if req.Name != nil {
		if *req.Name == "" {
			return nil, errors.New("name cannot be empty")
		}
		clinic.Name = *req.Name
	}
	if req.Address != nil {
		clinic.Address = *req.Address
	}
	if req.Phone != nil {
		clinic.Phone = *req.Phone
	}
	if req.Email != nil {
		clinic.Email = *req.Email
	}
	if req.Active != nil {
		clinic.Active = *req.Active
	}

	if err := uc.repo.Update(ctx, clinic); err != nil {
		return nil, err
	}
	return clinic, nil
}

func (uc *clinicUseCase) GetClinicsByUserId(ctx context.Context, id string) ([]GetClinicByUserIdResponse, error) {
	clinics, err := uc.repo.FindAllByUserId(ctx, id)
	if err != nil {
		return nil, err
	}

	resp := make([]GetClinicByUserIdResponse, 0, len(clinics))

	for _, c := range clinics {
		resp = append(resp, GetClinicByUserIdResponse{
			Id:        c.ID,
			Name:      c.Name,
			Address:   c.Address,
			Phone:     c.Phone,
			Email:     c.Email,
			CreatedBy: c.CreatedBy.ID,
		})
	}

	return resp, nil
}

func (uc *clinicUseCase) GetAll(ctx context.Context) ([]GetClinicResponse, error) {
	clinics, err := uc.repo.GetAll(ctx)

	if err != nil {
		return nil, err
	}

	resp := make([]GetClinicResponse, 0, len(clinics))

	for _, c := range clinics {
		resp = append(resp, GetClinicResponse{
			Id:      c.ID,
			Name:    c.Name,
			Address: c.Address,
			Phone:   c.Phone,
			Email:   c.Email,
		})
	}

	return resp, nil
}
