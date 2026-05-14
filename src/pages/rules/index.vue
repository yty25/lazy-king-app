<template>
  <view class="page-rules">
    <view class="page-title">
      <text class="title-main">📖 规则</text>
      <text class="title-sub">懒觉王比赛完整规则手册</text>
    </view>

    <!-- 版本化规则 -->
    <view class="section">
      <view class="section-title-row">
        <text class="section-icon">📋</text>
        <text class="section-title">打卡规则</text>
      </view>

      <view
        v-for="(ver, i) in store.rules?.versions || []"
        :key="ver.version"
        class="rule-card"
        :class="{ active: expandedVersion === i }"
        @tap="toggleVersion(i)"
      >
        <view class="rule-header">
          <view class="rule-version-badge">
            <text class="badge-text">{{ ver.version }}</text>
          </view>
          <text class="rule-title">{{ ver.title }}</text>
          <text class="rule-arrow">{{ expandedVersion === i ? '▼' : '▶' }}</text>
        </view>
        <view v-if="expandedVersion === i" class="rule-body">
          <text class="rule-content">{{ ver.content }}</text>
          <text v-if="ver.detail" class="rule-detail">{{ ver.detail }}</text>
        </view>
      </view>
    </view>

    <!-- 补充规则 -->
    <view class="section">
      <view class="section-title-row">
        <text class="section-icon">📌</text>
        <text class="section-title">补充说明</text>
      </view>
      <view class="supplement-list">
        <view v-for="(sup, i) in store.rules?.supplements || []" :key="i" class="supplement-item">
          <text class="supplement-dot">•</text>
          <text class="supplement-text">{{ sup }}</text>
        </view>
      </view>
      <view class="final-note">
        <text class="final-note-text">📜 本比赛最终解释权归专业团队主管Kyle Chen所有。</text>
      </view>
    </view>

    <!-- 奖惩机制 -->
    <view class="section">
      <view class="section-title-row">
        <text class="section-icon">🎯</text>
        <text class="section-title">奖惩机制</text>
      </view>

      <view class="penalty-grid">
        <view v-for="p in store.rules?.penalties || []" :key="p.id" class="penalty-card">
          <text class="penalty-emoji">
            {{ p.id === 1 ? '🎤' : p.id === 2 ? '💰' : p.id === 3 ? '📚' : p.id === 4 ? '🏃' : p.id === 5 ? '📱' : p.id === 6 ? '☀️' : '🎁' }}
          </text>
          <text class="penalty-name">{{ p.name }}</text>
          <text class="penalty-proposer">提议: {{ p.proposedBy || '集体' }}</text>
          <text class="penalty-desc">{{ p.description }}</text>
        </view>
      </view>

      <!-- P1~P6称谓 -->
      <view class="title-list">
        <text class="title-list-title">P1~P6 赛季称号</text>
        <view class="title-grid">
          <view v-for="r in store.rules?.rewards || []" :key="r.rank" class="title-item">
            <text class="title-rank">{{ r.rank }}</text>
            <text class="title-name">{{ r.title }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 道具卡百科 -->
    <view class="section">
      <view class="section-title-row">
        <text class="section-icon">🃏</text>
        <text class="section-title">道具卡百科</text>
      </view>

      <view v-for="prop in store.rules?.props || []" :key="prop.name" class="prop-card">
        <view class="prop-header">
          <text class="prop-name">🃏 {{ prop.name }}</text>
          <view class="prop-rating" :class="getRatingClass(prop.rating)">
            <text>{{ prop.rating }}</text>
          </view>
        </view>
        <text class="prop-desc">{{ prop.description }}</text>
        <view class="prop-rules">
          <text v-for="(rule, ri) in (prop.rules || [])" :key="ri" class="prop-rule">
            • {{ rule }}
          </text>
        </view>
      </view>
    </view>

    <!-- 懒觉王殿堂 -->
    <view class="section">
      <view class="section-title-row">
        <text class="section-icon">👑</text>
        <text class="section-title">懒觉王殿堂</text>
      </view>

      <view class="hall-header">
        <view class="hall-stat">
          <text class="stat-number">{{ store.rules?.lazyKingHall?.totalWeeks || 0 }}</text>
          <text class="stat-label">总周数</text>
        </view>
        <view class="hall-stat highlight">
          <text class="stat-number">{{ store.rules?.lazyKingHall?.mostLazyCount || 0 }}</text>
          <text class="stat-label">次懒觉王</text>
        </view>
        <view class="hall-stat">
          <text class="stat-number">{{ store.rules?.lazyKingHall?.mostLazyKing || '' }}</text>
          <text class="stat-label">最多懒觉</text>
        </view>
      </view>

      <view class="hall-list">
        <view
          v-for="(champ, i) in displayedChampions"
          :key="champ.week"
          class="hall-item"
          @tap="openLink(champ.link)"
        >
          <text class="hall-week">{{ champ.week }}</text>
          <view class="hall-player">
            <text class="hall-name">{{ champ.name }}</text>
            <text class="hall-penalty">{{ champ.penalty }}</text>
          </view>
          <text v-if="champ.link" class="hall-link">🎵</text>
        </view>
      </view>
      <view v-if="showAllWeeks < totalWeeks" class="hall-more" @tap="showMoreWeeks">
        <text class="more-text">查看更多 ({{ showAllWeeks }}/{{ totalWeeks }})</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRankingStore } from '@/store'

const store = useRankingStore()

const expandedVersion = ref(0)
const showAllWeeks = ref(10)

const totalWeeks = computed(() => store.rules?.lazyKingHall?.weeklyChampions?.length || 0)
const displayedChampions = computed(() => {
  return (store.rules?.lazyKingHall?.weeklyChampions || []).slice(0, showAllWeeks.value)
})

