import React from 'react';

const TodoItem = ({ todo, onToggle, onDelete }) => {
  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content" onClick={onToggle}>
        <input type="checkbox" checked={todo.completed} readOnly />
        <span>{todo.text}</span>
      </div>
      <button onClick={onDelete} className="btn-delete">Delete</button>
    </div>
  );
};

export default TodoItem;
