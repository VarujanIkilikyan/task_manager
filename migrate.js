import DbMysql from './05_clients/db.mysql.js';

;(async () => {
    console.log('Running migration...');
    await DbMysql.query(`
      create table if not exists users
      (
          userId CHAR(36) PRIMARY KEY DEFAULT (UUID()),
          username VARCHAR(50) UNIQUE NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
  `);
    console.log('-> User table successfully created');
    await DbMysql.query(`
    CREATE TABLE if not exists tasks (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  taskDate DATE NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
);
`);
    console.log('-> Tasks table successfully created');
    await DbMysql.query(`CREATE INDEX idx_taskDate ON tasks(taskDate);`);
    await DbMysql.query(`CREATE INDEX idx_userId ON tasks(userId);`);
    console.log('Migration finished successfully.');
})();

