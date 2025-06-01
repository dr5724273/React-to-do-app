import React, { useState, useEffect } from 'react';

function TodoList() {
  // State for tasks and input
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [sort, setSort] = useState('none'); // none, alphabetical, status

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    const trimmed = inputValue.trim();
    if (trimmed === '') return; // don't add empty task
    const newTask = {
      id: Date.now(),
      text: trimmed,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setInputValue('');
  };

  const removeTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map((task) => (
      task.id === id ? { ...task, completed: !task.completed } : task
    )));
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  // Sort tasks
  const sortedTasks = () => {
    let sorted = [...filteredTasks];
    if (sort === 'alphabetical') {
      sorted.sort((a, b) => a.text.localeCompare(b.text));
    } else if (sort === 'status') {
      sorted.sort((a, b) => a.completed - b.completed);
    }
    return sorted;
  };

  return (
    <>
      {/* Styling */}
      <style>{`
        .todo-app {
          font-family: Arial, sans-serif;
          max-width: 400px;
          margin: 20px auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        .todo-app h1 {
          text-align: center;
        }
        .todo-app input[type="text"] {
          width: 60%;
          padding: 5px;
        }
        .todo-app button {
          margin-left: 5px;
          padding: 5px 10px;
        }
        .todo-app .task {
          display: flex;
          align-items: center;
          margin-top: 10px;
        }
        .todo-app .task input[type="checkbox"] {
          margin-right: 10px;
        }
        .todo-app .task span {
          flex-grow: 1;
        }
        .todo-app .task button {
          margin-left: 10px;
        }
        .todo-app .completed {
          text-decoration: line-through;
          color: gray;
        }
      `}</style>
      
      <div className="todo-app">
        <h1>Todo List</h1>
        <div>
          <input
            type="text"
            placeholder="Enter new task"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button onClick={addTask}>Add Task</button>
        </div>

        {/* Filter and Sort Options */}
        <div style={{ marginTop: '10px' }}>
          <label>Filter: </label>
          <select onChange={(e) => setFilter(e.target.value)} value={filter}>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>

          <label style={{ marginLeft: '10px' }}>Sort: </label>
          <select onChange={(e) => setSort(e.target.value)} value={sort}>
            <option value="none">None</option>
            <option value="alphabetical">Alphabetical</option>
            <option value="status">By Status</option>
          </select>
        </div>

        {/* Task List */}
        <ul>
          {sortedTasks().map((task) => (
            <li key={task.id} className="task">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task.id)}
              />
              <span className={task.completed ? 'completed' : ''}>
                {task.text}
              </span>
              <button onClick={() => removeTask(task.id)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default TodoList;
