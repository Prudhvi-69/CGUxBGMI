-- Run this script in MySQL to set up the CGUxBGMI database
-- mysql -u root -p < setup_db.sql

CREATE DATABASE IF NOT EXISTS cgubgmi;
USE cgubgmi;

CREATE TABLE IF NOT EXISTS players (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  bgmi_id VARCHAR(50) NOT NULL,
  ign VARCHAR(50) NOT NULL,
  mobile VARCHAR(15) NOT NULL,
  match_type ENUM('solo','squad') DEFAULT 'solo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tournaments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  date DATE,
  time VARCHAR(20),
  max_players INT DEFAULT 100,
  registered_count INT DEFAULT 0,
  prize_pool VARCHAR(50),
  status ENUM('upcoming','live','completed') DEFAULT 'upcoming',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample tournaments (add more as needed)
INSERT INTO tournaments (name, description, date, time, max_players, prize_pool, status) VALUES
('CGU BGMI Season 1 - Solo Showdown', 'The first official CGU BGMI solo tournament. Top 3 players win prizes!', '2025-08-15', '6:00 PM', 100, '5000', 'upcoming'),
('CGU BGMI Squad Wars', 'Form your squad of 4 and battle for glory. Best squad wins!', '2025-08-22', '7:00 PM', 80, '10000', 'upcoming'),
('CGU Fresher Cup 2025', 'Exclusive tournament for first-year CGU students only.', '2025-09-01', '5:00 PM', 60, '3000', 'upcoming');

SELECT 'Database setup complete!' AS status;
