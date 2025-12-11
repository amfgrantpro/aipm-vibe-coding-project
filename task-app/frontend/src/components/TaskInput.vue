<template>
  <div class="task-input-container">
    <form @submit.prevent="submitTask">
      <div class="input-group">
        <input
          v-model="form.title"
          type="text"
          placeholder="What needs to be done?"
          class="task-input"
        />
        <input
          v-model="form.dueDate"
          type="date"
          class="date-input"
        />
        <select v-model="form.priority" class="priority-select">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button type="submit" class="submit-btn">Add Task</button>
      </div>
      <textarea
        v-model="form.description"
        placeholder="Add details (optional)"
        class="description-input"
      ></textarea>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  emits: ['add-task'],
  setup(props, { emit }) {
    const form = ref({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium'
    })

    const submitTask = () => {
      if (form.value.title.trim()) {
        emit('add-task', {
          title: form.value.title,
          description: form.value.description,
          dueDate: form.value.dueDate || null,
          priority: form.value.priority
        })
        form.value = {
          title: '',
          description: '',
          dueDate: '',
          priority: 'medium'
        }
      }
    }

    return { form, submitTask }
  }
}
</script>

<style scoped>
.task-input-container {
  padding: 20px;
  background: white;
  border-bottom: 1px solid #eee;
}

form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.task-input {
  flex: 1;
  min-width: 200px;
  padding: 12px;
  border: 2px solid #eee;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.task-input:focus {
  outline: none;
  border-color: #667eea;
}

.date-input,
.priority-select {
  padding: 12px;
  border: 2px solid #eee;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.date-input:focus,
.priority-select:focus {
  outline: none;
  border-color: #667eea;
}

.submit-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.submit-btn:hover {
  transform: translateY(-2px);
}

.description-input {
  padding: 12px;
  border: 2px solid #eee;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 60px;
  transition: border-color 0.2s;
}

.description-input:focus {
  outline: none;
  border-color: #667eea;
}
</style>
