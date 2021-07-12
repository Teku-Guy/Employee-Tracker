INSERT INTO department (name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal'),
    ('Management');

INSERT INTO role (title, salary, department_id)
VALUES
    ('Sales Lead', 100000, 1),
    ('Salesperson', 80000, 1),
    ('Lead Engineer', 150000, 2),
    ('Software Engineer', 120000, 2),
    ('Manager', 160000, 5),
    ('Supervisor', 160000, 5),
    ('Accountant', 125000, 3),
    ('Legal Team Lead', 250000, 4),
    ('Lawyer', 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ("Gustavo", "Muratalla", 1, NULL),
    ("Finn", "Huckleberry", 2, 1),
    ("Moby", "Dick", 3, NULL),
    ("Sam", "Flam", 4, 3),
    ('John', 'Doe', 2, 1),
    ('Mike', 'Chan', 2, 1),
    ('Ashley', 'Rodriguez', 6, 9),
    ('Kevin', 'Tupik', 7, NULL),
    ('Kunal', 'Singh', 5, NULL),
    ('Malia', 'Brown', 8, NULL),
    ('Sarah', 'Lourd', 9, 10),
    ('Tom', 'Allen', 6, 9);
