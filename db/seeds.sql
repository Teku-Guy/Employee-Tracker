INSERT INTO department (name)
VALUES ("CEO"),
       ("Sales"),
       ("Legal"),
       ("Engineering"),
       ("Finance");

INSERT INTO role (title, salary, department_id)
VALUES ("CEO", 999999, 1),
       ("Lawyer", 115000, 3),
       ("Sales Person", 120000, 2);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Gustavo", "Muratalla", 1),
       ("Finn", "Huckleberry", 2),
       ("Moby", "Dick", 3),
       ("Sam", "Flam", 3);
