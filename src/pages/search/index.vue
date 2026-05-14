<template>
  <view class="page-search">
    <view class="page-title">
      <text class="title-main">📅 查询</text>
      <text class="title-sub">查看每一天的打卡排名</text>
    </view>

    <!-- 日期选择 -->
    <view class="date-picker">
      <view class="date-nav" @tap="prevDay">‹</view>
      <view class="date-current" @tap="showDatePicker">
        <text class="date-text">{{ selectedDate }}</text>
        <picker mode="date" :value="selectedDate" @change="onDateChange">
          <text class="date-change">▼</text>
        </picker>
      </view>
      <view class="date-nav" @tap="nextDay">›</view>
    </view>

    <!-- 今日排行 -->
    <view v-if="dailyRecord" class="daily-ranking">
      <view class="daily-header">
        <text class="daily-title">{{ selectedDate }} 打卡排名</text>
      </view>

      <view
        v-for="(item, index) in rankedPlayers"
        :key="item.id"
        class="daily-row"
      >
        <view class="rank-col">
          <text v-if="index === 0" class="rank-medal">🥇</text>
          <text v-else-if="index === 1" class="rank-medal">🥈</text>
          <text v-else-if="index === 2" class="rank-medal">🥉</text>
          <text v-else class="rank-num">P{{ index + 1 }}</text>
        </view>
        <view class="player-avatar" :style="{ background: store.getColor(item.id) }">
          <text class="avatar-text">{{ store.getAvatar(item.id) }}</text>
        </view>
        <view class="player-info">
          <text class="player-name">{{ store.getName(item.id) }}</text>
          <text class="player-desc">{{ getRankDesc(item.score) }}</text>
        </view>
        <view class="score-col">
          <text class="score-num" :class="{ zero: item.score === 0, negative: item.score < 0 }">{{ item.score }}</text>
          <text class="score-unit">分</text>
        </view>
      </view>

      <view class="date-stats">
        <text class="stats-text">今日最早: {{ rankedPlayers[0]?.name }}</text>
        <text class="stats-text">最晚: {{ rankedPlayers[rankedPlayers.length - 1]?.name }}</text>
      </view>
    </view>

    <!-- 无数据 -->
    <view v-else class="no-data">
      <text class="no-data-icon">📭</text>
      <text class="no-data-text">该日期没有打卡记录</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRankingStore } from '@/store'

const store = useRankingStore()

// 初始化为今天日期，无数据时自动找到最近有数据的日期
const today = new Date()
const selectedDate = ref(formatDate(today))

function formatDate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function addDays(dateStr, days) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return formatDate(d)
}

const dailyRecord = computed(() => {
  return store.getDailyByDate(selectedDate.value)
})

const rankedPlayers = computed(() => {
  const record = dailyRecord.value
  if (!record?.rankings) return []
  const entries = Object.entries(record.rankings)
    .map(([id, score]) => ({ id, score }))
    .sort((a, b) => b.score - a.score)
  return entries
})

function getRankDesc(score) {
  if (score === 0) return '未打卡'
  if (score < 0) return `扣分 ${score}`
  const rankMap = { 10: 'P1 🥇', 7: 'P2', 5: 'P3', 3: 'P4', 2: 'P5', 1: 'P6' }
  return rankMap[score] || `第${score}名`
}

function prevDay() {
  selectedDate.value = addDays(selectedDate.value, -1)
}

function nextDay() {
  selectedDate.value = addDays(selectedDate.value, 1)
}

function onDateChange(e) {
  selectedDate.value = e.detail.value
}

function showDatePicker() {
  // 由picker组件处理
}

onMounted(() => {
  // 如果今天没有数据，跳到有数据的第一天
  if (!dailyRecord.value && store.dailyData.length > 0) {
    // 找到最近的一个日期
    const dates = store.dailyData.map(r => r.date).sort()
    selectedDate.value = dates[dates.length - 1] || selectedDate.value
  }
})
</script>

<style lang="scss" scoped>
.page-search {
  min-height: 100vh;
  padding-bottom: 40px;
}

.page-title {
  padding: 20px 16px 12px;
  text-align: center;
  .title-main {
    font-size: 22px;
    font-weight: 700;
    color: #fff;
    display: block;
  }
  .title-sub {
    font-size: 13px;
    color: #a0a0c0;
    margin-top: 4px;
    display: block;
  }
}

.date-picker {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  gap: 16px;
  .date-nav {
    width: 40px;
    height: 40px;
    background: #16213e;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: #FF6B35;
    font-weight: 700;
  }
  .date-current {
    display: flex;
    align-items: center;
    gap: 8px;
    .date-text {
      font-size: 18px;
      font-weight: 700;
      color: #fff;
    }
    .date-change {
      font-size: 12px;
      color: #a0a0c0;
    }
  }
}

.daily-ranking {
  margin: 8px 16px;
  background: #16213e;
  border-radius: 16px;
  padding: 16px;
}

.daily-header {
  .daily-title {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    display: block;
    margin-bottom: 16px;
  }
}

.daily-row {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  gap: 12px;

  &:last-child { border-bottom: none; }

  .rank-col {
    width: 32px;
    text-align: center;
    .rank-medal {
      font-size: 22px;
    }
    .rank-num {
      font-size: 14px;
      font-weight: 700;
      color: #a0a0c0;
    }
  }

  .player-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    .avatar-text {
      font-size: 14px;
      font-weight: 700;
      color: #fff;
    }
  }

  .player-info {
    flex: 1;
    .player-name {
      font-size: 15px;
      font-weight: 600;
      color: #fff;
      display: block;
    }
    .player-desc {
      font-size: 12px;
      color: #a0a0c0;
      display: block;
      margin-top: 2px;
    }
  }

  .score-col {
    text-align: right;
    .score-num {
      font-size: 20px;
      font-weight: 800;
      color: #FFD166;
      &.zero { color: #6c6c8a; }
      &.negative { color: #ff4444; }
    }
    .score-unit {
      font-size: 12px;
      color: #6c6c8a;
      margin-left: 2px;
    }
  }
}

.date-stats {
  display: flex;
  justify-content: space-between;
  padding: 12px 0 0;
  margin-top: 8px;
  border-top: 1px solid rgba(255,255,255,0.06);
  .stats-text {
    font-size: 12px;
    color: #6c6c8a;
  }
}

.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 16px;
  .no-data-icon { font-size: 48px; margin-bottom: 12px; }
  .no-data-text { font-size: 16px; color: #6c6c8a; }
}
</style>
