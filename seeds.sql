INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Gustavo", "Muratalla", 0),
       ("Finn", "Huckleberry", 1),
       ("Moby", "Dick", 2),
       ("Sam", "Flam", 3);

INSERT INTO role (title, salary, department_id)
VALUES ("CEO", 999999, 0),
       ("Lawyer", 115000, 0),
       ("Sales Person", 120000, 0);

INSERT INTO department (name)
VALUES ("CEO"),
       ("Sales"),
       ("Legal"),
       ("Engineering"),
       ("Finance");