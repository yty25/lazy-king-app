/**
 * 懒觉王比赛 - 全局数据 Store
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getUsers, getWeeklyData, getDailyData, getRules, getEvents } from '@/utils/api'

const lazyKings = {
  kyle: 'Kyle', cj: 'cj', baoxuan: '宝宣', cong: '聪', yty: 'yty', issac: 'issac',
  Kyle: 'Kyle', CJ: 'CJ', 宝宣: '宝宣', 聪: '聪', YTY: 'yty', ISSAC: 'issac', Issac: 'issac',
  主管: '主管', c: 'c' // 有个脏数据
}

function normalizeName(name) {
  if (!name) return ''
  const map = { 'c': 'Kyle' }
  return map[name] || name
}

export const useRankingStore = defineStore('ranking', () => {
  // 状态
  const users = ref([])
  const weeklyData = ref({ weeks: [], quarterlySummary: [], annualSummary: {} })
  const dailyData = ref([])
  const rules = ref({})
  const events = ref({})
  const isLoading = ref(false)
  const currentRankingTab = ref(0) // 0=年度 1=季度 2=周度
  const selectedQuarter = ref(0) // 季度索引
  const selectedWeek = ref(0) // 周索引

  // ============ 年度排行 ============
  const annualRanking = computed(() => {
    const summary = weeklyData.value.annualSummary
    if (!summary || !summary.members) return []
    const members = summary.members
    const entries = Object.entries(members)
      .map(([id, score]) => ({ id, name: getName(id), score }))
      .sort((a, b) => b.score - a.score)
    return entries.map((item, i) => ({
      ...item,
      rank: i + 1,
      isChampion: i === 0,
      isLazyKing: i === entries.length - 1
    }))
  })

  const annualLazyKing = computed(() => {
    const arr = annualRanking.value
    return arr.length > 0 ? arr[arr.length - 1] : null
  })

  // ============ 季度排行 ============
  const quarters = computed(() => {
    return weeklyData.value.quarterlySummary || []
  })

  const selectedQuarterData = computed(() => {
    const q = quarters.value[selectedQuarter.value]
    if (!q || !q.members) return []
    const entries = Object.entries(q.members)
      .map(([id, score]) => ({ id, name: getName(id), score }))
      .sort((a, b) => b.score - a.score)
    return entries.map((item, i) => ({
      ...item,
      rank: i + 1,
      isChampion: i === 0,
      isLazyKing: i === entries.length - 1
    }))
  })

  // ============ 周度排行 ============
  const weeks = computed(() => weeklyData.value.weeks || [])

  const selectedWeekData = computed(() => {
    const w = weeks.value[selectedWeek.value]
    if (!w || !w.members) return []
    const entries = Object.entries(w.members)
      .map(([id, score]) => ({ id, name: getName(id), score }))
      .sort((a, b) => b.score - a.score)
    return entries.map((item, i) => ({
      ...item,
      rank: i + 1,
      isChampion: i === 0,
      isLazyKing: item.id === w.lazyKing?.toLowerCase?.() || item.name === w.lazyKing
    }))
  })

  // ============ 每日记录查询 ============
  const getDailyByDate = (dateStr) => {
    return dailyData.value.find(r => r.date === dateStr)
  }

  // ============ 辅助 ============
  function getName(id) {
    const u = users.value.find(u => u.id === id?.toLowerCase())
    return u?.name || id
  }

  function getAvatar(id) {
    const u = users.value.find(u => u.id === id?.toLowerCase())
    return u?.avatar || id?.[0]?.toUpperCase() || '?'
  }

  function getColor(id) {
    const u = users.value.find(u => u.id === id?.toLowerCase())
    return u?.color || '#666'
  }

  function getRankLabel(score) {
    if (score >= 10) return 'P1'
    if (score >= 7) return 'P2'
    if (score >= 5) return 'P3'
    if (score >= 3) return 'P4'
    if (score >= 2) return 'P5'
    if (score >= 1) return 'P6'
    return '退赛'
  }

  const usersMap = computed(() => {
    const m = {}
    users.value.forEach(u => { m[u.id] = u })
    return m
  })

  // 获取所有不重复的日期（用于日历）
  const allDates = computed(() => dailyData.value.map(r => r.date))

  // 数据加载
  async function fetchAllData() {
    isLoading.value = true
    try {
      const [u, w, d, r, e] = await Promise.all([
        getUsers(),
        getWeeklyData(),
        getDailyData(),
        getRules(),
        getEvents()
      ])
      users.value = u
      weeklyData.value = w
      dailyData.value = d
      rules.value = r
      events.value = e
    } catch (err) {
      console.error('数据加载失败:', err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    // 状态
    users, weeklyData, dailyData, rules, events,
    isLoading, currentRankingTab, selectedQuarter, selectedWeek,
    // 计算
    annualRanking, annualLazyKing,
    quarters, selectedQuarterData,
    weeks, selectedWeekData,
    allDates, usersMap,
    // 方法
    getName, getAvatar, getColor, getRankLabel,
    getDailyByDate, fetchAllData
  }
})
