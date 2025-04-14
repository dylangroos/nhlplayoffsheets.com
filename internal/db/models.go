package db

import (
	"database/sql"
	"time"
)

type User struct {
	ID           int64
	Email        string
	PasswordHash string
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

type Player struct {
	ID        int64
	NHLID     int64
	Name      string
	Team      string
	Position  string
	CreatedAt time.Time
	UpdatedAt time.Time
}

type UserTeam struct {
	ID        int64
	UserID    int64
	Name      string
	CreatedAt time.Time
	UpdatedAt time.Time
	Players   []Player // Populated when needed
}

type PlayerStats struct {
	ID              int64
	PlayerID        int64
	GameDate        time.Time
	Goals           int
	Assists         int
	Points          int
	PlusMinus       int
	PenaltyMinutes  int
	ShotsOnGoal     int
	GameWinningGoals int
	OvertimeGoals   int
	Saves           int
	GoalsAgainst    int
	CreatedAt       time.Time
}

// User operations
func (db *DB) CreateUser(email, passwordHash string) (*User, error) {
	query := `
		INSERT INTO users (email, password_hash)
		VALUES (?, ?)
		RETURNING id, email, password_hash, created_at, updated_at`

	user := &User{}
	err := db.QueryRow(query, email, passwordHash).Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (db *DB) GetUserByEmail(email string) (*User, error) {
	query := `
		SELECT id, email, password_hash, created_at, updated_at
		FROM users
		WHERE email = ?`

	user := &User{}
	err := db.QueryRow(query, email).Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return user, nil
}

// Player operations
func (db *DB) UpsertPlayer(nhlID int64, name, team, position string) (*Player, error) {
	query := `
		INSERT INTO players (nhl_id, name, team, position)
		VALUES (?, ?, ?, ?)
		ON CONFLICT(nhl_id) DO UPDATE SET
			name = excluded.name,
			team = excluded.team,
			position = excluded.position
		RETURNING id, nhl_id, name, team, position, created_at, updated_at`

	player := &Player{}
	err := db.QueryRow(query, nhlID, name, team, position).Scan(
		&player.ID,
		&player.NHLID,
		&player.Name,
		&player.Team,
		&player.Position,
		&player.CreatedAt,
		&player.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return player, nil
}

// UserTeam operations
func (db *DB) CreateUserTeam(userID int64, name string) (*UserTeam, error) {
	query := `
		INSERT INTO user_teams (user_id, name)
		VALUES (?, ?)
		RETURNING id, user_id, name, created_at, updated_at`

	team := &UserTeam{}
	err := db.QueryRow(query, userID, name).Scan(
		&team.ID,
		&team.UserID,
		&team.Name,
		&team.CreatedAt,
		&team.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return team, nil
}

func (db *DB) AddPlayerToTeam(teamID, playerID int64) error {
	query := `
		INSERT INTO user_team_players (user_team_id, player_id)
		VALUES (?, ?)`

	_, err := db.Exec(query, teamID, playerID)
	return err
}

// PlayerStats operations
func (db *DB) UpsertPlayerStats(stats *PlayerStats) error {
	query := `
		INSERT INTO player_stats (
			player_id, game_date, goals, assists, points,
			plus_minus, penalty_minutes, shots_on_goal,
			game_winning_goals, overtime_goals, saves, goals_against
		)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		ON CONFLICT(player_id, game_date) DO UPDATE SET
			goals = excluded.goals,
			assists = excluded.assists,
			points = excluded.points,
			plus_minus = excluded.plus_minus,
			penalty_minutes = excluded.penalty_minutes,
			shots_on_goal = excluded.shots_on_goal,
			game_winning_goals = excluded.game_winning_goals,
			overtime_goals = excluded.overtime_goals,
			saves = excluded.saves,
			goals_against = excluded.goals_against`

	_, err := db.Exec(
		query,
		stats.PlayerID,
		stats.GameDate,
		stats.Goals,
		stats.Assists,
		stats.Points,
		stats.PlusMinus,
		stats.PenaltyMinutes,
		stats.ShotsOnGoal,
		stats.GameWinningGoals,
		stats.OvertimeGoals,
		stats.Saves,
		stats.GoalsAgainst,
	)
	return err
}

// GetPlayerStats retrieves stats for a player on a specific date
func (db *DB) GetPlayerStats(playerID int64, date time.Time) (*PlayerStats, error) {
	query := `
		SELECT id, player_id, game_date, goals, assists, points,
			plus_minus, penalty_minutes, shots_on_goal,
			game_winning_goals, overtime_goals, saves, goals_against,
			created_at
		FROM player_stats
		WHERE player_id = ? AND game_date = ?`

	stats := &PlayerStats{}
	err := db.QueryRow(query, playerID, date).Scan(
		&stats.ID,
		&stats.PlayerID,
		&stats.GameDate,
		&stats.Goals,
		&stats.Assists,
		&stats.Points,
		&stats.PlusMinus,
		&stats.PenaltyMinutes,
		&stats.ShotsOnGoal,
		&stats.GameWinningGoals,
		&stats.OvertimeGoals,
		&stats.Saves,
		&stats.GoalsAgainst,
		&stats.CreatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return stats, nil
} 