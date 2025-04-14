package handlers

import (
	"encoding/json"
	"net/http"
	"os"
	"strings"

	"github.com/dylangroos/nhlplayoffsheets.com/server/models"
	"gorm.io/gorm"
	"github.com/golang-jwt/jwt"
)

type UserHandler struct {
	db     *gorm.DB
	secret []byte
}

func NewUserHandler(db *gorm.DB, secret []byte) *UserHandler {
	return &UserHandler{
		db:     db,
		secret: secret,
	}
}

func (h *UserHandler) GetUsers(w http.ResponseWriter, r *http.Request) {
	// Get token from Authorization header
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		http.Error(w, "Authorization header required", http.StatusUnauthorized)
		return
	}

	// Extract token from "Bearer <token>"
	tokenParts := strings.Split(authHeader, " ")
	if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
		http.Error(w, "Invalid authorization header format", http.StatusUnauthorized)
		return
	}

	// Parse and verify the token
	token, err := jwt.Parse(tokenParts[1], func(token *jwt.Token) (interface{}, error) {
		return h.secret, nil
	})

	if err != nil || !token.Valid {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	// Get claims from token
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		http.Error(w, "Invalid token claims", http.StatusUnauthorized)
		return
	}

	// Get admin email from environment variable
	adminEmail := os.Getenv("ADMIN_EMAIL")
	if adminEmail == "" {
		adminEmail = "hawkins.groos@gmail.com" // Default for development
	}

	// Check if user is admin
	email, ok := claims["email"].(string)
	if !ok || email != adminEmail {
		http.Error(w, "Unauthorized", http.StatusForbidden)
		return
	}

	// Get all users from database
	var users []models.User
	if err := h.db.Find(&users).Error; err != nil {
		http.Error(w, "Failed to fetch users", http.StatusInternalServerError)
		return
	}

	// Set admin status for the admin user
	for i := range users {
		users[i].IsAdmin = users[i].Email == adminEmail
	}

	// Return users as JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
} 