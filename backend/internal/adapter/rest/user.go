package rest

import (
	"encoding/json"
	"net/http"

	"github.com/clinica-citas/backend/internal/usecase"
)

type UserHandler struct {
	uc usecase.UserUseCase
}

func NewUserHandler(uc usecase.UserUseCase) *UserHandler {
	return &UserHandler{uc: uc}
}

func (h *UserHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req usecase.CreateUserRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	user, err := h.uc.Create(r.Context(), req)
	if err != nil {
		respondError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	respondJSON(w, http.StatusCreated, user)
}

func (h *UserHandler) GetUserByAuthId(w http.ResponseWriter, r *http.Request) {
	authId := r.URL.Query().Get("auth_id")
	if authId == "" {
		respondError(w, http.StatusBadRequest, "auth_id query param is required")
		return
	}

	user, err := h.uc.GetByAuthId(r.Context(), usecase.GetUserByAuthIdRequest{AuthId: authId})
	if err != nil {
		respondError(w, http.StatusNotFound, "user not found")
		return
	}

	respondJSON(w, http.StatusOK, user)
}

func (h *UserHandler) GetUserProfile(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(UserIDKey).(string)
	if !ok || userID == "" {
		respondError(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	user, err := h.uc.GetProfile(r.Context(), usecase.GetUserProfileRequest{AuthId: userID})
	if err != nil {
		respondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondJSON(w, http.StatusOK, user)
}
