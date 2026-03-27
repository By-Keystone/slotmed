package model

import (
	"github.com/clinica-citas/backend/internal/domain"
)

type User struct {
	ID       domain.UUID  `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	AuthID   string       `gorm:"type:uuid;not null;uniqueIndex;column:auth_id"`
	Name     string       `gorm:"not null;size:255"`
	Lastname string       `gorm:"size:255"`
	Email    domain.Email `gorm:"not null;size:255"`
	AuditFields
}

func (m *User) ToDomain() *domain.User {
	return &domain.User{
		ID:       m.ID,
		AuthId:   m.AuthID,
		Name:     m.Name,
		Lastname: m.Lastname,
		Email:    m.Email,
		AuditFields: domain.AuditFields{
			CreatedAt: m.CreatedAt,
			UpdatedAt: m.UpdatedAt,
		},
	}
}
