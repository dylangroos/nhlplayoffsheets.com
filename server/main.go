package main

import (
	"log"
	"net/http"
	"os"

	"github.com/dylangroos/nhlplayoffsheets.com/server/handlers"
	"github.com/dylangroos/nhlplayoffsheets.com/server/models"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func main() {
	// Initialize database
	db, err := gorm.Open(sqlite.Open("nhlplayoffsheets.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect database", err)
	}

	// Auto migrate the schema
	err = db.AutoMigrate(&models.User{})
	if err != nil {
		log.Fatal("failed to migrate database", err)
	}

	// JWT secret
	secret := []byte(os.Getenv("JWT_SECRET"))
	if len(secret) == 0 {
		secret = []byte("your-secret-key") // Default secret for development
	}

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(db, secret)
	userHandler := handlers.NewUserHandler(db, secret)

	// Initialize router
	r := chi.NewRouter()

	// Basic middleware
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	
	// CORS middleware
	corsMiddleware := cors.New(cors.Options{
		AllowedOrigins: []string{"https://nhlplayoffsheets.com", "http://localhost:5174", "http://localhost:3000"}, // Add production and development origins
		AllowedMethods: []string{
			"GET", "POST", "PUT", "DELETE", "OPTIONS",
		},
		AllowedHeaders: []string{
			"Accept",
			"Authorization",
			"Content-Type",
			"X-CSRF-Token",
			"X-Requested-With",
		},
		ExposedHeaders: []string{
			"Link",
		},
		AllowCredentials: true, // Allow credentials
		MaxAge: 300,
	})
	r.Use(corsMiddleware.Handler)

	// Routes
	r.Route("/api", func(r chi.Router) {
		r.Route("/auth", func(r chi.Router) {
			r.Post("/signup", authHandler.SignUp)
			r.Post("/signin", authHandler.SignIn)
		})
		
		// Users routes
		r.Get("/users", userHandler.GetUsers)
	})

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
