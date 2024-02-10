'use client';

import React, { useState } from 'react';

interface Todo {
  id: number;
  text: string;
}

const TodoComponent: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Todo 1' },
    { id: 2, text: 'Todo 2' },
    { id: 3, text: 'Todo 3' },
  ]);

  const addTodos = () => {
    // You can add more todos to the list when the button is clicked
    const newTodos: Todo[] = [
      { id: 4, text: 'Todo 4' },
      { id: 5, text: 'Todo 5' },
    ];

    setTodos((prevTodos) => [...prevTodos, ...newTodos]);
  };

  return (
    <div className="todo-container transition-all duration-500 ease-in-out">
      <h1 className="text-2xl font-bold mb-4">Todos</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="border p-2 mb-2 rounded">
            {todo.text}
          </li>
        ))}
      </ul>
      <button
        onClick={addTodos}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add More Todos
      </button>
    </div>
  );
};

export default TodoComponent;
