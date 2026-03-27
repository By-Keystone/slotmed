package rest

import (
	"net/http"

	"github.com/clinica-citas/backend/internal/config"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func NewRouter(
	cfg config.Config,
	clinicHandler *ClinicHandler,
	doctorHandler *DoctorHandler,
	userHandler *UserHandler,
) http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.RequestID)
	r.Use(corsMiddleware)

	r.Route("/api/v1", func(r chi.Router) {
		// Rutas protegidas — requieren JWT de Supabase
		r.Group(func(r chi.Router) {
			// r.Use(AuthMiddleware(cfg.SupabaseJwtKey, cfg.AppEnv))

			r.Route("/clinics", func(r chi.Router) {
				r.Post("/", clinicHandler.Create)
				r.Put("/{id}", clinicHandler.Update)
				r.Get("/", clinicHandler.GetAll)
				r.Get("/user/{id}", clinicHandler.GetClinicsByUserId)
				r.Post("/{clinicId}/doctors", doctorHandler.Create)
			})

			r.Route("/doctors", func(r chi.Router) {
				r.Put("/{id}", doctorHandler.Update)
				r.Post("/", doctorHandler.Create)
				r.Get("/{id}/schedules", doctorHandler.GetSchedules)
				r.Put("/{id}/schedules", doctorHandler.SetSchedules)
			})

			r.Route("/user", func(r chi.Router) {
				r.Post("/", userHandler.Create)
				r.Get("/", userHandler.GetUserByAuthId)
			})
		})
	})

	return r
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Authorization, Content-Type")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}
