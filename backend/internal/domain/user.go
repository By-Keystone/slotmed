package domain

type User struct {
	ID       UUID
	Name     string
	Lastname string
	Email    Email

	AuthId string
	AuditFields
}
