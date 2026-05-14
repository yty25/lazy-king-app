<template>
  <view class="page-ranking">
    <!-- Tab切换 -->
    <TabToggle :tabs="tabs" :activeIndex="store.currentRankingTab" @change="onTabChange" />

    <!-- 加载状态 -->
    <view v-if="store.isLoading" class="loading">
      <text class="loading-text">数据加载中...</text>
    </view>

    <!-- ============ 年度排行 ============ -->
    <view v-show="store.currentRankingTab === 0 && !store.isLoading" class="ranking-section">
      <view class="section-header">
        <text class="section-title">🏆 2025年度总排行</text>
        <text class="section-sub">年度懒觉王: {{ store.annualLazyKing?.name || '-' }}</text>
      </view>
      <RankingList
        :players="store.annualRanking"
        type="annual"
        @click="onPlayerClick"
      />
    </view>

    <!-- ============ 季度排行 ============ -->
    <view v-show="store.currentRankingTab === 1 && !store.isLoading" class="ranking-section">
      <view class="quarter-selector">
        <view
          v-for="(q, i) in store.quarters"
          :key="q.quarter"
          class="quarter-tab"
          :class="{ active: store.selectedQuarter === i }"
          @tap="selectQuarter(i)"
        >
          <text class="quarter-label">{{ formatQuarter(q.quarter) }}</text>
          <text class="quarter-theme" v-if="q.theme">{{ q.theme }}</text>
        </view>
      </view>

      <view class="section-header">
        <text class="section-title">📅 {{ formatQuarter(store.quarters[store.selectedQuarter]?.quarter) }}排行</text>
        <text class="section-sub">懒觉王: {{ findLazyKing(store.selectedQuarterData) }}</text>
      </view>
      <RankingList
        :players="store.selectedQuarterData"
        type="quarterly"
      />
    </view>

    <!-- ============ 周度排行 ============ -->
    <view v-show="store.currentRankingTab === 2 && !store.isLoading" class="ranking-section">
      <view class="week-selector">
        <view class="week-nav" @tap="prevWeek">
          <text class="nav-arrow">‹</text>
        </view>
        <view class="week-info">
          <text class="week-label">{{ store.weeks[store.selectedWeek]?.week || '' }}</text>
          <text class="week-theme" v-if="store.weeks[store.selectedWeek]?.theme">{{ store.weeks[store.selectedWeek].theme }}</text>
        </view>
        <view class="week-nav" @tap="nextWeek">
          <text class="nav-arrow">›</text>
        </view>
      </view>

      <!-- 周懒觉王卡片 -->
      <view v-if="store.weeks[store.selectedWeek]" class="lazy-king-card">
        <view class="lk-header">
          <text class="lk-title">👑 本周懒觉王</text>
          <view class="lk-penalty-status" :class="{ done: isPenaltyDone }">
            <text>{{ isPenaltyDone ? '✅ 已执行' : '❌ 未执行' }}</text>
          </view>
        </view>
        <view class="lk-body">
          <text class="lk-name">{{ store.weeks[store.selectedWeek].lazyKing }}</text>
          <text class="lk-penalty">{{ store.weeks[store.selectedWeek].penalty }}</text>
        </view>
        <view
          v-if="isPenaltyDone && store.weeks[store.selectedWeek].penaltyLink"
          class="lk-link"
          @tap="openLink(store.weeks[store.selectedWeek].penaltyLink)"
        >
          <text class="lk-link-text">🎵 点击查看作品</text>
        </view>
      </view>

      <RankingList
        :players="selectedWeekRanking"
        type="weekly"
      />
    </view>
  </view>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRankingStore } from '@/store'
import TabToggle from '@/components/TabToggle.vue'
import RankingList from '@/components/RankingList.vue'

const store = useRankingStore()

const tabs = ['年度排行', '季度排行', '周度排行']

const isPenaltyDone = computed(() => {
  const w = store.weeks[store.selectedWeek]
  if (!w) return false
  if (!w.penalty) return false
  return w.penalty !== '欠着' && !!w.penaltyLink
})

