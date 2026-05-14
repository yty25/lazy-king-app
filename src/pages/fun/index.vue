<template>
  <view class="page-fun">
    <view class="page-title">
      <text class="title-main">🎮 娱乐</text>
      <text class="title-sub">赛事记录 · 作品墙 · 数据彩蛋</text>
    </view>

    <view v-if="!store.events?.lolTournament" class="loading">
      <text>加载中...</text>
    </view>

    <!-- ============ 惩罚作品墙 ============ -->
    <view class="section">
      <view class="section-title-row">
        <text class="section-icon">🎤</text>
        <text class="section-title">惩罚作品墙</text>
      </view>

      <!-- 按人筛选 -->
      <view class="filter-bar">
        <view
          v-for="(u, i) in store.users"
          :key="u.id"
          class="filter-tag"
          :class="{ active: activeFilter === u.id }"
          :style="{ borderColor: u.color }"
          @tap="activeFilter = activeFilter === u.id ? '' : u.id"
        >
          <text>{{ u.name }}</text>
        </view>
      </view>

      <view class="works-grid">
        <view
          v-for="(week, i) in filteredWorks"
          :key="i"
          class="work-card"
          :style="{ '--accent': getPlayerColor(week.name) }"
          @tap="openLink(week.link)"
        >
          <view class="work-top">
            <view class="work-avatar" :style="{ background: getPlayerColor(week.name) }">
              <text class="work-avatar-text">{{ getAvatarFromName(week.name) }}</text>
            </view>
            <text class="work-player">{{ week.name }}</text>
          </view>
          <text class="work-penalty">{{ week.penalty }}</text>
          <text class="work-week">{{ week.week }}</text>
          <view v-if="week.link" class="work-play">
            <text>▶</text>
          </view>
          <view v-else class="work-pending">
            <text>未执行</text>
          </view>
        </view>
      </view>
    </view>

    <!-- ============ LOL Solo赛 ============ -->
    <view class="section">
      <view class="section-title-row">
        <text class="section-icon">🎮</text>
        <text class="section-title">LOLm SOLO王锦标赛</text>
      </view>

      <view class="tournament-header">
        <text class="tournament-title">{{ store.events?.lolTournament?.title }}</text>
        <text class="tournament-exhibition" v-if="store.events?.lolTournament?.exhibition">
          表演赛: {{ store.events.lolTournament.exhibition }}
        </text>
      </view>

      <!-- 最终排名 -->
      <view class="final-rank">
        <view class="final-header">
          <text>🏆 最终排名</text>
        </view>
        <view class="podium">
          <view class="podium-item second">
            <text class="podium-emoji">🥈</text>
            <text class="podium-name">{{ store.events?.lolTournament?.ranking?.runnerUp }}</text>
          </view>
          <view class="podium-item first">
            <text class="podium-emoji">🥇</text>
            <text class="podium-name">{{ store.events?.lolTournament?.ranking?.champion }}</text>
          </view>
          <view class="podium-item third">
            <text class="podium-emoji">🥉</text>
            <text class="podium-name">{{ store.events?.lolTournament?.ranking?.third }}</text>
          </view>
        </view>
        <view class="reward-note" v-if="store.events?.lolTournament?.reward">
          <text>{{ store.events.lolTournament.reward }}</text>
        </view>
      </view>

      <!-- 小组赛 -->
      <view class="match-section">
        <text class="match-section-title">小组赛</text>
        <view v-for="g in (store.events?.lolTournament?.groups || [])" :key="g.group" class="match-card">
          <text class="match-group">{{ g.group }}组</text>
          <text class="match-players">{{ g.player1 }} vs {{ g.player2 }}</text>
          <text class="match-result">{{ g.result }}</text>
          <text class="match-winner">→ {{ g.winner }}</text>
        </view>
      </view>

      <!-- 淘汰赛 -->
      <view class="bracket-section">
        <text class="match-section-title">双败赛 · 胜者组</text>
        <view v-for="(m, i) in (store.events?.lolTournament?.winnerBracket || [])" :key="i" class="match-card-mini">
          <text class="match-players">{{ m.player1 }} vs {{ m.player2 }}</text>
          <text class="match-result">{{ m.result }}</text>
          <text class="match-winner">{{ m.winner }}胜</text>
        </view>
      </view>

      <view class="bracket-section">
        <text class="match-section-title">双败赛 · 败者组</text>
        <view v-for="(m, i) in (store.events?.lolTournament?.loserBracket || [])" :key="i" class="match-card-mini">
          <text class="match-players">{{ m.player1 }} vs {{ m.player2 }}</text>
          <text class="match-result">{{ m.result }}</text>
          <text class="match-winner">{{ m.winner }}胜</text>
        </view>
      </view>

      <view class="bracket-section">
        <text class="match-section-title">淘汰赛</text>
        <view v-for="m in (store.events?.lolTournament?.knockout || [])" :key="m.round" class="match-card-mini">
          <text class="match-round">{{ m.round }}</text>
          <text class="match-players">{{ m.player1 }} vs {{ m.player2 }}</text>
          <text class="match-result">{{ m.result }}</text>
          <text class="match-winner">{{ m.winner }}胜</text>
        </view>
      </view>

      <!-- 决赛 -->
      <view class="final-match" v-if="store.events?.lolTournament?.final">
        <text class="final-match-title">🏆 决赛</text>
        <text class="final-match-players">{{ store.events.lolTournament.final.player1 }} vs {{ store.events.lolTournament.final.player2 }}</text>
        <text class="final-match-result">{{ store.events.lolTournament.final.result }}</text>
        <text class="final-champion">👑 冠军: {{ store.events.lolTournament.final.winner }}</text>
      </view>
    </view>

    <!-- ============ 赌怪大赛 ============ -->
    <view class="section">
      <view class="section-title-row">
        <text class="section-icon">🃏</text>
        <text class="section-title">赌怪大赛</text>
      </view>

      <view class="poker-card">
        <view class="poker-header">
          <text class="poker-title">{{ store.events?.pokerTournament?.title }}</text>
          <text class="poker-game">{{ store.events?.pokerTournament?.game }} · {{ store.events?.pokerTournament?.rounds }}局</text>
        </view>
        <view class="poker-winner">
          <text class="poker-winner-label">🏆 大赢家</text>
          <text class="poker-winner-name">{{ store.events?.pokerTournament?.winner }}</text>
          <text class="poker-winner-score">+{{ getWinnerScore() }}分</text>
        </view>
        <view class="poker-results">
          <view
            v-for="([id, score], i) in pokerResults"
            :key="id"
            class="poker-row"
            :class="{ winner: score > 0, loser: score < 0 }"
          >
            <text class="poker-rank">{{ i + 1 }}</text>
            <view class="poker-avatar" :style="{ background: store.getColor(id) }">
              <text>{{ store.getAvatar(id) }}</text>
            </view>
            <text class="poker-name">{{ store.getName(id) }}</text>
            <text class="poker-score" :class="{ plus: score > 0, minus: score < 0 }">
              {{ score > 0 ? '+' : '' }}{{ score }}
            </text>
          </view>
        </view>
      </view>
    </view>

    <!-- ============ 数据彩蛋 ============ -->
    <view class="section">
      <view class="section-title-row">
        <text class="section-icon">🥚</text>
        <text class="section-title">数据彩蛋</text>
      </view>

      <view class="eggs-grid">
        <view class="egg-card">
          <text class="egg-emoji">👑</text>
          <text class="egg-label">最多懒觉王</text>
          <text class="egg-value">ISSAC</text>
          <text class="egg-desc">27次 (无人能敌)</text>
        </view>
        <view class="egg-card">
          <text class="egg-emoji">🏆</text>
          <text class="egg-label">年度积分王</text>
          <text class="egg-value">YTY</text>
          <text class="egg-desc">2056分</text>
        </view>
        <view class="egg-card">
          <text class="egg-emoji">🎤</text>
          <text class="egg-label">最火曲目</text>
          <text class="egg-value">大展鸿图</text>
          <text class="egg-desc">2人翻唱过</text>
        </view>
        <view class="egg-card">
          <text class="egg-emoji">🃏</text>
          <text class="egg-label">赌怪冠军</text>
          <text class="egg-value">YTY</text>
          <text class="egg-desc">+54分 (大收割)</text>
        </view>
        <view class="egg-card">
          <text class="egg-emoji">💸</text>
          <text class="egg-label">破产兄弟</text>
          <text class="egg-value">Kyle/宝宣</text>
          <text class="egg-desc">赌怪各输30分</text>
        </view>
        <view class="egg-card">
          <text class="egg-emoji">🎮</text>
          <text class="egg-label">LOL冠军</text>
          <text class="egg-value">ISSAC</text>
          <text class="egg-desc">电竞不懒</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRankingStore } from '@/store'

