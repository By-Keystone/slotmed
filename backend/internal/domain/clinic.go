package domain

type Clinic struct {
	ID      UUID
	Name    string
	Address string
	Phone   string
	Email   Email
	Active  bool

	CreatedBy User
	AuditFields
}