const selectedWeekRanking = computed(() => {
  const w = store.weeks[store.selectedWeek]
  if (!w || !w.members) return []
  const entries = Object.entries(w.members)
    .map(([id, score]) => ({ id, name: store.getName(id), score }))
    .sort((a, b) => b.score - a.score)
  return entries.map((item, i) => ({
    ...item,
    rank: i + 1,
    isChampion: i === 0,
    isLazyKing: item.name === w.lazyKing || item.id === w.lazyKing?.toLowerCase?.()
  }))
})

function onTabChange(index) {
  store.currentRankingTab = index
}

function selectQuarter(i) {
  store.selectedQuarter = i
}

function prevWeek() {
  if (store.selectedWeek > 0) store.selectedWeek--
}

function nextWeek() {
  if (store.selectedWeek < store.weeks.length - 1) store.selectedWeek++
}

function findLazyKing(players) {
  const lk = players.find(p => p.isLazyKing)
  return lk?.name || '-'
}

function formatQuarter(q) {
  if (!q) return ''
  return q.replace('Q', ' Q')
}

function openLink(url) {
  if (!url) return
  // 小程序内不支持直接跳转外链，先复制到剪贴板
  uni.setClipboardData({
    data: url,
    success: () => {
      uni.showToast({ title: '链接已复制', icon: 'success' })
    }
  })
}

function onPlayerClick(player) {
  // 预留：点击选手弹出详情
}

onMounted(() => {
  if (store.weeklyData.weeks?.length === 0) {
    store.fetchAllData()
  }
})
</script>

<style lang="scss" scoped>
.page-ranking {
  min-height: 100vh;
  padding-bottom: 40px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 0;
  .loading-text {
    color: #a0a0c0;
    font-size: 16px;
  }
}

.ranking-section {
  margin-top: 8px;
}

.section-header {
  padding: 16px 16px 8px;
  .section-title {
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    display: block;
  }
  .section-sub {
    font-size: 13px;
    color: #FF6B35;
    margin-top: 4px;
    display: block;
  }
}

// 季度选择器
.quarter-selector {
  display: flex;
  padding: 8px 12px;
  gap: 8px;
  overflow-x: auto;
  .quarter-tab {
    flex-shrink: 0;
    padding: 8px 16px;
    background: #16213e;
    border-radius: 10px;
    text-align: center;
    min-width: 80px;
    &.active {
      background: #FF6B35;
    }
    .quarter-label {
      font-size: 14px;
      font-weight: 600;
      color: #fff;
      display: block;
    }
    .quarter-theme {
      font-size: 11px;
      color: rgba(255,255,255,0.7);
      margin-top: 2px;
      display: block;
    }
  }
}

// 周选择器
.week-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  gap: 16px;
  .week-nav {
    width: 40px;
    height: 40px;
    background: #16213e;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    .nav-arrow {
      font-size: 24px;
      color: #FF6B35;
      font-weight: 700;
    }
  }
  .week-info {
    text-align: center;
    .week-label {
      font-size: 16px;
      font-weight: 700;
      color: #fff;
      display: block;
    }
    .week-theme {
      font-size: 12px;
      color: #a0a0c0;
      margin-top: 2px;
      display: block;
    }
  }
}

// 懒觉王卡片
.lazy-king-card {
  background: linear-gradient(135deg, #2a1f2e, #1a1a2e);
  border: 1px solid rgba(255, 107, 53, 0.3);
  border-radius: 16px;
  margin: 4px 16px 12px;
  padding: 16px;
  .lk-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    .lk-title {
      font-size: 14px;
      color: #FF6B35;
      font-weight: 600;
    }
    .lk-penalty-status {
      font-size: 12px;
      padding: 2px 10px;
      border-radius: 10px;
      background: rgba(255, 0, 0, 0.15);
      color: #ff4444;
      &.done {
        background: rgba(46, 196, 182, 0.15);
        color: #2EC4B6;
      }
    }
  }
  .lk-body {
    margin-bottom: 8px;
    .lk-name {
      font-size: 18px;
      font-weight: 700;
      color: #fff;
      margin-right: 8px;
    }
    .lk-penalty {
      font-size: 14px;
      color: #a0a0c0;
    }
  }
  .lk-link {
    padding: 8px 12px;
    background: rgba(255, 107, 53, 0.1);
    border-radius: 8px;
    text-align: center;
    .lk-link-text {
      font-size: 13px;
      color: #FF6B35;
    }
  }
}
</style>
