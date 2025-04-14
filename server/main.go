package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/dylangroos/nhlplayoffsheets.com/server/handlers"
	"github.com/dylangroos/nhlplayoffsheets.com/server/models"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// SpaHandler implements the http.Handler interface for serving a Single Page Application
type SpaHandler struct {
	staticPath string
	indexPath  string
}

// ServeHTTP handles all requests - API requests go to the API routes, all other requests serve the SPA
func (h SpaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// Get the absolute path to prevent directory traversal
	path := filepath.Join(h.staticPath, r.URL.Path)

	// Check if the path is a known static file
	_, err := os.Stat(path)
	if err == nil {
		// If it exists and is a static asset, serve it directly
		if strings.HasPrefix(r.URL.Path, "/assets/") || 
		   strings.HasSuffix(r.URL.Path, ".ico") || 
		   strings.HasSuffix(r.URL.Path, ".png") || 
		   strings.HasSuffix(r.URL.Path, ".webmanifest") {
			http.FileServer(http.Dir(h.staticPath)).ServeHTTP(w, r)
			return
		}
	}

	// For all other paths, serve the index.html file
	indexFile := filepath.Join(h.staticPath, h.indexPath)
	http.ServeFile(w, r, indexFile)
}

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
		AllowedOrigins: []string{
			"https://nhlplayoffsheets.com",
			"https://api.nhlplayoffsheets.com",
			"http://localhost:5174",
			"http://localhost:3000",
			"http://localhost:3001",
		},
		AllowedMethods: []string{
			"GET", "POST", "PUT", "DELETE", "OPTIONS",
		},
		AllowedHeaders: []string{
			"Accept",
			"Authorization",
			"Content-Type",
			"X-CSRF-Token",
			"X-Requested-With",
			"Origin",
		},
		ExposedHeaders: []string{
			"Link",
			"Content-Length",
			"Access-Control-Allow-Origin",
			"Access-Control-Allow-Credentials",
		},
		AllowCredentials: true,
		MaxAge: 300,
		Debug: true, // Enable debug mode to log CORS issues
	})
	r.Use(corsMiddleware.Handler)

	// API Routes
	r.Route("/api", func(r chi.Router) {
		r.Route("/auth", func(r chi.Router) {
			r.Post("/signup", authHandler.SignUp)
			r.Post("/signin", authHandler.SignIn)
		})
		
		// Users routes
		r.Get("/users", userHandler.GetUsers)
	})

	// Serve static files and handle SPA routing
	spa := SpaHandler{staticPath: "../client/dist", indexPath: "index.html"}
	r.Handle("/*", spa)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