const store = useRankingStore()
const activeFilter = ref('')

const filteredWorks = computed(() => {
  const all = store.rules?.lazyKingHall?.weeklyChampions || []
  if (!activeFilter.value) return all
  return all.filter(w => {
    const name = w.name.toLowerCase()
    const userId = activeFilter.value
    const user = store.usersMap[userId]
    return name.includes(user?.name?.toLowerCase() || userId)
  })
})

const pokerResults = computed(() => {
  const r = store.events?.pokerTournament?.results
  if (!r) return []
  return Object.entries(r).sort((a, b) => b[1] - a[1])
})

function getWinnerScore() {
  const r = store.events?.pokerTournament?.results
  if (!r) return 0
  return Math.max(...Object.values(r))
}

function getPlayerColor(name) {
  if (!name) return '#666'
  const lower = name.toLowerCase()
  const user = store.usersMap[lower]
  return user?.color || '#666'
}

function getAvatarFromName(name) {
  if (!name) return '?'
  const lower = name.toLowerCase()
  const user = store.usersMap[lower]
  return user?.avatar || name[0]?.toUpperCase() || '?'
}

function openLink(link) {
  if (!link) return
  uni.setClipboardData({
    data: link,
    success: () => uni.showToast({ title: '链接已复制', icon: 'success' })
  })
}

