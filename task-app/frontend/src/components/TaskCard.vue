<template>
  <div class="task-card" :class="{ completed: task.completed }">
    <div class="task-header">
      <div class="task-check">
        <input
          type="checkbox"
          :checked="task.completed"
          @change="$emit('toggle', task.id)"
          class="checkbox"
        />
      </div>
      <div class="task-content">
        <h3 class="task-title">{{ task.title }}</h3>
        <p v-if="task.description" class="task-description">{{ task.description }}</p>
      </div>
      <button @click="$emit('delete', task.id)" class="delete-btn">✕</button>
    </div>
    
    <div class="task-meta">
      <span v-if="task.dueDate" class="due-date">
        📅 {{ formatDate(task.dueDate) }}
      </span>
      <span class="priority" :class="task.priority">
        {{ task.priority }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  emits: ['toggle', 'delete'],
  setup() {
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      })
    }

    return { formatDate }
  }
}
</script>

<style scoped>
.task-card {
  background: white;
  border: 2px solid #eee;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  transition: all 0.2s;
}

.task-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.task-card.completed {
  background: #f8f9fa;
}

.task-header {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.task-check {
  flex-shrink: 0;
  padding-top: 4px;
}

.checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #667eea;
}

.task-content {
  flex: 1;
  min-width: 0;
}

.task-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #333;
  text-decoration: none;
  transition: color 0.2s;
}

.task-card.completed .task-title {
  text-decoration: line-through;
  color: #999;
}

.task-description {
  font-size: 14px;
  color: #666;
  margin: 6px 0 0 0;
  line-height: 1.4;
}

.delete-btn {
  flex-shrink: 0;
  background: none;
  border: none;
  color: #ccc;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
}

.delete-btn:hover {
  color: #e74c3c;
}

.task-meta {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  font-size: 12px;
}

.due-date {
  color: #667eea;
  font-weight: 500;
}

.priority {
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
}

.priority.low {
  background: #d4edda;
  color: #155724;
}

.priority.medium {
  background: #fff3cd;
  color: #856404;
}

.priority.high {
  background: #f8d7da;
  color: #721c24;
}
</style>
