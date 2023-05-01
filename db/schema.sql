CREATE DATABASE dashboard;

CREATE TABLE business (
    id SERIAL PRIMARY KEY, 
    name VARCHAR(255) NOT NULL,
    owner_email VARCHAR(255) NOT NULL,
    password_digest TEXT NOT NULL
);

CREATE TABLE dependents (
    id SERIAL PRIMARY KEY, 
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    position TEXT,
    id_business INT REFERENCES business (id),
    hours_available numeric(10,2),
    password_digest TEXT NOT NULL
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY, 
    task_name VARCHAR(255) NOT NULL,
    to_do VARCHAR(255) NOT NULL,
    done BOOLEAN DEFAULT false,
    id_manager INT REFERENCES dependents (id),
    id_employee INT REFERENCES dependents (id),
    id_business INT REFERENCES business (id),
    name_employee TEXT
);

-- INSERT INTO business (name, owner, password_digest) VALUES ('Brooklyn', 'Valentina Gottardello', 'pudding');

