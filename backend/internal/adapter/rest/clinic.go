package rest

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/clinica-citas/backend/internal/usecase"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type ClinicHandler struct {
	uc usecase.ClinicUseCase
}

func NewClinicHandler(uc usecase.ClinicUseCase) *ClinicHandler {
	return &ClinicHandler{uc: uc}
}

type createClinicResponse struct {
	ID      string `json:"id"`
	Name    string `json:"name"`
	Address string `json:"address"`
	Phone   string `json:"phone"`
	Email   string `json:"email"`
	Active  bool   `json:"active"`
}

func (h *ClinicHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req usecase.CreateClinicRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	clinic, err := h.uc.Create(r.Context(), req)
	if err != nil {
		respondError(w, http.StatusUnprocessableEntity, err.Error())
		return
	}

	respondJSON(w, http.StatusCreated, createClinicResponse{
		ID:      clinic.ID.String(),
		Name:    clinic.Name,
		Address: clinic.Address,
		Phone:   clinic.Phone,
		Email:   string(clinic.Email),
		Active:  clinic.Active,
	})
}

func (h *ClinicHandler) Update(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		respondError(w, http.StatusBadRequest, "invalid clinic id")
		return
	}

	var req usecase.UpdateClinicRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	clinic, err := h.uc.Update(r.Context(), id, req)
	if err != nil {
		if errors.Is(err, usecase.ErrClinicNotFound) {
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		respondError(w, http.StatusUnprocessableEntity, err.Error())
		return
	}

	respondJSON(w, http.StatusOK, clinic)
}

func (h *ClinicHandler) GetClinicsByUserId(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	clinics, err := h.uc.GetClinicsByUserId(r.Context(), id)
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondJSON(w, http.StatusOK, clinics)
}

func (h *ClinicHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	clinics, err := h.uc.GetAll(r.Context())

	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}
	respondJSON(w, http.StatusOK, clinics)
}
