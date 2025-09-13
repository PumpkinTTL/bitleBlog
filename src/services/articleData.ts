import { ref, reactive } from 'vue';

export interface Author {
  id: number;
  username: string;
  nickname: string;
  avatar: string;
  signature?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  meta_title: string | null;
  meta_keywords: string | null;
  description?: string;
  type?: string;
  parent_id?: number;
  user_id?: number;
  sort_order?: number;
  icon?: string | null;
  cover_image?: string | null;
  status?: number;
  meta_description?: string | null;
  create_time?: string;
  update_time?: string;
  count?: number | null;
  author?: Author;
}

export interface Tag {
  name: string;
  pivot: {
    id: number;
    article_id: number;
    category_id: number;
    create_time: string;
  };
}

export interface Article {
  id: number;
  title: string;
  subtitle: string;
  content: string;
  ai_summary: string;
  html_content: string;
  cover_image: string;
  author_id: number;
  category_id: number;
  status: number;
  is_top: number;
  is_recommend: number;
  is_original: number;
  source_url: string;
  slug: string;
  keywords: string;
  description: string;
  word_count: number;
  read_time: number;
  create_time: string;
  update_time: string;
  publish_time: string | null;
  delete_time: string | null;
  favorites_count: number;
  likes_count: number;
  comments_count: number;
  category: Category;
  author: Author | null;
  tags: Tag[];
}

export interface ArticleListResponse {
  data: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    data: Article[];
    has_more: boolean;
  };
  code: number;
  msg: string;
}

export interface CategoryListResponse {
  data: Category[];
  code: number;
}

