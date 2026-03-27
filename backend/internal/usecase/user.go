package usecase

import (
	"context"
	"errors"

	"github.com/clinica-citas/backend/internal/domain"
	"github.com/clinica-citas/backend/internal/port"
)

type CreateUserRequest struct {
	Name     string       `json:"name"`
	Lastname string       `json:"lastname"`
	Email    domain.Email `json:"email"`
	AuthId   string       `json:"authId"`
}

type GetUserByAuthIdRequest struct {
	AuthId string
}

type GetUserByAuthIdResponse struct {
	ID       domain.UUID  `json:"id"`
	Name     string       `json:"name"`
	Lastname string       `json:"lastname"`
	Email    domain.Email `json:"email"`
}

type GetUserProfileRequest struct {
	AuthId string
}

type GetUserProfileResponse struct {
	ID       domain.UUID  `json:"id"`
	Name     string       `json:"name"`
	Lastname string       `json:"lastname"`
	Email    domain.Email `json:"email"`
	AuthId   string       `json:"authId"`
}

type UserUseCase interface {
	Create(ctx context.Context, req CreateUserRequest) (*domain.User, error)
	GetByAuthId(ctx context.Context, req GetUserByAuthIdRequest) (*GetUserByAuthIdResponse, error)
	GetProfile(ctx context.Context, req GetUserProfileRequest) (*GetUserProfileResponse, error)
}

type userUseCase struct {
	userRepo port.UserRepository
}

func NewUserUseCase(userRepo port.UserRepository) UserUseCase {
	return &userUseCase{userRepo: userRepo}
}

func (uc *userUseCase) Create(ctx context.Context, req CreateUserRequest) (*domain.User, error) {
	if req.Name == "" {
		return nil, errors.New("name is required")
	}
	if req.Lastname == "" {
		return nil, errors.New("lastname is required")
	}
	if req.Email == "" {
		return nil, errors.New("email is required")
	}

	user := &domain.User{
		Name:     req.Name,
		Lastname: req.Lastname,
		Email:    req.Email,
		AuthId:   req.AuthId,
	}

	if err := uc.userRepo.Create(ctx, user); err != nil {
		return nil, err
	}

	return user, nil
}

func (uc *userUseCase) GetByAuthId(ctx context.Context, req GetUserByAuthIdRequest) (*GetUserByAuthIdResponse, error) {
	user, err := uc.userRepo.GetByAuthId(ctx, req.AuthId)
	if err != nil {
		return nil, err
	}
	return &GetUserByAuthIdResponse{ID: user.ID, Name: user.Name, Lastname: user.Lastname, Email: user.Email}, nil

}

func (uc *userUseCase) GetProfile(ctx context.Context, req GetUserProfileRequest) (*GetUserProfileResponse, error) {
	user, err := uc.userRepo.GetByAuthId(ctx, req.AuthId)

	if err != nil {
		return nil, err
	}

	return &GetUserProfileResponse{ID: user.ID, Name: user.Name, Lastname: user.Lastname, Email: user.Email, AuthId: user.AuthId}, nil
}
