# Element Plus 暗色模式使用指南

## 🌙 Element Plus 暗色模式的正确使用方式

### 1. 基本原理

Element Plus 暗色模式通过 CSS 变量系统实现，只需要在 `html` 标签上添加 `dark` 类即可：

```javascript
// 开启暗色模式
document.documentElement.classList.add('dark')

// 关闭暗色模式  
document.documentElement.classList.remove('dark')
```

### 2. 必要的配置

#### 2.1 导入暗色模式 CSS 变量
```css
/* 在 main.ts 或 App.vue 中导入 */
@import 'element-plus/theme-chalk/dark/css-vars.css';
```

#### 2.2 使用 Element Plus CSS 变量
```css
/* 正确的做法 - 使用 Element Plus CSS 变量 */
.my-component {
  background: var(--el-bg-color);           /* 背景色 */
  color: var(--el-text-color-primary);     /* 主要文字色 */
  border: 1px solid var(--el-border-color); /* 边框色 */
}

/* 错误的做法 - 使用固定颜色 */
.my-component {
  background: #ffffff;  /* ❌ 暗色模式下不会改变 */
  color: #333333;       /* ❌ 暗色模式下不会改变 */
}
```

### 3. 常用的 Element Plus CSS 变量

#### 3.1 背景色变量
- `var(--el-bg-color)` - 主要背景色
- `var(--el-bg-color-page)` - 页面背景色  
- `var(--el-fill-color-lighter)` - 浅色填充
- `var(--el-fill-color)` - 填充色
- `var(--el-fill-color-darker)` - 深色填充

#### 3.2 文字色变量
- `var(--el-text-color-primary)` - 主要文字色
- `var(--el-text-color-regular)` - 常规文字色
- `var(--el-text-color-secondary)` - 次要文字色
- `var(--el-text-color-placeholder)` - 占位符文字色

#### 3.3 边框和其他
- `var(--el-border-color)` - 边框色
- `var(--el-color-primary)` - 主题色
- `var(--el-color-white)` - 白色
- `var(--el-border-radius-base)` - 基础圆角
- `var(--el-transition-duration)` - 过渡时间

### 4. 开发时的最佳实践

#### 4.1 ✅ 推荐做法
```vue
<template>
  <div class="my-card">
    <h3 class="title">标题</h3>
    <p class="content">内容</p>
  </div>
</template>

<style scoped>
.my-card {
  background: var(--el-fill-color-lighter);
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  padding: 16px;
}

.title {
  color: var(--el-text-color-primary);
  margin-bottom: 8px;
}

.content {
  color: var(--el-text-color-regular);
}
</style>
```

#### 4.2 ❌ 不推荐做法
```vue
<style scoped>
.my-card {
  background: #ffffff;  /* 固定颜色，暗色模式下不会改变 */
  border: 1px solid #e5e7eb;
  color: #333333;
}

/* 手动定义暗色模式样式 - 不推荐 */
html.dark .my-card {
  background: #1f2937;
  border-color: #374151;
  color: #ffffff;
}
</style>
```

### 5. 项目中的实现

在我们的项目中，暗色模式已经在 `App.vue` 中统一配置：

1. **全局配置**: 使用 `el-config-provider` 包装应用
2. **CSS变量导入**: 导入了 Element Plus 暗色模式变量
3. **统一管理**: 所有暗色模式样式集中管理
4. **自动适配**: Element Plus 组件和自定义组件都会自动适配

### 6. 总结

- ✅ **只需要在 html 上加 dark 类**
- ✅ **使用 Element Plus CSS 变量**
- ✅ **无需手动定义暗色样式**
- ✅ **Element Plus 组件自动适配**
- ❌ **不要使用固定颜色值**
- ❌ **不要手动写暗色模式样式**

这样做的好处：
- 代码更简洁
- 维护更容易
- 性能更好
- 与 Element Plus 完美兼容
