<template>
    <div class="profile-container">
      <!-- 顶部个人信息卡片 -->
      <a-card class="profile-header" :bordered="false">
        <div class="profile-header-content">
          <div class="profile-avatar-section">
            <a-avatar :size="120" :src="userInfo.value.avatar" class="animate__animated animate__fadeIn">
              <template #icon><UserOutlined /></template>
            </a-avatar>
            <div class="profile-edit-avatar">
              <a-button type="primary" shape="circle" size="small">
                <template #icon><CameraOutlined /></template>
              </a-button>
            </div>
          </div>
          
          <div class="profile-info-section animate__animated animate__fadeInRight">
            <h1 class="profile-name">{{ userInfo.value.nickname || userInfo.value.username }}</h1>
            <p class="profile-bio">{{ userInfo.value.signature }}</p>
            <div class="profile-tags">
              <a-tag v-for="(role, index) in userInfo.value.roles" :key="index" :color="tagColors[index % tagColors.length]">
                {{ role.iden || role.name }}
              </a-tag>
            </div>
            <div class="profile-stats">
              <div class="stat-item animate__animated animate__fadeIn" v-motion-pop>
                <h3>{{ userInfo.value.posts || 0 }}</h3>
                <p>文章</p>
              </div>
              <div class="stat-item animate__animated animate__fadeIn" v-motion-pop-delay="0.1">
                <h3>{{ userInfo.value.followers || 0 }}</h3>
                <p>粉丝</p>
              </div>
              <div class="stat-item animate__animated animate__fadeIn" v-motion-pop-delay="0.2">
                <h3>{{ userInfo.value.following || 0 }}</h3>
                <p>关注</p>
              </div>
            </div>
          </div>
        </div>
      </a-card>
  
      <!-- 主体内容区域 -->
      <el-row :gutter="20" class="profile-content">
        <!-- 左侧信息栏 -->
        <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="6">
          <a-card class="profile-sidebar animate__animated animate__fadeInLeft">
            <template #title>
              <div class="card-title">
                <UserOutlined />
                <span>个人资料</span>
              </div>
            </template>
            
            <a-list item-layout="horizontal">
              <a-list-item>
                <template #actions>
                  <a-button type="link" @click="editField('email')">
                    <EditOutlined />
                  </a-button>
                </template>
                <a-list-item-meta>
                  <template #title>邮箱</template>
                  <template #description>{{ userInfo.email }}</template>
                  <template #avatar><MailOutlined /></template>
                </a-list-item-meta>
              </a-list-item>
              
              <a-list-item>
                <template #actions>
                  <a-button type="link" @click="editField('phone')">
                    <EditOutlined />
                  </a-button>
                </template>
                <a-list-item-meta>
                  <template #title>电话</template>
                  <template #description>{{ userInfo.phone }}</template>
                  <template #avatar><PhoneOutlined /></template>
                </a-list-item-meta>
              </a-list-item>
              
              <a-list-item>
                <template #actions>
                  <a-button type="link" @click="editField('location')">
                    <EditOutlined />
                  </a-button>
                </template>
                <a-list-item-meta>
                  <template #title>地址</template>
                  <template #description>{{ userInfo.location }}</template>
                  <template #avatar><EnvironmentOutlined /></template>
                </a-list-item-meta>
              </a-list-item>
              
              <a-list-item>
                <template #actions>
                  <a-button type="link" @click="editField('website')">
                    <EditOutlined />
                  </a-button>
                </template>
                <a-list-item-meta>
                  <template #title>网站</template>
                  <template #description>
                    <a :href="userInfo.website" target="_blank">{{ userInfo.website }}</a>
                  </template>
                  <template #avatar><GlobalOutlined /></template>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
            
            <a-divider />
            
            <div class="social-links">
              <h3>社交账号</h3>
              <div class="social-icons">
                <a-button shape="circle" class="social-icon animate__animated animate__bounceIn" v-motion-pop>
                  <template #icon><GithubOutlined /></template>
                </a-button>
                <a-button shape="circle" class="social-icon animate__animated animate__bounceIn" v-motion-pop-delay="0.1">
                  <template #icon><TwitterOutlined /></template>
                </a-button>
                <a-button shape="circle" class="social-icon animate__animated animate__bounceIn" v-motion-pop-delay="0.2">
                  <template #icon><LinkedinOutlined /></template>
                </a-button>
                <a-button shape="circle" class="social-icon animate__animated animate__bounceIn" v-motion-pop-delay="0.3">
                  <template #icon><InstagramOutlined /></template>
                </a-button>
              </div>
            </div>
          </a-card>
          
          <a-card class="profile-skills animate__animated animate__fadeInLeft" style="margin-top: 20px;">
            <template #title>
              <div class="card-title">
                <TrophyOutlined />
                <span>技能</span>
              </div>
            </template>
            
            <div class="skill-bars">
              <div v-for="(skill, index) in userInfo.skills" :key="index" class="skill-item">
                <div class="skill-info">
                  <span>{{ skill.name }}</span>
                  <span>{{ skill.level }}%</span>
                </div>
                <a-progress :percent="skill.level" :stroke-color="gradientColors" />
              </div>
            </div>
          </a-card>
        </el-col>
        
        <!-- 右侧内容区 -->
        <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="18">
          <a-tabs default-active-key="1" class="profile-tabs animate__animated animate__fadeInRight">
            <a-tab-pane key="1">
              <template #tab>
                <span><FileTextOutlined /> 最近文章</span>
              </template>
              
              <a-list item-layout="vertical" :data-source="userInfo.recentPosts" :pagination="pagination">
                <template #renderItem="{ item }">
                  <a-list-item key="item.id">
                    <template #extra>
                      <img width="272" alt="cover" :src="item.cover" class="post-cover" />
                    </template>
                    <a-list-item-meta :title="item.title">
                      <template #description>
                        <span>{{ formatDate(item.date) }}</span>
                        <a-tag color="blue" style="margin-left: 8px;">{{ item.category }}</a-tag>
                      </template>
                    </a-list-item-meta>
                    <div class="post-content">{{ item.excerpt }}</div>
                    <template #actions>
                      <span><EyeOutlined /> {{ item.views }}</span>
                      <span><LikeOutlined /> {{ item.likes }}</span>
                      <span><MessageOutlined /> {{ item.comments }}</span>
                      <span><ShareAltOutlined /> {{ item.shares }}</span>
                    </template>
                  </a-list-item>
                </template>
              </a-list>
            </a-tab-pane>
            
            <a-tab-pane key="2">
              <template #tab>
                <span><ProjectOutlined /> 项目</span>
              </template>
              
              <el-row :gutter="16" class="projects-grid">
                <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8" v-for="(project, index) in userInfo.projects" :key="index">
                  <a-card hoverable class="project-card animate__animated animate__fadeIn" v-motion-slide-visible-bottom>
                    <template #cover>
                      <img alt="project cover" :src="project.cover" />
                    </template>
                    <template #actions>
                      <EyeOutlined key="view" />
                      <StarOutlined key="star" />
                      <GithubOutlined key="github" />
                    </template>
                    <a-card-meta :title="project.name" :description="project.description">
                      <template #avatar>
                        <a-avatar :src="project.icon" />
                      </template>
                    </a-card-meta>
                    <div class="project-tech-stack">
                      <a-tag v-for="(tech, idx) in project.technologies" :key="idx" color="blue">{{ tech }}</a-tag>
                    </div>
                  </a-card>
                </el-col>
              </el-row>
            </a-tab-pane>
            
            <a-tab-pane key="3">
              <template #tab>
                <span><SettingOutlined /> 设置</span>
              </template>
              
              <a-card class="settings-card">
                <a-form :model="userSettings" layout="vertical">
                  <a-form-item label="账号安全">
                    <a-button type="primary" class="setting-action-btn">
                      <LockOutlined /> 修改密码
                    </a-button>
                    <a-button class="setting-action-btn">
                      <SafetyOutlined /> 两步验证
                    </a-button>
                  </a-form-item>
                  
                  <a-form-item label="通知设置">
                    <a-list>
                      <a-list-item>
                        <a-list-item-meta title="电子邮件通知">
                          <template #description>接收有关账号活动和更新的电子邮件</template>
                        </a-list-item-meta>
                        <template #actions>
                          <a-switch v-model:checked="userSettings.emailNotification" />
                        </template>
                      </a-list-item>
                      <a-list-item>
                        <a-list-item-meta title="推送通知">
                          <template #description>接收实时推送通知</template>
                        </a-list-item-meta>
                        <template #actions>
                          <a-switch v-model:checked="userSettings.pushNotification" />
                        </template>
                      </a-list-item>
                    </a-list>
                  </a-form-item>
                  
                  <a-form-item label="隐私设置">
                    <a-checkbox-group v-model:value="userSettings.privacyOptions">
                      <a-checkbox value="profile">公开个人资料</a-checkbox>
                      <a-checkbox value="email">显示电子邮件</a-checkbox>
                      <a-checkbox value="activity">显示活动状态</a-checkbox>
                    </a-checkbox-group>
                  </a-form-item>
                  
                  <a-form-item label="主题设置">
                    <a-radio-group v-model:value="userSettings.theme">
                      <a-radio-button value="light">
                        <BulbOutlined /> 浅色
                      </a-radio-button>
                      <a-radio-button value="dark">
                        <BulbFilled /> 深色
                      </a-radio-button>
                      <a-radio-button value="system">
                        <DesktopOutlined /> 系统
                      </a-radio-button>
                    </a-radio-group>
                  </a-form-item>
                  
                  <a-form-item>
                    <a-button type="primary">保存设置</a-button>
                  </a-form-item>
                </a-form>
              </a-card>
            </a-tab-pane>
          </a-tabs>
        </el-col>
      </el-row>
      
      <!-- 编辑信息对话框 -->
      <a-modal v-model:visible="editModalVisible" :title="`编辑${editingField}`" @ok="handleEditOk">
        <a-input v-model:value="editValue" />
      </a-modal>
    </div>
  </template>
