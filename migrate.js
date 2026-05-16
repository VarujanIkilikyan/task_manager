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

    console.log('Migration finished successfully.');
})();

