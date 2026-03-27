.PHONY: up down migrate-up migrate-down migrate-create

up:
	make down
	docker compose up -d --build

down:
	docker compose down --remove-orphans

migrate-up:
	go run ./cmd/migrate up

migrate-down:
	go run ./cmd/migrate down

migrate-create:
	@read -p "Nombre de la migración: " name; \
	n=$$(ls infrastructure/migrations/*.up.sql 2>/dev/null | wc -l | tr -d ' '); \
	seq=$$(printf "%03d" $$((n + 1))); \
	touch infrastructure/migrations/$${seq}_$${name}.up.sql; \
	touch infrastructure/migrations/$${seq}_$${name}.down.sql; \
	echo "Creado: $${seq}_$${name}"
