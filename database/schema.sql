CREATE DATABASE criminal_management;
USE criminal_management;

CREATE TABLE criminals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  case_id VARCHAR(50) NOT NULL,
  criminal_no VARCHAR(50) NOT NULL,
  criminal_name VARCHAR(100) NOT NULL,
  nickname VARCHAR(50),
  father_name VARCHAR(100),
  crime_type VARCHAR(100) NOT NULL,
  arrest_date DATE NOT NULL,
  crime_date DATE NOT NULL,
  gender ENUM('Male', 'Female', 'Other') NOT NULL,
  address TEXT NOT NULL,
  age INT NOT NULL,
  most_wanted BOOLEAN DEFAULT FALSE,
  occupation VARCHAR(100),
  birth_mark VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY (case_id),
  UNIQUE KEY (criminal_no)
);

-- Insert sample data
INSERT INTO criminals (case_id, criminal_no, criminal_name, nickname, father_name, crime_type, arrest_date, crime_date, gender, address, age, most_wanted, occupation, birth_mark)
VALUES 
('101', 'CR-202', 'John Doe', 'Johnny', 'Michael Doe', 'Theft', '2025-01-15', '2025-01-10', 'Male', '123 Main St, Anytown', 32, TRUE, 'Unemployed', 'Scar on left cheek'),
('102', 'CR-203', 'Jane Smith', 'Janie', 'Robert Smith', 'Fraud', '2025-02-10', '2025-01-25', 'Female', '456 Oak Ave, Somewhere', 28, FALSE, 'Accountant', 'Birthmark on right arm');