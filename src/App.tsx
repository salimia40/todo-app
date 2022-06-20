import { useState } from 'react'
import './App.css'

import { Helmet } from "react-helmet";

import { useImmer } from 'use-immer'

import { motion, AnimatePresence, MotionConfig } from "framer-motion"


type TodoItem = {
  id: number;
  message: string;
  completed: boolean;

};

type Store = {
  todos: TodoItem[];
};

const store: Store = {
  todos: []
};


const variants = {
  pending: {
    color: "#333",
    textDecoration: "none"
  },
  complete: {
    color: "#aaa",
    textDecoration: "line-through"
  }
}

export default function Todos() {
  const [{ todos }, setData] = useImmer<Store>(store);

  console.log(todos);

  return (
    <div className="todos-app">
      <Helmet>
        <title>Todos</title>
        <meta name="description" content="A todos app powered by Aleph.js" />
      </Helmet>
      <h1>
        <span

        >Todos</span>
        <AnimatePresence
        >
          {todos.length > 0 && <motion.em
            transition={{
              duration: 0.5,
            }}>
            {todos.filter((todo) => todo.completed).length}
            /{todos.length}</motion.em>}
        </AnimatePresence>
      </h1>

      <ul>
        <AnimatePresence>

          {todos.map((todo) => (
            <motion.li key={todo.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.1 }}

            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => {
                  setData((draft) => {
                    draft.todos[todo.id].completed = !todo.completed;
                  })
                }}
              />
              <motion.label variants={variants} initial="pending" animate={todo.completed ? "complete" : "pending"}>{todo.message}</motion.label>
              {todo.id >= 0 && <button onClick={() => {
                setData((draft) => {
                  draft.todos.splice(todo.id - 1, 1);
                  return draft;
                })
              }}></button>}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const fd = new FormData(form);
          const message = fd.get("message")?.toString().trim();
          if (message) {
            setData((draft) => {
              draft.todos.push({
                id: draft.todos.length,
                message,
                completed: false
              });
            }
            )
            form.reset();
            setTimeout(() => {
              form.querySelector("input")?.focus();
            }, 0);
          }
        }}
      >
        <motion.input
          type="text"
          name="message"
          placeholder="What needs to be done?"
          autoFocus
          autoComplete="off"
          whileFocus={{ scale: 1.1 }}
          whileHover={{ scale: 1.1 }}
        />
      </form>
    </div>
  );
}

