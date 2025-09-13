import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { articleResponse, categoryResponse } from '@/services/articleData'

export const useArticleStore = defineStore('articles', () => {
  // State
  const articles = ref(articleResponse.data.data)
  const categories = ref(categoryResponse.data)
  const activeCategory = ref(0) // 0 means "All"
  const isLoading = ref(false)
  
  // Getters
  const filteredArticles = computed(() => {
    if (activeCategory.value === 0) {
      return articles.value
    }
    
    return articles.value.filter(article => 
      article.category_id === activeCategory.value
    )
  })
  
  const featuredArticles = computed(() => {
    return articles.value
      .filter(article => article.is_featured)
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
  })
  
  const mainFeaturedArticle = computed(() => {
    if (featuredArticles.value.length === 0) return null
    return featuredArticles.value[0]
  })
  
  const sideFeaturedArticles = computed(() => {
    if (featuredArticles.value.length <= 1) return []
    return featuredArticles.value.slice(1)
  })
  
  const popularArticles = computed(() => {
    return [...articles.value]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
  })
  
  // Actions
  const setActiveCategory = (categoryId: number) => {
    activeCategory.value = categoryId
  }
  
  const fetchArticles = async () => {
    // In a real application, this would fetch from an API
    isLoading.value = true
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      articles.value = articleResponse.data
    } catch (error) {
      console.error('Failed to fetch articles:', error)
    } finally {
      isLoading.value = false
    }
  }
  
  const fetchCategories = async () => {
    // In a real application, this would fetch from an API
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      categories.value = categoryResponse.data
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }
  
  // Utility functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }
  
  const getArticleExcerpt = (content: string, length: number = 150) => {
    // Strip HTML tags and get plain text
    const plainText = content.replace(/<\/?[^>]+(>|$)/g, '')
    
    // Return truncated content with ellipsis
    if (plainText.length <= length) return plainText
    return plainText.substring(0, length) + '...'
  }
  
  return {
    // State
    articles,
    categories,
    activeCategory,
    isLoading,
    
    // Getters
    filteredArticles,
    featuredArticles,
    mainFeaturedArticle,
    sideFeaturedArticles,
    popularArticles,
    
    // Actions
    setActiveCategory,
    fetchArticles,
    fetchCategories,
    
    // Utilities
    formatDate,
    getArticleExcerpt
  }
})
