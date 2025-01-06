INSERT INTO department (name) 
VALUES  ('HR'),
        ('SERVICE'),
        ('PARTS');

INSERT INTO role (title, salary, department_id) 
VALUES  ('Coordinator', 85000, 1),
        ('Payroll', 35000, 1),
        ('Recruiter', 40000, 1),
        ('Service Manager', 200000, 2),
        ('Shop Foreman', 120000, 2),
        ('Service Advisor', 100000, 2),
        ('Parts Manager', 210000, 3),
        ('Parts Counter Person', 75000, 3),
        ('Parts Specialist', 70000, 3);
        

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES  ('Bob', 'Mack', 1, NULL),
        ('Jordan', 'Jones', 2, 1),
        ('Stacey', 'Johnson', 3, 1),
        ('Justin', 'Robinson', 4, Null),
        ('Tony', 'Robles', 5, 4),
        ('Josh', 'Wilson', 6, 4),
        ('Megan', 'Flores', 9, NULL),
        ('Steve', 'Hues', 10, 7),
        ('Daniel', 'Gonzales', 11, 7);
