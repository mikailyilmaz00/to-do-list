import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
// import { updateTask } from '../backend/controller/taskController';
// import { TodoItem } from './TodoItem';
// import { axios } from "axios"

const CalendarComponent = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [editedTaskTitle, setEditedTaskTitle] = useState('')
  // fetching tasks 

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        console.log('kaldt fetch')
        const response = await fetch('http://localhost:3000/api/getTasks')
        if (!response.ok) throw new Error('Failed to fetch tasks');

        const data = await response.json()
        const taskWithDate = data.map(task => ({
          ...task,
          task: task.title,
          date: task.date ? new Date(task.date) : new Date(),
          completed: task.completed ?? false,
        }))
        setTasks(taskWithDate)
        console.log('KALDT', taskWithDate)
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
    }
  
  fetchTasks();
}, [tasks, selectedDate])

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleAddTask = async (task, date) => {
    console.log("kaldt", task, selectedDate); // Logs task and date for debugging
    if (task) {
      // Create new task with the correct date format (ISO string)
      const newTask = { title: task, date: selectedDate.toISOString(), completed: false };
      setTasks([...tasks, newTask]);
  
      try {
        const response = await fetch('http://localhost:3000/api/createTask', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            task,
            date 
          })
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log("Task created successfully:", data);
        } else {
          console.error("Failed to create task:", response.statusText);
        }
      } catch (error) {
        console.log('Error', error);
      }
    } else {
      console.error("Error: Task title is missing!");
    }
  };
  

  const handleEditClick = (task) => {
    setEditingTaskId(task.id);
    setEditedTaskTitle(task.task); 
  };

  const handleUpdateTask = async () => {
    
    // Nedenstående kode forsikrer, at task bliver opdateret med den nye titel, mens andre opgaver forbliver uændrede
    const updatedTasks = tasks.map(task =>
      task.id === editingTaskId ? { ...task, task: editedTaskTitle, completed: task.completed === true } : task
    );
    setTasks(updatedTasks);
    setEditingTaskId(null); 

    const updatedTask = updatedTasks.find(task => task.id === editingTaskId);
  if (!updatedTask) {
    console.error('Task not found!');
    return;
  }

  console.log("Sending updated task to backend:", updatedTask);


    try {
      const response = await fetch(`http://localhost:3000/api/updateTask/${editingTaskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editedTaskTitle,
          date: selectedDate.toISOString(),
          completed: updatedTask.completed
        }),
      })

      if (!response.ok) {
        console.error('Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };


  // const toggleTaskCompletion = (index) => {
  //   setTasks((prevTasks) => )
  //   const updatedTasks = [...tasks];
  //   updatedTasks[index].completed = !updatedTasks[index].completed;
  //   setTasks(updatedTasks);
  // };
  
  const toggleTaskCompletion = async (taskId) => {
    console.log("index is", taskId)

    const index = tasks.findIndex(task => task.id === taskId)
    if (index === -1) {
      console.error("Task not found for id:", taskId)
      return
    }
    // const index = updatedTask.findIndex(task => task.id === taskId)
    // if (index === -1) {
    //   console.error("Task not found for id", taskId)
    //   return
    // }
    const updatedTasks = [...tasks]

    console.log("tasks is ", tasks)
    const updatedTask = { ...updatedTasks[index]}
    updatedTask.completed = !updatedTask.completed

    updatedTasks[index] = updatedTask
    setTasks(updatedTasks)

    console.log("id is ", updatedTasks.id)

    try {
      const response = await fetch(`http://localhost:3000/api/updateTask/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // taskId: obj.id,
          title: updatedTask.task,
          date: updatedTask.date.toISOString(),
          completed: updatedTask.completed,
        }),
      })
        if (!response.ok) {
          console.error('Failed to update task')
          return
        }
      
    } catch (error) {
      console.error('Error updating task:', error)
    }
}
  //   setTasks((prevTasks) =>
  //     prevTasks.map((task, i) =>
  //       i === index ? { ...task, completed: !task.completed } : task
  //     )
  //   );
  // };

  

  const deleteTodo = async (taskObj) => {
    console.log('delete task with id', taskObj)
    console.log('with id', taskObj.id)
    setTasks(tasks.filter((task) => task !== taskObj))
    if (!taskObj || !taskObj.id) {
      console.error("Error: Task ID is missing!");
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/api/deleteTask', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
          body: JSON.stringify({ id: taskObj.id }),
      })
      console.log('der sker noget');
    if (!response.ok) {
      console.error('Failed to delete the task')
      setTasks((prevTasks) => [...prevTasks, taskObj])
    }
    } catch (error) {
      console.error('Error deleting task:', error) 
      setTasks((prevTasks) => [...prevTasks, taskObj])
    }

  };

  
  
  
  return (
    <div className="calendar-container"> 
      <h1 className="calendar-header">Plan your to-do lists in advance</h1> 
      
     
      <div className="calendar-wrapper">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          className="calendar" 
        />
      </div>

      
      <p className="selected-date">
        Selected Date: {selectedDate ? selectedDate.toDateString(): 'No date selected'}
      </p>
      <div className="task-input-container">
        <input
          type="text"
          id="task-input"
          placeholder="Add a task..."
          className="task-input"  
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddTask(e.target.value, selectedDate);
              e.target.value = ''; // Clear input
              
            }
          }}
        />
      </div>

    
      <div className="task-list-container">
        <h3 className="task-list-header">Plans for {selectedDate.toDateString()}</h3>
        <ul className="task-list">
          {tasks
              .filter((taskObj) => taskObj.date && taskObj.date instanceof Date && taskObj.date.toDateString() === selectedDate.toDateString())
              .map((taskObj) => (
                
              <li key={taskObj.id} className="task-item">   <input
                  type="checkbox"
                  className="task-checkbox"  
                  checked={taskObj.completed}
                  onChange={() => toggleTaskCompletion(taskObj.id
                    
                  )}
                />
                <span className={taskObj.completed ? 'completed' : ''}>
                {editingTaskId === taskObj.id ? (
                  <input
                    type='text'
                    value={editedTaskTitle}
                    onChange={(e) => setEditedTaskTitle(e.target.value)}
                    onBlur={handleUpdateTask} />
                ) : (
                  taskObj.task
                )}
                </span>
                <button className="edit" onClick={() => handleEditClick(taskObj)}>
                  {editingTaskId === taskObj.id ? 'Save' : 'Edit'}
                </button>
                <button 
                 className="delete-button"
        onClick={() => deleteTodo(taskObj)}>
            Delete 
            </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
export default CalendarComponent;