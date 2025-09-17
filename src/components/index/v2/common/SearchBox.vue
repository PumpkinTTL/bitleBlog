<template>
  <div class="search-box" :class="searchBoxClasses">
    <div class="search-container">
      <!-- 搜索图标 -->
      <div class="search-icon" :class="{ 'active': isActive }">
        <i class="fas fa-search"></i>
      </div>
      
      <!-- 搜索输入框 -->
      <input
        ref="searchInput"
        v-model="searchQuery"
        :placeholder="placeholder"
        class="search-input"
        type="text"
        autocomplete="off"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown.enter="handleSearch"
        @keydown.esc="handleClear"
        @input="handleInput"
      />
      
      <!-- 清除按钮 -->
      <div 
        v-if="searchQuery && showClear" 
        class="clear-btn" 
        @click="handleClear"
      >
        <i class="fas fa-times"></i>
      </div>
      
      <!-- 搜索按钮 -->
      <div v-if="showButton" class="search-btn" @click="handleSearch">
        <i class="fas fa-search"></i>
        <span v-if="!compact">搜索</span>
      </div>
    </div>
    
    <!-- 搜索建议下拉菜单 -->
    <div 
      v-if="showSuggestions && suggestions.length > 0" 
      class="suggestions-dropdown"
      :class="{ 'visible': isActive }"
    >
      <ul class="suggestions-list">
        <li 
          v-for="(suggestion, index) in suggestions" 
          :key="index"
          class="suggestion-item"
          :class="{ 'highlighted': highlightedIndex === index }"
          @click="handleSuggestionClick(suggestion)"
          @mouseenter="highlightedIndex = index"
        >
          <div class="suggestion-icon">
            <i :class="suggestion.icon || 'fas fa-search'"></i>
          </div>
          <div class="suggestion-content">
            <span class="suggestion-text" v-html="highlightMatch(suggestion.text)"></span>
            <span v-if="suggestion.type" class="suggestion-type">{{ suggestion.type }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'

interface Suggestion {
  text: string
  value?: string
  type?: string
  icon?: string
}

interface SearchBoxProps {
  placeholder?: string
  compact?: boolean
  showButton?: boolean
  showClear?: boolean
  showSuggestions?: boolean
  suggestions?: Suggestion[]
  debounceDelay?: number
}

const props = withDefaults(defineProps<SearchBoxProps>(), {
  placeholder: '搜索...',
  compact: false,
  showButton: false,
  showClear: true,
  showSuggestions: false,
  suggestions: () => [],
  debounceDelay: 300
})

const emit = defineEmits<{
  search: [query: string]
  input: [query: string]
  focus: []
  blur: []
  suggestionSelect: [suggestion: Suggestion]
}>()

// 响应式状态
const searchQuery = ref('')
const isActive = ref(false)
const highlightedIndex = ref(-1)
const searchInput = ref<HTMLInputElement>()
let debounceTimer: NodeJS.Timeout

// 计算属性
const searchBoxClasses = computed(() => ({
  'compact': props.compact,
  'active': isActive.value,
  'has-value': searchQuery.value.length > 0
}))

// 事件处理
const handleFocus = () => {
  isActive.value = true
  highlightedIndex.value = -1
  emit('focus')
}

const handleBlur = () => {
  // 延迟关闭，允许点击建议项
  setTimeout(() => {
    isActive.value = false
    emit('blur')
  }, 200)
}

const handleInput = () => {
  // 防抖搜索
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('input', searchQuery.value)
  }, props.debounceDelay)
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value.trim())
    searchInput.value?.blur()
  }
}

const handleClear = () => {
  searchQuery.value = ''
  highlightedIndex.value = -1
  searchInput.value?.focus()
  emit('input', '')
}

const handleSuggestionClick = (suggestion: Suggestion) => {
  searchQuery.value = suggestion.text
  emit('suggestionSelect', suggestion)
  emit('search', suggestion.value || suggestion.text)
  searchInput.value?.blur()
}

