<template>
  <div class="todo-container">
    <h1>Vue & MongoDB Todo List</h1>

    <form @submit.prevent="addTodo" class="todo-form">
      <input 
        v-model="newTodoTitle" 
        type="text" 
        placeholder="Enter Todo" 
        id="input-todo"
      />
      <button type="submit" id="add-todo">+</button>
    </form>

    <ul class="todo-list">
      <li v-for="todo in todos" :key="todo._id" class="todo-item">
        <span>{{ todo.title }}</span>
        <button @click="deleteTodo(todo._id)" class="delete-btn">✕</button>
      </li>
    </ul>
    
    <p v-if="todos.length === 0" class="empty-msg">No tasks left! 🎉</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
}

const API_URL = 'http://localhost:5000/api/todos';
const todos = ref<Todo[]>([]);
const newTodoTitle = ref<string>('');

const fetchTodos = async () => {
  try {
    const response = await fetch(API_URL);
    todos.value = await response.json();
  } catch (error) {
    console.error('Error fetching todos:', error);
  }
};

const addTodo = async () => {
  if (!newTodoTitle.value.trim()) return;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTodoTitle.value })
    });
    
    if (response.ok) {
      const savedTodo: Todo = await response.json();
      todos.value.push(savedTodo);
      newTodoTitle.value = '';
    }
  } catch (error) {
    console.error('Error adding todo:', error);
  }
};

const deleteTodo = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (response.ok) {
      todos.value = todos.value.filter(todo => todo._id !== id);
    }
  } catch (error) {
    console.error('Error deleting todo:', error);
  }
};

onMounted(fetchTodos);
</script>

<style scoped>
.todo-container {
  max-width: 400px;
  margin: 50px auto;
  font-family: Arial, sans-serif;
  text-align: center;
}
.todo-form {
  display: flex;
  margin-bottom: 20px;
}
#input-todo {
  flex: 1;
  padding: 10px;
  font-size: 16px;
}
#add-todo {
  padding: 10px 15px;
  font-size: 16px;
  background: #42b883;
  color: white;
  border: none;
  cursor: pointer;
}
.todo-list {
  list-style: none;
  padding: 0;
}
.todo-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  align-items: center;
}
.delete-btn {
  background: #ff5252;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  padding: 5px 8px;
}
.empty-msg {
  color: #666;
  font-style: italic;
}
</style>
