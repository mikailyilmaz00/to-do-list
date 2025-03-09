import mysql from 'mysql2/promise';
import 'dotenv/config'
// import { error } from 'console';
const database = await mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: process.env.DB_PASSWORD,
    database: 'todo_db',
});

// connecting to db
try {
    await database.connect();
    console.log('Connected to MySQL database.');
} catch (err) {
    console.error('Error connecting to MySQL database:', err.message);
}

export default database;
