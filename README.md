# innovation-lab
e - commerce web applicaton

run in terminal 
yarn dotenv prisma migrate dev --name init

USE quickcart_db;

in MYSQL Workbench
INSERT INTO User (id, email, password, firstName, lastName, role, createdAt, updatedAt)
VALUES (
  'clz_admin_001',
  'admin@quickcart.com',
  '$2a$10$E.q1.l.F.N/f8.g.s/0Q0.x/Wq/yJ/t/6.u.u.p/e.v/H.o.b.q.y.z',
  'Admin',
  'User',
  'ADMIN',
  NOW(),
  NOW()
);
