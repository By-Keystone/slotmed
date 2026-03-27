# Clinica Citas - Sistema de Manejo de Citas Medicas

Aplicacion web para la gestion de citas medicas en clinicas.

## Modulos principales

- **Pacientes** — Registro, historial y perfil
- **Medicos** — Especialidades, disponibilidad y horarios
- **Citas** — Agendado, cancelacion y seguimiento
- **Autenticacion** — Roles: admin, medico, paciente

## Estructura del proyecto

```
clinica-citas/
├── frontend/          # Interfaz de usuario
├── backend/           # API REST
├── database/          # Migraciones y seeds
├── docker/            # Configuracion Docker
└── docs/              # Documentacion
```

## Inicio rapido

```bash
# Instalar dependencias
cd frontend && npm install
cd ../backend && npm install

# Levantar servicios
docker-compose up
```
