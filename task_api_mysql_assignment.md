# Task API Assignment - Node.js + Express + MySQL2

## Overview
Create a RESTful API for managing a to-do list using Node.js, Express, and MySQL2 for database operations.

## Database Setup

### Database Schema
```sql
CREATE DATABASE task_manager;

USE task_manager;

CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  taskDate DATE NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_taskDate ON tasks(taskDate);
CREATE INDEX idx_userId ON tasks(userId);
```

## API Requirements

### Authentication Endpoints

#### 1. User Registration
- **Method:** POST
- **URL:** `/auth/register`
- **Request Body (JSON):**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```
- **Response (JSON):**
```json
{
  "message": "User registered successfully",
  "userId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
}
```

#### 2. User Login
- **Method:** POST
- **URL:** `/auth/login`
- **Request Body (JSON):**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```
- **Response (JSON):**
```json
{
  "message": "Login successful",
  "token": "encrypted_aes_token_here",
  "user": {
    "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### Task Endpoints (Protected - Requires Authentication)

#### 1. Create New Task
#### 1. Create New Task
- **Method:** POST
- **URL:** `/tasks`
- **Headers:** `Authorization: Bearer {encrypted_token}`
- **Request Body (JSON):**
```json
{
  "title": "Task Title",
  "description": "Task Description",
  "taskDate": "2024-07-18"
}
```
- **Response (JSON):**
```json
{
  "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "userId": "user-uuid-here",
  "title": "Task Title",
  "description": "Task Description",
  "completed": false,
  "taskDate": "2024-07-18"
}
```

#### 2. Get All Tasks
- **Method:** GET
- **URL:** `/tasks?page=1`
- **Headers:** `Authorization: Bearer {encrypted_token}`
- **Query Parameters:**
  - `page` (optional, default: 1) - Page number for pagination
- **Response (JSON):**
```json
{
  "tasks": [
    {
      "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      "userId": "user-uuid-here",
      "title": "Task Title",
      "description": "Task Description",
      "completed": false,
      "taskDate": "2024-07-18"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalTasks": 44,
    "tasksPerPage": 10
  }
}
```

#### 3. Get Task by ID
- **Method:** GET
- **URL:** `/tasks/:id`
- **Headers:** `Authorization: Bearer {encrypted_token}`
- **Response (JSON):**
```json
{
  "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "userId": "user-uuid-here",
  "title": "Task Title",
  "description": "Task Description",
  "completed": false,
  "taskDate": "2024-07-18"
}
```

#### 4. Update Task
- **Method:** PUT
- **URL:** `/tasks/:id`
- **Headers:** `Authorization: Bearer {encrypted_token}`
- **Request Body (JSON):**
```json
{
  "title": "Updated Task Title",
  "description": "Updated Task Description",
  "completed": true,
  "taskDate": "2024-07-20"
}
```
- **Response (JSON):**
```json
{
  "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "userId": "user-uuid-here",
  "title": "Updated Task Title",
  "description": "Updated Task Description",
  "completed": true,
  "taskDate": "2024-07-20"
}
```

#### 5. Delete Task
- **Method:** DELETE
- **URL:** `/tasks/:id`
- **Headers:** `Authorization: Bearer {encrypted_token}`
- **Response (JSON):**
```json
{
  "message": "Թասկը հեռացված է"
}
```

## Additional Requirements

### Authentication & Security
1. **User Registration**
   - Username must be unique (3-50 characters)
   - Email must be unique and valid format
   - Password must be hashed using bcrypt before storing
   - Minimum password length: 8 characters

2. **Token Generation (AES Encryption)**
   - Use `crypto` module for AES-256-CBC encryption
   - Token payload should contain: `{ userId, email, timestamp }`
   - Token must be encrypted using AES secret key from environment variables
   - Token expiry: 24 hours (check timestamp on verification)

3. **Protected Routes**
   - All task endpoints require valid authentication token
   - Token must be sent in Authorization header: `Bearer {token}`
   - Middleware must decrypt and verify token before allowing access
   - Users can only access/modify their own tasks

### Business Logic
1. **Cannot create tasks with past dates** - Validation must check if `taskDate` is in the past
2. **Maximum 3 tasks per day per user** - Before creating a task, check if user already has 3 tasks for that date
3. **Tasks sorted by taskDate** - All task lists must be returned sorted by `taskDate` in ascending order
4. **Pagination** - Tasks list must support pagination with 10 tasks per page
5. **User isolation** - Users can only view, update, and delete their own tasks

### Validation (validate.js)
Create validation functions using RegExp for:
- **Username validation:** Required, 3-50 characters, alphanumeric with underscores
- **Email validation:** Required, valid email format
- **Password validation:** Required, minimum 8 characters, must contain letters and numbers
- **Title validation:** Required, 3-255 characters, alphanumeric with spaces allowed
- **Description validation:** Optional, max 1000 characters
- **Date validation:** Required, must be in YYYY-MM-DD format and not in the past
- **UUID validation:** Valid UUID v4 format
- **Completed validation:** Boolean value

### MySQL2 Integration
- Use `mysql2/promise` for async/await support
- Implement connection pooling for better performance
- Use prepared statements to prevent SQL injection
- Implement proper error handling for database operations

## Project Structure

```
project-root/
│
├── app.js                    # Main application file
├── .env                      # Environment variables
├── package.json              # Dependencies
│
├── clients/
│   └── db.mysql.js          # MySQL connection pool configuration
│
├── models/
│   ├── userModel.js         # Database query functions for users
│   └── taskModel.js         # Database query functions for tasks
│
├── controllers/
│   ├── authController.js    # Authentication logic (register, login)
│   └── taskController.js    # Business logic for tasks
│
├── routes/
│   ├── authRoutes.js        # Auth endpoint definitions
│   └── taskRoutes.js        # Task route definitions
│
├── utils/
│   ├── validate.js          # Validation functions
│   ├── tokenUtils.js        # AES token encryption/decryption
│   └── passwordUtils.js     # Password hashing utilities
│
└── middlewares/
    ├── authMiddleware.js    # Token verification middleware
    └── errorHandler.js      # Error handling middleware
```

## Environment Variables (.env)

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=task_manager
DB_CONNECTION_LIMIT=10

# AES Encryption Secret (32 characters for AES-256)
AES_SECRET_KEY=your-32-character-secret-key-here
AES_IV=your-16-char-iv

# Token expiry in hours
TOKEN_EXPIRY_HOURS=24
```

## Dependencies (package.json)

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.5",
    "uuid": "^9.0.1",
    "dotenv": "^16.3.1",
    "bcrypt": "^5.1.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

## Implementation Guidelines

### Database Connection (clients/db.mysql.js)
- Create MySQL connection pool using `mysql2/promise`
- Export pool instance for use in models
- Implement connection error handling
- Test database connection on startup

### Model Layer (models/userModel.js)
Create database query functions for user operations:

**Required Functions:**
- `createUser(userData)` - Insert new user into database
  - Parameters: `{ id, username, email, hashedPassword }`
  - Returns: Created user object (without password)
  
- `findUserByEmail(email)` - Find user by email for login
  - Parameters: `email` (string)
  - Returns: User object with password hash or null
  
- `findUserById(id)` - Find user by UUID
  - Parameters: `id` (UUID string)
  - Returns: User object (without password) or null
  
- `checkUsernameExists(username)` - Check if username is taken
  - Parameters: `username` (string)
  - Returns: Boolean
  
- `checkEmailExists(email)` - Check if email is taken
  - Parameters: `email` (string)
  - Returns: Boolean

### Model Layer (models/taskModel.js)
Create database query functions that interact with MySQL. All functions should use prepared statements and return promises:

**Required Functions:**
- `createTask(taskData)` - Insert new task into database
  - Parameters: `{ id, userId, title, description, taskDate, completed }`
  - Returns: Created task object
  
- `getAllTasksByUser(userId, limit, offset)` - Fetch paginated tasks for specific user sorted by taskDate
  - Parameters: `userId` (UUID), `limit` (number), `offset` (number)
  - Returns: Array of tasks
  
- `getTotalTasksCountByUser(userId)` - Get total count of user's tasks for pagination
  - Parameters: `userId` (UUID)
  - Returns: Total count number
  
- `getTaskById(id, userId)` - Fetch single task by UUID for specific user
  - Parameters: `id` (UUID string), `userId` (UUID string)
  - Returns: Task object or null
  
- `getTaskCountByDateAndUser(taskDate, userId)` - Count user's tasks for specific date
  - Parameters: `taskDate` (YYYY-MM-DD), `userId` (UUID)
  - Returns: Count number
  
- `updateTask(id, userId, taskData)` - Update existing task for specific user
  - Parameters: `id` (UUID), `userId` (UUID), `taskData` (object with fields to update)
  - Returns: Updated task object
  
- `deleteTask(id, userId)` - Delete task from database for specific user
  - Parameters: `id` (UUID), `userId` (UUID)
  - Returns: Boolean (success/failure)

**Example Query Structure:**
```javascript
// Use prepared statements with placeholders
const [rows] = await pool.execute(
  'SELECT * FROM tasks WHERE id = ?',
  [id]
);
```

### Validation Functions (utils/validate.js)
All validation functions must use RegExp and return `{ valid: boolean, error?: string }`

Example validations:
- `validateUsername(username)` - RegExp: `/^[a-zA-Z0-9_]{3,50}$/`
- `validateEmail(email)` - RegExp: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- `validatePassword(password)` - RegExp: `/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/`
- `validateTitle(title)` - RegExp: `/^[a-zA-Z0-9\s]{3,255}$/`
- `validateDate(date)` - RegExp: `/^\d{4}-\d{2}-\d{2}$/` + date logic
- `validateUUID(id)` - RegExp: `/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i`

### Token Utilities (utils/tokenUtils.js)
Implement AES-256-CBC encryption/decryption functions:

**Required Functions:**
- `generateToken(payload)` - Encrypt user data into token
  - Parameters: `{ userId, email, timestamp }`
  - Returns: Encrypted token string
  - Use `crypto.createCipheriv()` with AES-256-CBC
  
- `verifyToken(token)` - Decrypt and verify token
  - Parameters: `token` (encrypted string)
  - Returns: Decrypted payload or null if invalid/expired
  - Use `crypto.createDecipheriv()` with AES-256-CBC
  - Check if timestamp is within TOKEN_EXPIRY_HOURS

**Example Structure:**
```javascript
const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const secretKey = Buffer.from(process.env.AES_SECRET_KEY, 'utf-8'); // Must be 32 bytes
const iv = Buffer.from(process.env.AES_IV, 'utf-8'); // Must be 16 bytes

function generateToken(payload) {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  // Add timestamp to payload
  const data = JSON.stringify({ ...payload, timestamp: Date.now() });
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}
```

### Password Utilities (utils/passwordUtils.js)
Implement bcrypt password hashing:

**Required Functions:**
- `hashPassword(password)` - Hash password with bcrypt
  - Parameters: `password` (string)
  - Returns: Hashed password string
  - Use bcrypt with salt rounds: 10
  
- `comparePassword(password, hashedPassword)` - Compare password with hash
  - Parameters: `password` (string), `hashedPassword` (string)
  - Returns: Boolean (match/no match)

### Middleware (middlewares/authMiddleware.js)
Implement authentication middleware for protected routes:

**Required Function:**
- `authenticateToken(req, res, next)` - Verify JWT token from Authorization header
  - Extract token from `Authorization: Bearer {token}` header
  - Use `tokenUtils.verifyToken()` to decrypt and verify
  - Attach user data to `req.user` if valid
  - Return 401 if token is missing, invalid, or expired
  - Call `next()` if authentication succeeds

**Example Structure:**
```javascript
const { verifyToken } = require('../utils/tokenUtils');

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  
  req.user = decoded; // Attach user info to request
  next();
}
```

### Controller Functions (controllers/authController.js)
Implement authentication controller functions:

- `register(req, res)` - 
  - Validate username, email, password using `validate.js`
  - Check if username/email already exists using `userModel`
  - Hash password using `passwordUtils.hashPassword()`
  - Generate UUID for user ID
  - Use `userModel.createUser()` to insert into DB
  - Return 201 status with success message
  
- `login(req, res)` - 
  - Validate email and password format
  - Use `userModel.findUserByEmail()` to get user
  - Compare password using `passwordUtils.comparePassword()`
  - Generate token using `tokenUtils.generateToken()`
  - Return token and user info (without password)

### Controller Functions (controllers/taskController.js)
Implement controller functions that use the model layer for database operations:

- `createTask(req, res)` - 
  - Extract `userId` from `req.user` (set by auth middleware)
  - Validate input using `validate.js`
  - Check if date is not in the past
  - Use `taskModel.getTaskCountByDateAndUser()` to check max 3 tasks per day
  - Use `taskModel.createTask()` to insert into DB
  - Return 201 status with created task
  
- `getAllTasks(req, res)` - 
  - Extract `userId` from `req.user`
  - Extract page number from query params (default: 1)
  - Calculate limit and offset (10 tasks per page)
  - Use `taskModel.getAllTasksByUser(userId, limit, offset)` to fetch tasks
  - Use `taskModel.getTotalTasksCountByUser(userId)` for pagination metadata
  - Return tasks sorted by taskDate with pagination info
  
- `getTaskById(req, res)` - 
  - Extract `userId` from `req.user`
  - Validate UUID format
  - Use `taskModel.getTaskById(id, userId)` to fetch task
  - Return 404 if not found or doesn't belong to user
  
- `updateTask(req, res)` - 
  - Extract `userId` from `req.user`
  - Validate input and UUID
  - Check if task exists and belongs to user
  - Use `taskModel.updateTask(id, userId, taskData)` to update
  - Return updated task
  
- `deleteTask(req, res)` - 
  - Extract `userId` from `req.user`
  - Validate UUID
  - Use `taskModel.deleteTask(id, userId)` to remove task
  - Return success message in Armenian

### Error Handling
- Return appropriate HTTP status codes (200, 201, 400, 404, 500)
- Use try-catch blocks for database operations
- Provide meaningful error messages in Armenian and English

## Testing Checklist

### Authentication Tests
- [ ] Register new user with valid data
- [ ] Prevent duplicate username registration
- [ ] Prevent duplicate email registration
- [ ] Validate password requirements (min 8 chars, letters + numbers)
- [ ] Login with correct credentials
- [ ] Reject login with incorrect password
- [ ] Reject login with non-existent email
- [ ] Token is generated and returned on successful login
- [ ] Token can be decrypted and contains correct user data

### Protected Route Tests
- [ ] Access task endpoints without token (should return 401)
- [ ] Access task endpoints with invalid token (should return 401)
- [ ] Access task endpoints with expired token (should return 401)
- [ ] Access task endpoints with valid token (should succeed)

### Task Tests
- [ ] Create task with valid data and valid token
- [ ] Prevent task creation with past date
- [ ] Prevent creating 4th task for the same day for same user
- [ ] Users can have 3 tasks on same day (different users)
- [ ] Get all tasks with pagination (page 1, 2, etc.) - only user's tasks
- [ ] Tasks are sorted by taskDate
- [ ] Get single task by ID - only if it belongs to user
- [ ] Cannot access another user's task
- [ ] Update task successfully - only user's own task
- [ ] Cannot update another user's task
- [ ] Delete task successfully - only user's own task
- [ ] Cannot delete another user's task
- [ ] Handle invalid UUID format
- [ ] Handle non-existent task ID
- [ ] Validate all input fields properly

## Submission Requirements

1. Complete source code following the specified structure
2. SQL script for database creation
3. README.md with setup instructions
4. Postman collection or API documentation
5. .env.example file (without sensitive data)

## Evaluation Criteria

- **Code Quality** (20%) - Clean, readable, well-organized code
- **Functionality** (30%) - All endpoints working correctly
- **Authentication & Security** (25%) - Proper token handling, password hashing, AES encryption
- **Validation** (10%) - Proper input validation with RegExp
- **Database Integration** (10%) - Efficient MySQL2 usage with prepared statements
- **Error Handling** (5%) - Appropriate error responses

---

**Good luck with your implementation!** 🚀