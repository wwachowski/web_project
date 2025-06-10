create database tournaments;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    activation_token VARCHAR(255),
    activation_expires_at TIMESTAMP,
    password_reset_token VARCHAR(255),
    password_reset_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tournaments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    discipline VARCHAR(100) NOT NULL,
    organizer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    location TEXT NOT NULL,
    max_participants INTEGER NOT NULL CHECK (max_participants > 0),
    application_deadline TIMESTAMP NOT NULL CHECK (application_deadline < start_time),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sponsor_logos (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    url TEXT NOT NULL
);

CREATE TABLE tournament_participants (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    license_number VARCHAR(50) NOT NULL UNIQUE,
    ranking INTEGER NOT NULL,
    UNIQUE (tournament_id, user_id),
    UNIQUE (tournament_id, ranking)
);

CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    player1_id INTEGER NOT NULL REFERENCES users(id),
    player2_id INTEGER NOT NULL REFERENCES users(id),
    player1_winner_pick_id INTEGER REFERENCES users(id),
    player2_winner_pick_id INTEGER REFERENCES users(id),
    winner_id INTEGER REFERENCES users(id), -- można uzupełnić, gdy obaj podadzą to samo
    round INTEGER NOT NULL
);