// 高亮匹配文本
const highlightMatch = (text: string): string => {
  if (!searchQuery.value) return text
  
  const regex = new RegExp(`(${searchQuery.value})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

// 键盘导航
const handleKeydown = (event: KeyboardEvent) => {
  if (!isActive.value || props.suggestions.length === 0) return
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      highlightedIndex.value = Math.min(highlightedIndex.value + 1, props.suggestions.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, -1)
      break
    case 'Enter':
      event.preventDefault()
      if (highlightedIndex.value >= 0) {
        handleSuggestionClick(props.suggestions[highlightedIndex.value])
      } else {
        handleSearch()
      }
      break
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  clearTimeout(debounceTimer)
})
</script>

<style lang="less" scoped>
.search-box {
  position: relative;
  width: 100%;
  max-width: 400px;
  
  &.compact {
    max-width: 280px;
  }
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.9) 0%,
    rgba(248, 250, 252, 0.95) 100%
  );
  backdrop-filter: blur(16px) saturate(150%);
  -webkit-backdrop-filter: blur(16px) saturate(150%);
  border-radius: 24px;
  border: 0.5px solid rgba(22, 119, 255, 0.1);
  box-shadow: 
    0 4px 16px rgba(22, 119, 255, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg,
      transparent,
      rgba(22, 119, 255, 0.08),
      transparent
    );
    transition: left 0.6s ease;
  }
  
  .search-box.active &,
  &:hover {
    border-color: rgba(22, 119, 255, 0.25);
    box-shadow: 
      0 8px 24px rgba(22, 119, 255, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    transform: translateY(-1px);
    
    &::before {
      left: 100%;
    }
  }
}

.search-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: var(--el-text-color-placeholder);
  font-size: 14px;
  transition: all 0.3s ease;
  flex-shrink: 0;
  
  &.active {
    color: var(--el-color-primary);
    transform: scale(1.1);
  }
}

.search-input {
  flex: 1;
  height: 40px;
  padding: 0 12px;
  border: none;
  outline: none;
  background: transparent;
  color: var(--el-text-color-primary);
  font-size: 14px;
  font-weight: 500;
  
  &::placeholder {
    color: var(--el-text-color-placeholder);
    font-weight: 400;
  }
}

.clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: 4px;
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.05);
  color: var(--el-text-color-placeholder);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.6;
  
  &:hover {
    background: var(--el-color-danger-light-9);
    color: var(--el-color-danger);
    opacity: 1;
    transform: scale(1.1);
  }
}

.search-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 16px;
  height: 32px;
  margin: 4px;
  background: linear-gradient(135deg, 
    var(--el-color-primary) 0%,
    rgba(105, 177, 255, 0.9) 100%
  );
  color: white;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(22, 119, 255, 0.3);
  
  &:hover {
    background: linear-gradient(135deg, 
      rgba(22, 119, 255, 0.9) 0%,
      rgba(105, 177, 255, 1) 100%
    );
    transform: translateY(-1px) scale(1.02);
    box-shadow: 0 4px 12px rgba(22, 119, 255, 0.4);
  }
  
  i {
    font-size: 12px;
  }
  
  span {
    white-space: nowrap;
  }
}

.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: var(--el-bg-color);
  border-radius: 12px;
  border: 0.5px solid var(--el-border-color-lighter);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  max-height: 300px;
  overflow: hidden;
  
  &.visible {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
}

.suggestions-list {
  list-style: none;
  margin: 0;
  padding: 8px;
  max-height: 280px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--el-fill-color-lighter);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--el-border-color);
    border-radius: 3px;
    
    &:hover {
      background: var(--el-border-color-dark);
    }
  }
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover,
  &.highlighted {
    background: linear-gradient(135deg, 
      rgba(22, 119, 255, 0.08) 0%,
      rgba(105, 177, 255, 0.05) 100%
    );
    transform: translateX(2px);
  }
  
  .suggestion-icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--el-fill-color-light);
    border-radius: 6px;
    color: var(--el-text-color-placeholder);
    font-size: 12px;
    flex-shrink: 0;
  }
  
  .suggestion-content {
    flex: 1;
    min-width: 0;
    
    .suggestion-text {
      display: block;
      font-size: 14px;
      color: var(--el-text-color-primary);
      font-weight: 500;
      
      :deep(mark) {
        background: rgba(22, 119, 255, 0.2);
        color: var(--el-color-primary);
        border-radius: 2px;
        padding: 1px 2px;
        font-weight: 600;
      }
    }
    
    .suggestion-type {
      display: block;
      font-size: 12px;
      color: var(--el-text-color-placeholder);
      margin-top: 2px;
    }
  }
}

// 暗色模式适配
html.dark & {
  .search-container {
    background: linear-gradient(135deg, 
      rgba(28, 28, 30, 0.9) 0%,
      rgba(44, 44, 46, 0.85) 100%
    );
    border-color: rgba(100, 168, 255, 0.15);
    box-shadow: 
      0 4px 16px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
    
    &::before {
      background: linear-gradient(90deg,
        transparent,
        rgba(100, 168, 255, 0.1),
        transparent
      );
    }
    
    .search-box.active &,
    &:hover {
      border-color: rgba(100, 168, 255, 0.3);
      box-shadow: 
        0 8px 24px rgba(100, 168, 255, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }
  }
  
  .search-icon.active {
    color: #64A8FF;
  }
  
  .clear-btn {
    background: rgba(255, 255, 255, 0.08);
    
    &:hover {
      background: rgba(var(--el-color-danger-rgb), 0.15);
    }
  }
  
  .search-btn {
    background: linear-gradient(135deg, #64A8FF 0%, #40A8FF 100%);
    box-shadow: 0 2px 8px rgba(100, 168, 255, 0.4);
    
    &:hover {
      background: linear-gradient(135deg, #40A8FF 0%, #64A8FF 100%);
      box-shadow: 0 4px 12px rgba(100, 168, 255, 0.5);
    }
  }
  
  .suggestions-dropdown {
    background: var(--el-bg-color);
    border-color: rgba(255, 255, 255, 0.08);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }
  
  .suggestion-item {
    &:hover,
    &.highlighted {
      background: linear-gradient(135deg, 
        rgba(100, 168, 255, 0.1) 0%,
        rgba(64, 168, 255, 0.08) 100%
      );
    }
    
    .suggestion-icon {
      background: rgba(255, 255, 255, 0.05);
    }
    
    .suggestion-content .suggestion-text :deep(mark) {
      background: rgba(100, 168, 255, 0.25);
      color: #64A8FF;
    }
  }
}
</style>
