/**
 * 懒觉王比赛 - 数据加载工具
 * 小程序中使用 import 直接加载 JSON
 */
import usersData from '@/data/users.json'
import weeklyData from '@/data/weekly.json'
import dailyDataRaw from '@/data/daily.json'
import rulesData from '@/data/rules.json'
import eventsData from '@/data/events.json'

export async function getUsers() {
  return usersData || []
}

export async function getWeeklyData() {
  return weeklyData || []
}

export async function getDailyData() {
  return dailyDataRaw?.records || []
}

export async function getRules() {
  return rulesData || {}
}

export async function getEvents() {
  return eventsData || {}
}
