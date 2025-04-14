-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NHL Players table
CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nhl_id INTEGER UNIQUE NOT NULL,  -- ID from NHL API
    name TEXT NOT NULL,
    team TEXT NOT NULL,              -- NHL team abbreviation
    position TEXT NOT NULL,          -- F, D, G
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Teams table (represents a user's playoff pool team)
CREATE TABLE IF NOT EXISTS user_teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User Team Players (links players to user teams)
CREATE TABLE IF NOT EXISTS user_team_players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_team_id INTEGER NOT NULL,
    player_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_team_id) REFERENCES user_teams(id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
    UNIQUE(user_team_id, player_id)
);

-- Player Stats table (nightly stats)
CREATE TABLE IF NOT EXISTS player_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER NOT NULL,
    game_date DATE NOT NULL,
    goals INTEGER DEFAULT 0,
    assists INTEGER DEFAULT 0,
    points INTEGER DEFAULT 0,
    plus_minus INTEGER DEFAULT 0,
    penalty_minutes INTEGER DEFAULT 0,
    shots_on_goal INTEGER DEFAULT 0,
    game_winning_goals INTEGER DEFAULT 0,
    overtime_goals INTEGER DEFAULT 0,
    saves INTEGER DEFAULT 0,           -- For goalies
    goals_against INTEGER DEFAULT 0,   -- For goalies
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
    UNIQUE(player_id, game_date)
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_players_nhl_id ON players(nhl_id);
CREATE INDEX idx_players_position ON players(position);
CREATE INDEX idx_player_stats_date ON player_stats(game_date);
CREATE INDEX idx_user_team_players_team ON user_team_players(user_team_id);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_users_timestamp 
    AFTER UPDATE ON users
BEGIN
    UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_players_timestamp
    AFTER UPDATE ON players
BEGIN
    UPDATE players SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER update_user_teams_timestamp
    AFTER UPDATE ON user_teams
BEGIN
    UPDATE user_teams SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END; 