function toggleVersion(i) {
  expandedVersion.value = expandedVersion.value === i ? -1 : i
}

function showMoreWeeks() {
  showAllWeeks.value += 20
}

function getRatingClass(rating) {
  if (!rating) return ''
  if (rating.includes('T0')) return 'rating-t0'
  if (rating.includes('看脸')) return 'rating-luck'
  return 'rating-normal'
}

function openLink(link) {
  if (!link) return
  uni.setClipboardData({
    data: link,
    success: () => uni.showToast({ title: '链接已复制', icon: 'success' })
  })
}


</script>

<style lang="scss" scoped>
.page-rules {
  min-height: 100vh;
  padding-bottom: 40px;
}

.page-title {
  padding: 20px 16px 12px;
  text-align: center;
  .title-main { font-size: 22px; font-weight: 700; color: #fff; display: block; }
  .title-sub { font-size: 13px; color: #a0a0c0; margin-top: 4px; display: block; }
}

.section {
  margin: 8px 16px 20px;
}

.section-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  .section-icon { font-size: 20px; }
  .section-title { font-size: 18px; font-weight: 700; color: #fff; }
}

// 版本规则
.rule-card {
  background: #16213e;
  border-radius: 12px;
  margin-bottom: 8px;
  overflow: hidden;
  &.active {
    border: 1px solid rgba(255, 107, 53, 0.3);
  }
  .rule-header {
    display: flex;
    align-items: center;
    padding: 14px 16px;
    gap: 10px;
  }
  .rule-version-badge {
    background: #FF6B35;
    padding: 2px 10px;
    border-radius: 6px;
    .badge-text { font-size: 12px; font-weight: 700; color: #fff; }
  }
  .rule-title { flex: 1; font-size: 15px; font-weight: 600; color: #fff; }
  .rule-arrow { font-size: 12px; color: #6c6c8a; }
  .rule-body {
    padding: 0 16px 14px;
  }
  .rule-content { font-size: 14px; color: #c0c0d0; line-height: 1.6; display: block; }
  .rule-detail { font-size: 13px; color: #FFD166; margin-top: 8px; display: block; }
}

// 补充说明
.supplement-list {
  background: #16213e;
  border-radius: 12px;
  padding: 16px;
  .supplement-item {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
    &:last-child { margin-bottom: 0; }
    .supplement-dot { color: #FF6B35; font-size: 14px; flex-shrink: 0; }
    .supplement-text { font-size: 13px; color: #c0c0d0; line-height: 1.5; }
  }
}
.final-note {
  margin-top: 10px;
  .final-note-text { font-size: 13px; color: #FFD166; font-weight: 600; }
}

// 惩罚
.penalty-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.penalty-card {
  background: #16213e;
  border-radius: 12px;
  padding: 14px;
  text-align: center;
  .penalty-emoji { font-size: 28px; display: block; margin-bottom: 6px; }
  .penalty-name { font-size: 14px; font-weight: 700; color: #fff; display: block; }
  .penalty-proposer { font-size: 11px; color: #6c6c8a; display: block; margin: 2px 0; }
  .penalty-desc { font-size: 12px; color: #a0a0c0; line-height: 1.4; display: block; margin-top: 4px; }
}

// 称号
.title-list {
  margin-top: 16px;
  .title-list-title { font-size: 15px; font-weight: 600; color: #fff; display: block; margin-bottom: 8px; }
}
.title-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 6px;
}
.title-item {
  background: #16213e;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  .title-rank { font-size: 12px; color: #FF6B35; font-weight: 700; display: block; }
  .title-name { font-size: 13px; color: #fff; display: block; margin-top: 2px; }
}

// 道具卡
.prop-card {
  background: #16213e;
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 8px;
  .prop-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    .prop-name { font-size: 15px; font-weight: 700; color: #fff; }
    .prop-rating {
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 8px;
      &.rating-t0 { background: rgba(255, 107, 53, 0.2); color: #FF6B35; }
      &.rating-luck { background: rgba(46, 196, 182, 0.2); color: #2EC4B6; }
      &.rating-normal { background: rgba(255, 209, 102, 0.2); color: #FFD166; }
    }
  }
  .prop-desc { font-size: 13px; color: #c0c0d0; display: block; margin-bottom: 8px; }
  .prop-rules {
    .prop-rule { font-size: 12px; color: #6c6c8a; display: block; line-height: 1.8; }
  }
}

// 懒觉王殿堂
.hall-header {
  display: flex;
  justify-content: space-around;
  background: linear-gradient(135deg, #2a1f2e, #1a1a2e);
  border: 1px solid rgba(255, 107, 53, 0.3);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 12px;
  .hall-stat {
    text-align: center;
    &.highlight { .stat-number { color: #FF6B35; } }
    .stat-number { font-size: 20px; font-weight: 800; color: #FFD166; display: block; }
    .stat-label { font-size: 11px; color: #6c6c8a; display: block; margin-top: 4px; }
  }
}
.hall-list {
  background: #16213e;
  border-radius: 12px;
  padding: 8px 0;
}
.hall-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  gap: 12px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  &:last-child { border-bottom: none; }
  .hall-week { font-size: 12px; color: #6c6c8a; min-width: 90px; }
  .hall-player { flex: 1; }
  .hall-name { font-size: 14px; font-weight: 600; color: #fff; }
  .hall-penalty { font-size: 12px; color: #a0a0c0; margin-left: 6px; }
  .hall-link { font-size: 16px; }
}
.hall-more {
  text-align: center;
  padding: 12px;
  .more-text { font-size: 14px; color: #FF6B35; }
}
</style>
