package model

import (
	"github.com/clinica-citas/backend/internal/domain"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Clinic struct {
	ID        domain.UUID  `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Name      string       `gorm:"not null;size:255"`
	Address   string       `gorm:"size:500"`
	Phone     string       `gorm:"size:50"`
	Email     domain.Email `gorm:"size:255"`
	Active    bool         `gorm:"not null;default:true"`
	CreatedBy domain.UUID  `gorm:"not null;type:uuid"`

	User User `gorm:"foreignKey:CreatedBy"`
	AuditFields
}

func (m *Clinic) ToDomain() *domain.Clinic {
	c := &domain.Clinic{
		ID:      m.ID,
		Name:    m.Name,
		Address: m.Address,
		Phone:   m.Phone,
		Email:   m.Email,
		Active:  m.Active,
		AuditFields: domain.AuditFields{
			CreatedAt: m.CreatedAt,
			UpdatedAt: m.UpdatedAt},
	}

	if m.DeletedAt != nil && m.DeletedAt.Valid {
		c.AuditFields.DeletedAt = &m.DeletedAt.Time
	}
	return c
}

func ClinicFromDomain(c *domain.Clinic) *Clinic {
	m := &Clinic{
		ID:        uuid.UUID(c.ID),
		Name:      c.Name,
		Address:   c.Address,
		Phone:     c.Phone,
		Email:     c.Email,
		Active:    c.Active,
		CreatedBy: uuid.UUID(c.CreatedBy.ID),
	}
	if c.AuditFields.DeletedAt != nil {
		m.DeletedAt = &gorm.DeletedAt{Time: *c.DeletedAt, Valid: true}
	}
	return m
}