// Sample article data from server
export const articleResponse = reactive<ArticleListResponse>({
  data: {
    total: 6,
    per_page: 10,
    current_page: 1,
    last_page: 1,
    data: [
      {
        id: 95574,
        title: "测试文章标题 678",
        subtitle: "测试副标题 678",
        content: "# 测试文章 678\n\n这是一篇用于测试的文章，包含了基本的Markdown格式。\n\n## 二级标题\n\n这里是一些正文内容，可以包含**粗体**、*斜体*和~~删除线~~等格式。\n\n### 三级标题\n\n- 列表项1\n- 列表项2\n- 列表项3\n\n#### 四级标题\n\n1. 有序列表项1\n2. 有序列表项2\n3. 有序列表项3\n\n##### 代码示例\n\n```javascript\nfunction sayHello() {\n  console.log(\"Hello, World!\");\n}\n```\n\n###### 图片和链接\n\n这里可以插入[链接文本](https://example.com)\n\n> 这是一段引用文本，用于测试引用格式。\n\n这是最后一段，用于总结文章内容。\n",
        ai_summary: "",
        html_content: "",
        cover_image: "https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a6ff8e9cebe410089bfe045b882fc0a~tplv-k3u1fbpfcp-jj:300:250:0:0:q75.avis",
        author_id: 1,
        category_id: 52897,
        status: 1,
        is_top: 0,
        is_recommend: 1,
        is_original: 1,
        source_url: "",
        slug: "test-article-678",
        keywords: "测试,文章,示例,678",
        description: "测试文章 678",
        word_count: 218,
        read_time: 1,
        create_time: "2025-05-06 17:06:19",
        update_time: "2025-05-11 18:39:38",
        publish_time: null,
        delete_time: null,
        favorites_count: 0,
        likes_count: 0,
        comments_count: 0,
        category: {
          id: 52897,
          name: "软件",
          slug: "ruanjian",
          meta_title: null,
          meta_keywords: null
        },
        author: null,
        tags: []
      },
      {
        id: 78598,
        title: "测试文章标题 71",
        subtitle: "测试副标题 71",
        content: "# 测试文章 71\n\n这是一篇用于测试的文章，包含了基本的Markdown格式。\n\n## 二级标题\n\n这里是一些正文内容，可以包含**粗体**、*斜体*和~~删除线~~等格式。\n\n### 三级标题\n\n- 列表项1\n- 列表项2\n- 列表项3\n\n#### 四级标题\n\n1. 有序列表项1\n2. 有序列表项2\n3. 有序列表项3\n\n##### 代码示例\n\n```javascript\nfunction sayHello() {\n  console.log(\"Hello, World!\");\n}\n```\n\n###### 图片和链接\n\n这里可以插入[链接文本](https://example.com)\n\n> 这是一段引用文本，用于测试引用格式。\n\n这是最后一段，用于总结文章内容。\n",
        ai_summary: "本文是一篇用于测试Markdown格式的示例文章，展示了多种常用语法元素。主要内容包括：二级标题下的文本格式（粗体、斜体、删除线），三级标题下的无序列表，四级标题下的有序列表，以及代码块示例（含JavaScript函数）。文章还演示了链接插入、引用块等排版功能，最后以总结段落收尾。全文结构清晰，完整呈现了Markdown的基础排版功能，适合作为格式测试的参考模板。（字数：148字）",
        html_content: "",
        cover_image: "https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a6ff8e9cebe410089bfe045b882fc0a~tplv-k3u1fbpfcp-jj:300:250:0:0:q75.avis",
        author_id: 1,
        category_id: 3,
        status: 0,
        is_top: 0,
        is_recommend: 0,
        is_original: 1,
        source_url: "",
        slug: "test-article-71",
        keywords: "测试,文章,示例,71",
        description: "本文是一篇用于测试Markdown格式的示例文章，展示了多种常用语法元素。主要内容包括：二级标题下的文本格式（粗体、斜体、删除线），三级标题下的无序列表，四级标题下的有序列表，以及代码块示例（含JavaScript函数）。文章还演示了链接插入、引用块等排版功能，最后以总结段落收尾。全文结构清晰，完整呈现了Markdown的基础排版功能，适合作为格式测试的参考模板。（字数：148字）",
        word_count: 217,
        read_time: 1,
        create_time: "2025-05-06 17:07:16",
        update_time: "2025-05-11 18:39:37",
        publish_time: null,
        delete_time: null,
        favorites_count: 0,
        likes_count: 0,
        comments_count: 0,
        category: {
          id: 3,
          name: "数码",
          slug: "life",
          meta_title: "生活科技",
          meta_keywords: "life,生活"
        },
        author: null,
        tags: []
      },
      {
        id: 83684,
        title: "测试文章标题 756",
        subtitle: "测试副标题 756",
        content: "# 测试文章 756\n\n这是一篇用于测试的文章，包含了基本的Markdown格式。\n\n## 二级标题\n\n这里是一些正文内容，可以包含**粗体**、*斜体*和~~删除线~~等格式。\n\n### 三级标题\n\n- 列表项1\n- 列表项2\n- 列表项3\n\n#### 四级标题\n\n1. 有序列表项1\n2. 有序列表项2\n3. 有序列表项3\n\n##### 代码示例\n\n```javascript\nfunction sayHello() {\n  console.log(\"Hello, World!\");\n}\n```\n\n###### 图片和链接\n\n这里可以插入[链接文本](https://example.com)\n\n> 这是一段引用文本，用于测试引用格式。\n\n这是最后一段，用于总结文章内容。\n",
        ai_summary: "",
        html_content: "",
        cover_image: "https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a6ff8e9cebe410089bfe045b882fc0a~tplv-k3u1fbpfcp-jj:300:250:0:0:q75.avis",
        author_id: 1,
        category_id: 3,
        status: 1,
        is_top: 1,
        is_recommend: 0,
        is_original: 1,
        source_url: "",
        slug: "test-article-756",
        keywords: "测试,文章,示例,756",
        description: "测试文章 756",
        word_count: 218,
        read_time: 1,
        create_time: "2025-05-06 17:02:05",
        update_time: "2025-05-11 18:39:37",
        publish_time: null,
        delete_time: null,
        favorites_count: 0,
        likes_count: 0,
        comments_count: 0,
        category: {
          id: 3,
          name: "数码",
          slug: "life",
          meta_title: "生活科技",
          meta_keywords: "life,生活"
        },
        author: null,
        tags: []
      },
      {
        id: 42849,
        title: "测试文章标题 19",
        subtitle: "测试副标题 19",
        content: "# 测试文章 19\n\n这是一篇用于测试的文章，包含了基本的Markdown格式。\n\n## 二级标题\n\n这里是一些正文内容，可以包含**粗体**、*斜体*和~~删除线~~等格式。\n\n### 三级标题\n\n- 列表项1\n- 列表项2\n- 列表项3\n\n#### 四级标题\n\n1. 有序列表项1\n2. 有序列表项2\n3. 有序列表项3\n\n##### 代码示例\n\n```javascript\nfunction sayHello() {\n  console.log(\"Hello, World!\");\n}\n```\n\n###### 图片和链接\n\n这里可以插入[链接文本](https://example.com)\n\n> 这是一段引用文本，用于测试引用格式。\n\n这是最后一段，用于总结文章内容。\n",
        ai_summary: "",
        html_content: "",
        cover_image: "https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a6ff8e9cebe410089bfe045b882fc0a~tplv-k3u1fbpfcp-jj:300:250:0:0:q75.avis",
        author_id: 1,
        category_id: 1,
        status: 0,
        is_top: 0,
        is_recommend: 1,
        is_original: 1,
        source_url: "",
        slug: "test-article-19",
        keywords: "测试,文章,示例,19",
        description: "测试文章 19",
        word_count: 217,
        read_time: 1,
        create_time: "2025-05-06 17:06:36",
        update_time: "2025-05-11 18:39:36",
        publish_time: null,
        delete_time: null,
        favorites_count: 0,
        likes_count: 0,
        comments_count: 0,
        category: {
          id: 1,
          name: "生活",
          slug: "technology",
          meta_title: "技术文章分类",
          meta_keywords: "编程,IT,技术"
        },
        author: null,
        tags: []
      },
      {
        id: 58762,
        title: "测试文章标题 272",
        subtitle: "测试副标题 272",
        content: "# 测试文章 272\n\n这是一篇用于测试的文章，包含了基本的Markdown格式。\n\n## 二级标题\n\n这里是一些正文内容，可以包含**粗体**、*斜体*和~~删除线~~等格式。\n\n### 三级标题\n\n- 列表项1\n- 列表项2\n- 列表项3\n\n#### 四级标题\n\n1. 有序列表项1\n2. 有序列表项2\n3. 有序列表项3\n\n##### 代码示例\n\n```javascript\nfunction sayHello() {\n  console.log(\"Hello, World!\");\n}\n```\n\n###### 图片和链接\n\n这里可以插入[链接文本](https://example.com)\n\n> 这是一段引用文本，用于测试引用格式。\n\n这是最后一段，用于总结文章内容。\n",
        ai_summary: "",
        html_content: "",
        cover_image: "https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a6ff8e9cebe410089bfe045b882fc0a~tplv-k3u1fbpfcp-jj:300:250:0:0:q75.avis",
        author_id: 1,
        category_id: 2,
        status: 1,
        is_top: 0,
        is_recommend: 1,
        is_original: 1,
        source_url: "",
        slug: "test-article-272",
        keywords: "测试,文章,示例,272",
        description: "这是一篇测试文章，用于展示文章管理功能。它包含了各种Markdown格式和基本结构，编号为272。",
        word_count: 218,
        read_time: 1,
        create_time: "2025-05-06 17:01:19",
        update_time: "2025-05-11 18:39:36",
        publish_time: null,
        delete_time: null,
        favorites_count: 0,
        likes_count: 0,
        comments_count: 0,
        category: {
          id: 2,
          name: "科技",
          slug: "electronics",
          meta_title: "电子产品分类",
          meta_keywords: "手机,电脑,数码"
        },
        author: null,
        tags: []
      },
      {
        id: 5055,
        title: " 量子比特（Qubit）与传统比特的区别​",
        subtitle: "量子计算的基本原理​",
        content: "传统计算机使用二进制（0或1）存储信息，而量子比特利用​​量子叠加态​​（Superposition）和​​量子纠缠​​（Entanglement）实现并行计算：\r\n\r\n​​叠加态​​：一个量子比特可以同时是0和1的线性组合（如α|0⟩ + β|1⟩）。\r\n​​量子纠缠​​：多个量子比特关联后，改变其中一个会瞬时影响其他比特（爱因斯坦称为）。\r\n​​1.2 核心算法​​\r\n​​Shor算法​​：可在多项式时间内破解RSA加密（威胁现有密码体系）。\r\n​​Grover算法​​：非结构化搜索问题的平方级加速。\r\n​​2. 当前研究进展​​\r\n​​2.1 硬件技术路线​​\r\n技术方案\t代表机构\t优势\t挑战\r\n超导量子比特\tGoogle、IBM\t高运算速度\t需接近绝对零度（-273°C）\r\n离子阱\tIonQ\t高精度、长相干时间\t系统复杂度高\r\n拓扑量子计算\tMicrosoft\t抗噪声能力强\t尚未实现物理验证\r\n​​2.2 里程碑事件​​\r\n​​2019年​​：Google实现（53量子比特处理器完成特定任务比超级计算机快1亿倍）。\r\n​​2023年​​：中国实现可编程量子计算原型机。\r\n​​3. 潜在应用场景​​\r\n​​3.1 密码学与网络安全​​\r\n​​威胁​​：Shor算法可破解RSA、ECC等非对称加密。\r\n​​对策​​：后量子密码学（如基于格的加密算法）。\r\n​​3.2 药物研发与材料科学​​\r\n模拟分子相互作用（如蛋白质折叠），加速新药开发。\r\n设计高温超导体或高效太阳能电池材料。\r\n​​3.3 人工智能优化​​\r\n量子机器学习（QML）可加速训练复杂模型（如神经网络）。\r\n​​4. 挑战与未来展望​​\r\n​​4.1 技术瓶颈​​\r\n​​退相干问题​​：环境噪声导致量子态崩溃（需纠错码如表面码）。\r\n​​可扩展性​​：当前量子计算机仅支持百比特级运算。\r\n​​4.2 未来十年预测​​\r\n​​2025–2030年​​：专用量子处理器商业化（如化学模拟、金融优化）。\r\n​​2030年后​​：通用量子计算机可能问世，颠覆经典计算范式。\r\n​​结论​​\r\n量子计算虽仍处于早期阶段，但其潜力已引发全球科技竞赛。各国政府和企业需加大投入，同时建立量子安全标准以应对随之而来的安全风险。这场或将重新定义人类社会的技术边界。\r\n\r\n​​关键词​​：量子比特、量子优越性、Shor算法、后量子密码学",
        ai_summary: "量子计算利用量子比特的叠加与纠缠特性，实现远超经典计算机的并行计算能力。当前主流技术路线包括超导、离子阱和拓扑量子比特，Google、IBM等机构已实现里程碑。量子计算在密码破解、药物研发、AI优化等领域潜力巨大，但仍面临退相干和可扩展性等挑战。未来十年，专用量子处理器有望商业化，而通用量子计算机可能重塑全球技术格局。\r\n\r\n",
        html_content: "量子计算利用量子比特的叠加与纠缠特性，实现远超经典计算机的并行计算能力。当前主流技术路线包括超导、离子阱和拓扑量子比特，Google、IBM等机构已实现",
        cover_image: "https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a6ff8e9cebe410089bfe045b882fc0a~tplv-k3u1fbpfcp-jj:300:250:0:0:q75.avis",
        author_id: 7709,
        category_id: 3,
        status: 1,
        is_top: 1,
        is_recommend: 1,
        is_original: 1,
        source_url: "null",
        slug: "default",
        keywords: "两字计算科学",
        description: "测试文章",
        word_count: 3000,
        read_time: 10,
        create_time: "2025-04-29 21:48:16",
        update_time: "2025-04-30 01:37:54",
        publish_time: "2025-04-29 21:49:14",
        delete_time: null,
        favorites_count: 2,
        likes_count: 1,
        comments_count: 1,
        category: {
          id: 3,
          name: "数码",
          slug: "life",
          meta_title: "生活科技",
          meta_keywords: "life,生活"
        },
        author: {
          id: 7709,
          username: "南瓜头",
          nickname: "超级管理员",
          avatar: "https://c-ssl.dtstatic.com/uploads/item/202004/07/20200407220019_pmhmh.thumb.400_0.jpg",
          signature: "故事的开始，是蝉鸣不止的盛夏"
        },
        tags: [
          {
            name: "科技",
            pivot: {
              id: 76893,
              article_id: 5055,
              category_id: 2,
              create_time: "2025-04-29 21:50:50"
            }
          },
          {
            name: "生活",
            pivot: {
              id: 98242,
              article_id: 5055,
              category_id: 1,
              create_time: "2025-04-29 21:50:44"
            }
          }
        ]
      }
    ],
    has_more: false
  },
  code: 200,
  msg: "获取文章列表成功"
});

