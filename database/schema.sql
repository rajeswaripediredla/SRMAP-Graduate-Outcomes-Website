create database graduate_outcomes;
use graduate_outcomes;

Create table Department(
    Dept_ID INT AUTO_INCREMENT PRIMARY KEY,
    Dept_Name varchar(150),
    Degree varchar(100),
    Dept_Code varchar(100) NOT NULL
);

Create table Users(
   user_id varchar(100) Primary Key,
   full_name VARCHAR(100) Not Null,
   email varchar(100) unique not null,
   password_has varchar(255) not null,
   reole ENUM('Student','Faculty','HOD','Admin') Not NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE table Students(
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id Varchar(100) NOT NULL,
    registration_no VARCHAR(30) UNIQUE NOT NULL,
    department_id INT NOT NULL,
    batch_year YEAR NOT NULL,
    cgpa DECIMAL(3,2),
    
    Foreign Key (user_id) REFERENCES users(user_id),
    FOREIGN KEY (department_id) REFERENCES department(Dept_ID)
);

create table faculty(
    faculty_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id varchar(100) NOT NULL,
    department_id INT NOT NULL,
    designation VARCHAR(50),
    
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (department_id) REFERENCES department(Dept_id)
);

CREATE TABLE graduate_outcomes (
    go_id INT AUTO_INCREMENT PRIMARY KEY,
    go_code VARCHAR(10) UNIQUE NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE achievements (
    achievement_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,

    achievement_type ENUM('Certification','Internship','Placement','Publication','HigherStudy') NOT NULL,

    title VARCHAR(255) NOT NULL,
    organization VARCHAR(255),
    description TEXT,
    proof_url VARCHAR(500),

    status ENUM('Pending','Verified','Rejected') DEFAULT 'Pending',

    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

CREATE TABLE verification_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,

    achievement_id INT NOT NULL,
    faculty_id INT NOT NULL,

    action ENUM('Approved','Rejected') NOT NULL,
    remarks TEXT,

    verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (achievement_id) REFERENCES achievements(achievement_id),

    FOREIGN KEY (faculty_id) REFERENCES faculty(faculty_id)
);

CREATE TABLE achievement_go_mapping (
    mapping_id INT AUTO_INCREMENT PRIMARY KEY,

    achievement_id INT NOT NULL,
    go_id INT NOT NULL,

    FOREIGN KEY (achievement_id)
    REFERENCES achievements(achievement_id),

    FOREIGN KEY (go_id)
    REFERENCES graduate_outcomes(go_id)
);

CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id Varchar(100) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES users(user_id)
);

CREATE TABLE placements (
    placement_id INT AUTO_INCREMENT PRIMARY KEY,

    achievement_id INT NOT NULL,

    company_name VARCHAR(255),

    package_lpa DECIMAL(5,2),

    offer_date DATE,

    FOREIGN KEY (achievement_id) REFERENCES achievements(achievement_id)
);
CREATE TABLE certifications (
    certification_id INT AUTO_INCREMENT PRIMARY KEY,

    achievement_id INT NOT NULL,

    issuer VARCHAR(255),

    issue_date DATE,

    certificate_id VARCHAR(100),

    FOREIGN KEY (achievement_id) REFERENCES achievements(achievement_id)
);
CREATE TABLE internships (
    internship_id INT AUTO_INCREMENT PRIMARY KEY,

    achievement_id INT NOT NULL,

    company_name VARCHAR(255),

    duration_months INT,

    start_date DATE,
    end_date DATE,

    FOREIGN KEY (achievement_id) REFERENCES achievements(achievement_id)
);

