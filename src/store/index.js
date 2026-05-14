/**
 * 懒觉王比赛 - 全局数据 Store
 * 数据在 import 时直接加载，无需异步 fetch
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import usersJson from '@/data/users.json'
import weeklyJson from '@/data/weekly.json'
import dailyJson from '@/data/daily.json'
import rulesJson from '@/data/rules.json'
import eventsJson from '@/data/events.json'

export const useRankingStore = defineStore('ranking', () => {
  // === 直接加载数据 ===
  const users = ref(usersJson || [])
  const weeklyData = ref(weeklyJson || { weeks: [], quarterlySummary: [], annualSummary: {} })
  const dailyData = ref(dailyJson?.records || [])
  const rules = ref(rulesJson || {})
  const events = ref(eventsJson || {})

  // === UI 状态 ===
  const currentRankingTab = ref(0)
  const selectedQuarter = ref(0)
  const selectedWeek = ref(0)

  // === 年度排行 ===
  const annualRanking = computed(() => {
    const summary = weeklyData.value?.annualSummary
    if (!summary?.members) return []
    const entries = Object.entries(summary.members)
      .map(([id, score]) => ({ id, name: getName(id), score: Number(score) }))
      .sort((a, b) => b.score - a.score)
    return entries.map((item, i) => ({
      ...item, rank: i + 1,
      isChampion: i === 0,
      isLazyKing: i === entries.length - 1
    }))
  })

  // === 季度排行 ===
  const quarters = computed(() => weeklyData.value?.quarterlySummary || [])

  const selectedQuarterData = computed(() => {
    const qs = quarters.value
    const q = qs?.[selectedQuarter.value]
    if (!q?.members) return []
    const entries = Object.entries(q.members)
      .map(([id, score]) => ({ id, name: getName(id), score: Number(score) }))
      .sort((a, b) => b.score - a.score)
    return entries.map((item, i) => ({
      ...item, rank: i + 1,
      isChampion: i === 0,
      isLazyKing: i === entries.length - 1
    }))
  })

  // === 周度排行 ===
  const weeks = computed(() => weeklyData.value?.weeks || [])

  const selectedWeekData = computed(() => {
    const w = weeks.value?.[selectedWeek.value]
    if (!w?.members) return []
    const entries = Object.entries(w.members)
      .map(([id, score]) => ({ id, name: getName(id), score: Number(score) }))
      .sort((a, b) => b.score - a.score)
    return entries.map((item, i) => ({
      ...item, rank: i + 1,
      isChampion: i === 0,
      isLazyKing: item.id === w.lazyKing?.toLowerCase?.() || item.name === w.lazyKing
    }))
  })

  // === 辅助 ===
  function getName(id) {
    if (!id) return '?'
    const u = users.value.find(u => u.id === id?.toLowerCase())
    return u?.name || id
  }

  function getAvatar(id) {
    if (!id) return '?'
    const u = users.value.find(u => u.id === id?.toLowerCase())
    return u?.avatar || id?.[0]?.toUpperCase() || '?'
  }

  function getColor(id) {
    if (!id) return '#666'
    const u = users.value.find(u => u.id === id?.toLowerCase())
    return u?.color || '#666'
  }

  function getDailyByDate(dateStr) {
    return dailyData.value?.find(r => r.date === dateStr)
  }

  const usersMap = computed(() => {
    const m = {}
    for (const u of users.value) m[u.id] = u
    return m
  })

  return {
    users, weeklyData, dailyData, rules, events,
    currentRankingTab, selectedQuarter, selectedWeek,
    annualRanking,
    quarters, selectedQuarterData,
    weeks, selectedWeekData,
    getName, getAvatar, getColor,
    getDailyByDate, usersMap
  }
})
