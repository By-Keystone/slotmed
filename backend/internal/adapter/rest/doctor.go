package rest

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/clinica-citas/backend/internal/usecase"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type DoctorHandler struct {
	uc usecase.DoctorUseCase
}

func NewDoctorHandler(uc usecase.DoctorUseCase) *DoctorHandler {
	return &DoctorHandler{uc: uc}
}

func (h *DoctorHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req usecase.CreateDoctorRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	_, err := h.uc.Create(r.Context(), req)
	if err != nil {
		if errors.Is(err, usecase.ErrClinicNotFound) {
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		respondError(w, http.StatusUnprocessableEntity, err.Error())
		return
	}

	respondJSON(w, http.StatusCreated, nil)
}

func (h *DoctorHandler) Update(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		respondError(w, http.StatusBadRequest, "invalid doctor id")
		return
	}

	var req usecase.UpdateDoctorRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	doctor, err := h.uc.Update(r.Context(), id, req)
	if err != nil {
		if errors.Is(err, usecase.ErrDoctorNotFound) {
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		respondError(w, http.StatusUnprocessableEntity, err.Error())
		return
	}

	respondJSON(w, http.StatusOK, doctor)
}

func (h *DoctorHandler) SetSchedules(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		respondError(w, http.StatusBadRequest, "invalid doctor id")
		return
	}

	var blocks []usecase.ScheduleBlockRequest
	if err := json.NewDecoder(r.Body).Decode(&blocks); err != nil {
		respondError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	schedules, err := h.uc.SetSchedules(r.Context(), id, blocks)
	if err != nil {
		if errors.Is(err, usecase.ErrDoctorNotFound) {
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		respondError(w, http.StatusUnprocessableEntity, err.Error())
		return
	}

	respondJSON(w, http.StatusOK, schedules)
}

func (h *DoctorHandler) GetSchedules(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		respondError(w, http.StatusBadRequest, "invalid doctor id")
		return
	}

	schedules, err := h.uc.GetSchedules(r.Context(), id)
	if err != nil {
		if errors.Is(err, usecase.ErrDoctorNotFound) {
			respondError(w, http.StatusNotFound, err.Error())
			return
		}
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondJSON(w, http.StatusOK, schedules)
}
