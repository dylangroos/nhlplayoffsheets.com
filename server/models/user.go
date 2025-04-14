package models

import (
	"time"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	ID        uint      `json:"id" gorm:"primaryKey"`
	Name      string    `json:"name"`
	Email     string    `json:"email" gorm:"unique"`
	Password  string    `json:"-"` // "-" means this field won't be included in JSON
	IsAdmin   bool      `json:"isAdmin" gorm:"-"` // "-" means this field won't be stored in the database
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
} 