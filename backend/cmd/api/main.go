package main

import (
	"log"
	"net/http"

	repo "github.com/clinica-citas/backend/internal/adapter/postgres"
	"github.com/clinica-citas/backend/internal/adapter/rest"
	"github.com/clinica-citas/backend/internal/config"
	"github.com/clinica-citas/backend/internal/usecase"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	cfg := config.Load()

	db, err := gorm.Open(postgres.Open(cfg.DatabaseURL), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	// Repositories (adapter/postgres → port interfaces)
	clinicRepo := repo.NewClinicRepository(db)
	doctorRepo := repo.NewDoctorRepository(db)
	userRepo := repo.NewUserRepository(db)

	// Use cases (usecase → port interfaces)
	clinicUC := usecase.NewClinicUseCase(clinicRepo)
	doctorUC := usecase.NewDoctorUseCase(doctorRepo, clinicRepo)
	userUC := usecase.NewUserUseCase(userRepo)

	// HTTP handlers (adapter/rest → usecase interfaces)
	clinicHandler := rest.NewClinicHandler(clinicUC)
	doctorHandler := rest.NewDoctorHandler(doctorUC)
	userHandler := rest.NewUserHandler(userUC)

	router := rest.NewRouter(cfg, clinicHandler, doctorHandler, userHandler)

	log.Printf("server listening on :%s", cfg.Port)
	if err := http.ListenAndServe(":"+cfg.Port, router); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