// Sample category data from server
export const categoryResponse = reactive<CategoryListResponse>({
  data: [
    {
      id: 52897,
      name: "软件",
      slug: "ruanjian",
      description: "软件相关",
      type: "article",
      parent_id: 0,
      user_id: 7709,
      sort_order: 0,
      icon: null,
      cover_image: null,
      status: 1,
      meta_title: null,
      meta_keywords: null,
      meta_description: null,
      create_time: "2025-05-07 16:24:09",
      update_time: "2025-05-07 16:24:09",
      count: null,
      author: {
        id: 7709,
        nickname: "超级管理员",
        username: "南瓜头",
        avatar: "https://c-ssl.dtstatic.com/uploads/item/202004/07/20200407220019_pmhmh.thumb.400_0.jpg"
      }
    },
    {
      id: 52876,
      name: "资源",
      slug: "JavaScript",
      description: "搜索关于原生JavaScript的内容",
      type: "article",
      parent_id: 0,
      user_id: 7709,
      sort_order: 20,
      icon: "",
      cover_image: null,
      status: 1,
      meta_title: "JavaScript搜索",
      meta_keywords: "JavaScript，jQuery",
      meta_description: "搜索关于原生JavaScript的内容",
      create_time: "2025-04-26 23:28:04",
      update_time: "2025-05-07 16:08:34",
      count: 0,
      author: {
        id: 7709,
        nickname: "超级管理员",
        username: "南瓜头",
        avatar: "https://c-ssl.dtstatic.com/uploads/item/202004/07/20200407220019_pmhmh.thumb.400_0.jpg"
      }
    },
    {
      id: 3,
      name: "数码",
      slug: "life",
      description: "生活世界的探索",
      type: "article",
      parent_id: 0,
      user_id: 7709,
      sort_order: 12,
      icon: null,
      cover_image: null,
      status: 1,
      meta_title: "生活科技",
      meta_keywords: "life,生活",
      meta_description: null,
      create_time: "2025-04-29 22:21:32",
      update_time: "2025-05-07 16:08:25",
      count: null,
      author: {
        id: 7709,
        nickname: "超级管理员",
        username: "南瓜头",
        avatar: "https://c-ssl.dtstatic.com/uploads/item/202004/07/20200407220019_pmhmh.thumb.400_0.jpg"
      }
    },
    {
      id: 2,
      name: "科技",
      slug: "electronics",
      description: "手机、电脑等电子设备",
      type: "product",
      parent_id: 0,
      user_id: 7709,
      sort_order: 50,
      icon: "icon-device",
      cover_image: "covers/electronics.jpg",
      status: 1,
      meta_title: "电子产品分类",
      meta_keywords: "手机,电脑,数码",
      meta_description: "各类电子产品的分类",
      create_time: "2025-04-25 17:45:51",
      update_time: "2025-05-07 16:08:21",
      count: 1,
      author: {
        id: 7709,
        nickname: "超级管理员",
        username: "南瓜头",
        avatar: "https://c-ssl.dtstatic.com/uploads/item/202004/07/20200407220019_pmhmh.thumb.400_0.jpg"
      }
    },
    {
      id: 1,
      name: "生活",
      slug: "technology",
      description: "所有与技术相关的文章分类",
      type: "product",
      parent_id: 0,
      user_id: 7709,
      sort_order: 1,
      icon: "icon-code",
      cover_image: null,
      status: 1,
      meta_title: "技术文章分类",
      meta_keywords: "编程,IT,技术",
      meta_description: "关于编程和IT技术的文章分类",
      create_time: "2025-04-25 17:45:51",
      update_time: "2025-05-07 16:08:18",
      count: 12,
      author: {
        id: 7709,
        nickname: "超级管理员",
        username: "南瓜头",
        avatar: "https://c-ssl.dtstatic.com/uploads/item/202004/07/20200407220019_pmhmh.thumb.400_0.jpg"
      }
    }
  ],
  code: 200
});

// Helper function to format date
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diff < 60) {
    return '刚刚';
  } else if (diff < 3600) {
    return Math.floor(diff / 60) + '分钟前';
  } else if (diff < 86400) {
    return Math.floor(diff / 3600) + '小时前';
  } else if (diff < 2592000) {
    return Math.floor(diff / 86400) + '天前';
  } else {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
}

// Helper function to get article excerpt
export function getArticleExcerpt(article: Article): string {
  // Use AI summary if available
  if (article.ai_summary && article.ai_summary.length > 0) {
    return article.ai_summary;
  }
  
  // Use description if available
  if (article.description && article.description.length > 0) {
    return article.description;
  }
  
  // Extract excerpt from content
  const content = article.content;
  // Remove markdown headers, code blocks, etc.
  const cleanContent = content
    .replace(/#{1,6} .+/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/>\s.*/g, '')
    .trim();
    
  // Return first 100 characters
  return cleanContent.substring(0, 100) + (cleanContent.length > 100 ? '...' : '');
}

// Export the actual article data and categories for components to use
export const articles = ref(articleResponse.data.data);
export const categories = ref(categoryResponse.data); 