<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import {
  UserOutlined, EditOutlined, MailOutlined, PhoneOutlined,
  EnvironmentOutlined, GlobalOutlined, GithubOutlined,
  TwitterOutlined, LinkedinOutlined, InstagramOutlined,
  TrophyOutlined, FileTextOutlined, ProjectOutlined,
  SettingOutlined, EyeOutlined, LikeOutlined, MessageOutlined,
  ShareAltOutlined, StarOutlined, LockOutlined, SafetyOutlined,
  BulbOutlined, BulbFilled, DesktopOutlined, CameraOutlined
} from '@ant-design/icons-vue';
import { useMotion } from '@vueuse/motion';
import { useStore } from '../store';

// 获取store中的用户信息
const store = useStore();

// 从store获取用户信息
const userInfo = computed(() => {
  const user = store.userInfo;
  return user || {
    id: 0,
    username: '未知用户',
    nickname: '未设置昵称',
    avatar: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    bio: '这个人很懒，什么都没有留下~',
    posts: 0,
    followers: 0,
    following: 0,
    roles: [],
    permissions: []
  };
});

// 用户设置
const userSettings = reactive({
  emailNotification: true,
  pushNotification: false,
  privacyOptions: ['profile', 'activity'],
  theme: 'light'
});

// 编辑信息相关
const editModalVisible = ref(false);
const editingField = ref('');
const editValue = ref('');

