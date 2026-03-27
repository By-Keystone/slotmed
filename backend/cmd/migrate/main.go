package main

import (
	"log"
	"os"

	"github.com/clinica-citas/backend/internal/config"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	direction := "up"
	if len(os.Args) > 1 {
		direction = os.Args[1]
	}

	cfg := config.Load()

	m, err := migrate.New(
		"file://infrastructure/migrations",
		cfg.DatabaseURL,
	)
	if err != nil {
		log.Fatalf("failed to create migrator: %v", err)
	}
	defer m.Close()

	switch direction {
	case "up":
		if err := m.Up(); err != nil && err != migrate.ErrNoChange {
			log.Fatalf("migrate up failed: %v", err)
		}
		log.Println("migrations applied successfully")
	case "down":
		if err := m.Steps(-1); err != nil && err != migrate.ErrNoChange {
			log.Fatalf("migrate down failed: %v", err)
		}
		log.Println("last migration rolled back")
	default:
		log.Fatalf("unknown direction %q — use 'up' or 'down'", direction)
	}
}
