# Realtime Neon Drizzle

This project is a Node.js application that integrates with a Neon Postgres database using Drizzle ORM. It provides a simple CRUD (Create, Read, Update, Delete) interface for managing users.

## Project Structure

```
realtime-neon-drizzle
├── src
│   ├── index.js               # Entry point of the application
│   ├── db
│   │   ├── client.js          # Database client connection
│   │   ├── schema.js          # Database schema definition
│   │   └── migrations
│   │       └── 0001_create_users.sql # SQL migration for users table
│   └── controllers
│       └── userController.js   # User-related operations
├── scripts
│   └── crud.js                # Demonstrates full CRUD lifecycle
├── drizzle.config.js          # Drizzle ORM configuration
├── package.json               # npm configuration file
├── .env.example               # Environment variable template
├── .gitignore                 # Git ignore file
└── README.md                  # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd realtime-neon-drizzle
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the `.env.example` template and fill in your database connection details.

## Usage

1. Start the server:
   ```
   npm start
   ```

2. Access the API at `http://localhost:8000`.

## CRUD Operations

The `src/scripts/crud.js` file contains examples of how to perform CRUD operations on the `users` table. You can run this script to see how to create, read, update, and delete users in the database.

## Migrations

The SQL migration file located at `src/db/migrations/0001_create_users.sql` is used to create the initial `users` table. You can run this migration using your preferred database migration tool.

## Contributing

Feel free to submit issues or pull requests for any improvements or features you would like to see in this project.