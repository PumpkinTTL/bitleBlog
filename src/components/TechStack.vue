<template>
  <div class="tech-stack-section">
    <h2 class="section-title">
      <el-icon><Connection /></el-icon>
      技术栈展示
    </h2>
    
    <div class="tech-container">
      <div class="tech-category" v-for="(category, index) in techCategories" :key="index">
        <h3 class="category-title">{{ category.name }}</h3>
        <div class="tech-grid">
          <div 
            v-for="(tech, techIndex) in category.technologies" 
            :key="techIndex" 
            class="tech-item"
            @mouseover="activeTech = tech.name"
            @mouseleave="activeTech = null"
            :class="{ 'tech-active': activeTech === tech.name }"
          >
            <div class="tech-icon" :style="{ backgroundColor: tech.color }">
              <img :src="tech.icon" :alt="tech.name" />
            </div>
            <div class="tech-details">
              <div class="tech-name">{{ tech.name }}</div>
              <div class="tech-description">{{ tech.description }}</div>
              <div class="tech-version" v-if="tech.version">v{{ tech.version }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Connection } from '@element-plus/icons-vue';

// 当前激活的技术
const activeTech = ref(null);

// 技术栈数据
const techCategories = ref([
  {
    name: '前端框架',
    technologies: [
      {
        name: 'Vue.js',
        description: '渐进式JavaScript框架',
        version: '3.3.4',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
        color: '#42b883'
      },
      {
        name: 'TypeScript',
        description: '带类型系统的JavaScript超集',
        version: '5.0.2',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
        color: '#3178c6'
      },
      {
        name: 'Element Plus',
        description: 'Vue 3的组件库',
        version: '2.3.7',
        icon: 'https://element-plus.org/images/element-plus-logo.svg',
        color: '#409eff'
      }
    ]
  },
  {
    name: '构建工具',
    technologies: [
      {
        name: 'Vite',
        description: '下一代前端构建工具',
        version: '4.3.9',
        icon: 'https://vitejs.dev/logo.svg',
        color: '#646cff'
      },
      {
        name: 'ESBuild',
        description: '极速JavaScript打包器',
        icon: 'https://esbuild.github.io/favicon.svg',
        color: '#ffcb3d'
      },
      {
        name: 'npm',
        description: '包管理工具',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg',
        color: '#cb3837'
      }
    ]
  },
  {
    name: '后端技术',
    technologies: [
      {
        name: 'Node.js',
        description: 'JavaScript运行时',
        version: '18.16.0',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
        color: '#539e43'
      },
      {
        name: 'Express',
        description: 'Web应用框架',
        version: '4.18.2',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
        color: '#000000'
      },
      {
        name: 'MySQL',
        description: '关系型数据库',
        version: '8.0',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
        color: '#4479a1'
      }
    ]
  }
]);
</script>

<style scoped lang="less">
.tech-stack-section {
  padding: 15px 0 30px;
  
  .section-title {
    display: flex;
    align-items: center;
    font-size: 18px;
    margin-bottom: 16px;
    color: #1d2129;
    font-weight: 600;
    letter-spacing: 0.3px;
    
    .el-icon {
      color: #1e80ff;
      margin-right: 8px;
      font-size: 20px;
    }
  }
  
  .tech-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .tech-category {
    .category-title {
      font-size: 16px;
      font-weight: 600;
      color: #1d2129;
      margin-bottom: 12px;
      position: relative;
      padding-left: 12px;
      
      &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        height: 14px;
        width: 3px;
        background: linear-gradient(135deg, #1e80ff, #6366f1);
        border-radius: 1.5px;
      }
    }
    
    .tech-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 14px;
      
      @media (max-width: 768px) {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 12px;
      }
      
      @media (max-width: 480px) {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 10px;
      }
    }
    
    .tech-item {
      background-color: #fff;
      border-radius: 8px;
      padding: 14px;
      display: flex;
      align-items: center;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      cursor: pointer;
      
      &:hover, &.tech-active {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.06);
      }
      
      .tech-icon {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
        flex-shrink: 0;
        
        img {
          width: 24px;
          height: 24px;
          object-fit: contain;
        }
      }
      
      .tech-details {
        flex: 1;
        min-width: 0;
        
        .tech-name {
          font-size: 14px;
          font-weight: 600;
          color: #1d2129;
          margin-bottom: 3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .tech-description {
          font-size: 11px;
          color: #86909c;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .tech-version {
          font-size: 10px;
          color: #1e80ff;
          font-weight: 500;
          background-color: rgba(30, 128, 255, 0.08);
          padding: 2px 6px;
          border-radius: 4px;
          display: inline-block;
          line-height: 1;
        }
      }
      
      @media (max-width: 768px) {
        padding: 12px;
        
        .tech-icon {
          width: 36px;
          height: 36px;
          margin-right: 10px;
          border-radius: 6px;
          
          img {
            width: 20px;
            height: 20px;
          }
        }
        
        .tech-details {
          .tech-name {
            font-size: 13px;
            margin-bottom: 2px;
          }
          
          .tech-description {
            font-size: 10px;
            margin-bottom: 3px;
          }
          
          .tech-version {
            font-size: 9px;
            padding: 1px 5px;
          }
        }
      }
      
      @media (max-width: 480px) {
        padding: 10px;
        
        .tech-icon {
          width: 32px;
          height: 32px;
          margin-right: 8px;
          
          img {
            width: 18px;
            height: 18px;
          }
        }
        
        .tech-details {
          .tech-name {
            font-size: 12px;
          }
          
          .tech-description {
            font-size: 9px;
          }
        }
      }
    }
  }
  
  @media (max-width: 768px) {
    padding: 12px 0 25px;
    
    .section-title {
      font-size: 16px;
      margin-bottom: 14px;
      
      .el-icon {
        font-size: 18px;
      }
    }
    
    .tech-container {
      gap: 16px;
    }
    
    .tech-category {
      .category-title {
        font-size: 15px;
        margin-bottom: 10px;
        padding-left: 10px;
        
        &:before {
          height: 12px;
          width: 2.5px;
        }
      }
    }
  }
}
</style> 