const editField = (field: string) => {
  editingField.value = field;
  editValue.value = userInfo[field as keyof typeof userInfo] as string;
  editModalVisible.value = true;
};

const handleEditOk = () => {
  if (editingField.value && editValue.value) {
    (userInfo[editingField.value as keyof typeof userInfo] as string) = editValue.value;
  }
  editModalVisible.value = false;
};

// 分页配置
const pagination = {
  onChange: (page: number) => {
    console.log(page);
  },
  pageSize: 3,
};

// 标签颜色
const tagColors = ['blue', 'cyan', 'geekblue', 'purple', 'magenta'];

// 渐变色
const gradientColors = {
  '0%': '#108ee9',
  '100%': '#1890ff',
};

// 日期格式化
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>
<style scoped>
.profile-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 顶部个人信息卡片 */
.profile-header {
  background: linear-gradient(135deg, #1a6fc4 0%, #2c8ae6 50%, #0f4c81 100%);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 8px 20px rgba(12, 65, 131, 0.15);
}

.profile-header-content {
  display: flex;
  align-items: center;
  padding: 30px;
  color: white;
}

@media (max-width: 768px) {
  .profile-header-content {
    flex-direction: column;
    text-align: center;
  }
}

.profile-avatar-section {
  position: relative;
  margin-right: 40px;
}

@media (max-width: 768px) {
  .profile-avatar-section {
    margin-right: 0;
    margin-bottom: 20px;
  }
}

.profile-edit-avatar {
  position: absolute;
  bottom: 0;
  right: 0;
}

.profile-info-section {
  flex: 1;
}

.profile-name {
  font-size: 2rem;
  margin: 0 0 10px;
  font-weight: 600;
}

.profile-bio {
  font-size: 1rem;
  margin-bottom: 20px;
  opacity: 0.9;
  max-width: 600px;
}

.profile-tags {
  margin-bottom: 20px;
}

.profile-stats {
  display: flex;
  gap: 30px;
}

@media (max-width: 576px) {
  .profile-stats {
    justify-content: center;
  }
}

.stat-item {
  text-align: center;
}

.stat-item h3 {
  font-size: 1.5rem;
  margin: 0;
  font-weight: 600;
}

.stat-item p {
  margin: 5px 0 0;
  font-size: 0.9rem;
  opacity: 0.8;
}

/* 主体内容区域 */
.profile-content {
  margin-top: 20px;
}

/* 侧边栏 */
.profile-sidebar {
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
}

.social-links {
  margin-top: 20px;
}

.social-links h3 {
  font-size: 16px;
  margin-bottom: 15px;
}

.social-icons {
  display: flex;
  gap: 12px;
}

.social-icon {
  background: linear-gradient(135deg, #1a6fc4 0%, #2c8ae6 100%);
  color: white;
  border: none;
}

/* 技能卡片 */
.profile-skills {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.skill-bars {
  padding: 10px 0;
}

.skill-item {
  margin-bottom: 15px;
}

.skill-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 14px;
}

/* 标签页内容 */
.profile-tabs {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* 文章列表 */
.post-cover {
  border-radius: 8px;
  object-fit: cover;
}

.post-content {
  margin: 12px 0;
  color: rgba(0, 0, 0, 0.65);
}

/* 项目卡片 */
.projects-grid {
  margin-top: 20px;
}

.project-card {
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.project-card:hover {
  transform: translateY(-5px);
}

.project-tech-stack {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* 设置卡片 */
.settings-card {
  border-radius: 8px;
}

.setting-action-btn {
  margin-right: 12px;
  margin-bottom: 12px;
}

/* 全局动画时长控制 */
:deep(.animate__animated) {
  animation-duration: 0.8s;
}

/* 响应式调整 */
@media (max-width: 992px) {
  .profile-header-content {
    padding: 20px;
  }
}

@media (max-width: 576px) {
  .profile-container {
    padding: 10px;
  }
  
  .profile-header-content {
    padding: 15px;
  }
  
  .profile-name {
    font-size: 1.5rem;
  }
}
</style>
  