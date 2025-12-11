<template>
  <div class="app-container">
    <header class="app-header">
      <h1>📋 Task Manager</h1>
      <p class="subtitle">Stay organized, get things done</p>
    </header>

    <TaskInput @add-task="addTask" />
    
    <div class="filters">
      <button 
        v-for="filter in filters" 
        :key="filter"
        @click="activeFilter = filter"
        :class="{ active: activeFilter === filter }"
        class="filter-btn"
      >
        {{ filter }}
      </button>
    </div>

    <div class="task-list">
      <TaskCard
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
        @toggle="toggleTask"
        @delete="deleteTask"
      />
      <div v-if="filteredTasks.length === 0" class="empty-state">
        <p>No tasks here. Great job! 🎉</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import TaskInput from './components/TaskInput.vue'
import TaskCard from './components/TaskCard.vue'

const API_URL = '/api/tasks'

export default {
  components: {
    TaskInput,
    TaskCard
  },
  setup() {
    const tasks = ref([])
    const activeFilter = ref('All')
    const filters = ['All', 'Active', 'Completed']

    const loadTasks = async () => {
      try {
        const response = await fetch(API_URL)
        tasks.value = await response.json()
      } catch (error) {
        console.error('Failed to load tasks:', error)
      }
    }

    const addTask = async (taskData) => {
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData)
        })
        const newTask = await response.json()
        tasks.value.push(newTask)
      } catch (error) {
        console.error('Failed to add task:', error)
      }
    }

    const toggleTask = async (id) => {
      const task = tasks.value.find(t => t.id === id)
      if (!task) return

      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed: !task.completed })
        })
        const updated = await response.json()
        const index = tasks.value.findIndex(t => t.id === id)
        tasks.value[index] = updated
      } catch (error) {
        console.error('Failed to update task:', error)
      }
    }

    const deleteTask = async (id) => {
      try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        tasks.value = tasks.value.filter(t => t.id !== id)
      } catch (error) {
        console.error('Failed to delete task:', error)
      }
    }

    const filteredTasks = computed(() => {
      if (activeFilter.value === 'Active') {
        return tasks.value.filter(t => !t.completed)
      }
      if (activeFilter.value === 'Completed') {
        return tasks.value.filter(t => t.completed)
      }
      return tasks.value
    })

    loadTasks()

    return {
      tasks,
      activeFilter,
      filters,
      addTask,
      toggleTask,
      deleteTask,
      filteredTasks
    }
  }
}
</script>

<style scoped>
.app-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px 20px;
  text-align: center;
}

.app-header h1 {
  font-size: 28px;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 14px;
  opacity: 0.9;
}

.filters {
  display: flex;
  gap: 10px;
  padding: 20px;
  border-bottom: 1px solid #eee;
  background: #f8f9fa;
}

.filter-btn {
  padding: 8px 16px;
  border: 2px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.filter-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.task-list {
  padding: 20px;
  min-height: 300px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 16px;
}
</style>
