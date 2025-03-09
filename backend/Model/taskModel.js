import database from '../db.js';
import mysql from 'mysql2';
// import toDo from '../../src/App.jsx';
// import express from 'express';
const db = mysql

const getTasks = async () => {
    try {
        const [rows] = await database.query('SELECT * FROM tasks');
        return rows;
} catch (error) {
        console.error('Error fetching tasks:', error.message);
        throw error;
}
}

const createTask = async (title, date) => {
    
    try {
        console.log(date, title);
        if (!title || !date) {
            throw new Error('Title and date are required');

        }
        const [result] = await database.query('INSERT INTO tasks (title, date) VALUES (?, ?)', [title, new Date(date)    ]);
        console.log(result)
        return result.insertId;
} catch (error) {
        console.error('Error creating task:', error.message);
        throw error;
}
};

const deleteTask = async (id) => {  
    const query = 'DELETE FROM tasks WHERE id = ?';
    return new Promise((resolve, reject) => {
      database.query(query, [id], (error, result) => {
        if (error) {
            console.error('Database error', error)
            reject(err)
          } else {
           console.log('Delete result', result)
              resolve(result);
            }
          })
      });
    }

    const updateTask = async (taskId, completed, title, date) => {
      try {
          const parsedCompleted = completed === true || completed === "true" ? 1 : 0; // Konverter til boolean (1 eller 0)
  
          const [result] = await database.query(
              'UPDATE tasks SET title = ?, date = ?, completed = ? WHERE id = ?',
              [title, new Date(date), parsedCompleted, taskId]
          );
  
          return result;
      } catch (error) {
          console.error('Error updating task', error);
          throw error;
      }
  };
  

export default {getTasks, createTask, deleteTask, updateTask};