onMounted(() => {
  if (!store.events?.lolTournament) {
    store.fetchAllData()
  }
})
</script>

<style lang="scss" scoped>
.page-fun {
  min-height: 100vh;
  padding-bottom: 40px;
}

.page-title {
  padding: 20px 16px 12px;
  text-align: center;
  .title-main { font-size: 22px; font-weight: 700; color: #fff; display: block; }
  .title-sub { font-size: 13px; color: #a0a0c0; margin-top: 4px; display: block; }
}

.loading { text-align: center; padding: 60px 0; color: #a0a0c0; }

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

// 作品墙
.filter-bar {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 12px;
  .filter-tag {
    padding: 4px 14px;
    border-radius: 16px;
    border: 1px solid #333;
    font-size: 13px;
    color: #a0a0c0;
    flex-shrink: 0;
    &.active {
      background: rgba(255,107,53,0.15);
      color: #FF6B35;
      border-color: #FF6B35;
    }
  }
}

.works-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.work-card {
  background: #16213e;
  border-radius: 12px;
  padding: 14px;
  border-left: 3px solid var(--accent, #666);
  .work-top {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }
  .work-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    .work-avatar-text { font-size: 12px; font-weight: 700; color: #fff; }
  }
  .work-player { font-size: 14px; font-weight: 600; color: #fff; }
  .work-penalty { font-size: 13px; color: #c0c0d0; display: block; margin-bottom: 4px; }
  .work-week { font-size: 11px; color: #6c6c8a; display: block; margin-bottom: 6px; }
  .work-play { text-align: center; background: rgba(255,107,53,0.1); border-radius: 6px; padding: 4px; font-size: 16px; color: #FF6B35; }
  .work-pending { text-align: center; font-size: 12px; color: #6c6c8a; }
}

// 赛事
.tournament-header {
  background: linear-gradient(135deg, #16213e, #1a2a4e);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  margin-bottom: 12px;
  .tournament-title { font-size: 15px; font-weight: 700; color: #fff; display: block; }
  .tournament-exhibition { font-size: 13px; color: #a0a0c0; display: block; margin-top: 6px; }
}

.final-rank {
  background: #16213e;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  .final-header { text-align: center; font-size: 16px; font-weight: 700; color: #FFD166; margin-bottom: 12px; }
}

.podium {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 12px;
  .podium-item {
    text-align: center;
    padding: 12px 16px;
    border-radius: 12px;
    &.first {
      background: rgba(255, 215, 0, 0.1);
      border: 1px solid rgba(255, 215, 0, 0.3);
    }
    &.second {
      background: rgba(192, 192, 192, 0.1);
      border: 1px solid rgba(192, 192, 192, 0.2);
    }
    &.third {
      background: rgba(205, 127, 50, 0.1);
      border: 1px solid rgba(205, 127, 50, 0.2);
    }
    .podium-emoji { font-size: 28px; display: block; }
    .podium-name { font-size: 14px; font-weight: 600; color: #fff; display: block; margin-top: 4px; }
  }
}

.reward-note {
  text-align: center;
  font-size: 12px;
  color: #FFD166;
  margin-top: 10px;
  display: block;
}

.match-section, .bracket-section {
  margin-bottom: 10px;
  .match-section-title { font-size: 14px; font-weight: 600; color: #FF6B35; display: block; margin-bottom: 6px; }
}

.match-card {
  display: flex;
  align-items: center;
  background: #16213e;
  border-radius: 10px;
  padding: 10px 14px;
  margin-bottom: 6px;
  gap: 8px;
  .match-group { font-size: 12px; color: #FF6B35; font-weight: 700; min-width: 36px; }
  .match-players { flex: 1; font-size: 13px; color: #fff; }
  .match-result { font-size: 14px; font-weight: 700; color: #FFD166; }
  .match-winner { font-size: 12px; color: #2EC4B6; }
}

.match-card-mini {
  display: flex;
  align-items: center;
  background: #16213e;
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 4px;
  gap: 8px;
  .match-round { font-size: 12px; color: #6c6c8a; min-width: 48px; }
  .match-players { flex: 1; font-size: 12px; color: #c0c0d0; }
  .match-result { font-size: 13px; font-weight: 600; color: #FFD166; }
  .match-winner { font-size: 11px; color: #2EC4B6; }
}

.final-match {
  background: linear-gradient(135deg, #2a1f2e, #1a1a2e);
  border: 2px solid #FFD700;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  margin-top: 12px;
  .final-match-title { font-size: 16px; font-weight: 700; color: #FFD700; display: block; margin-bottom: 8px; }
  .final-match-players { font-size: 16px; font-weight: 600; color: #fff; display: block; }
  .final-match-result { font-size: 24px; font-weight: 800; color: #FFD166; display: block; margin: 8px 0; }
  .final-champion { font-size: 18px; font-weight: 700; color: #FF6B35; display: block; }
}

// 赌怪
.poker-card {
  background: linear-gradient(135deg, #1a2e1a, #16213e);
  border: 1px solid rgba(46, 196, 182, 0.3);
  border-radius: 16px;
  padding: 16px;
  .poker-header { text-align: center; margin-bottom: 16px; }
  .poker-title { font-size: 16px; font-weight: 700; color: #fff; display: block; }
  .poker-game { font-size: 12px; color: #a0a0c0; display: block; }
}
.poker-winner {
  text-align: center;
  padding: 16px;
  background: rgba(255, 215, 0, 0.05);
  border-radius: 12px;
  margin-bottom: 12px;
  .poker-winner-label { font-size: 12px; color: #FFD166; display: block; }
  .poker-winner-name { font-size: 22px; font-weight: 800; color: #fff; display: block; }
  .poker-winner-score { font-size: 16px; color: #2EC4B6; display: block; }
}
.poker-results {
  .poker-row {
    display: flex;
    align-items: center;
    padding: 8px 0;
    gap: 10px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    &.winner { .poker-name { color: #2EC4B6; } }
    &.loser { .poker-name { color: #ff6b6b; } }
    .poker-rank { font-size: 12px; color: #6c6c8a; width: 20px; }
    .poker-avatar { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; text { font-size: 12px; font-weight: 700; color: #fff; } }
    .poker-name { flex: 1; font-size: 14px; font-weight: 600; }
    .poker-score { font-size: 16px; font-weight: 800; &.plus { color: #2EC4B6; } &.minus { color: #ff4444; } }
  }
}

// 数据彩蛋
.eggs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
}
.egg-card {
  background: #16213e;
  border-radius: 12px;
  padding: 12px;
  text-align: center;
  .egg-emoji { font-size: 28px; display: block; margin-bottom: 4px; }
  .egg-label { font-size: 11px; color: #6c6c8a; display: block; }
  .egg-value { font-size: 16px; font-weight: 800; color: #FFD166; display: block; margin: 4px 0; }
  .egg-desc { font-size: 10px; color: #a0a0c0; display: block; }
}
</style>
