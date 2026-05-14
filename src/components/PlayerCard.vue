<template>
  <view
    class="player-card"
    :class="{
      'is-lazy-king': isLazyKing,
      'is-champion': isChampion,
      'top-three': rank <= 3,
    }"
    @tap="$emit('click', $event)"
  >
    <!-- 排名徽章 -->
    <view class="rank-badge">
      <text v-if="rank === 1" class="medal">🥇</text>
      <text v-else-if="rank === 2" class="medal">🥈</text>
      <text v-else-if="rank === 3" class="medal">🥉</text>
      <text v-else class="rank-number">#{{ rank }}</text>
    </view>

    <!-- 选手信息 -->
    <view class="player-info">
      <text class="player-name">{{ name }}</text>

      <!-- 称号标签 -->
      <view class="tags">
        <view v-if="isLazyKing" class="tag tag-lazy-king">
          <text>👑 懒觉王</text>
        </view>
        <view v-if="isChampion" class="tag tag-champion">
          <text>🏅 积分王</text>
        </view>
      </view>
    </view>

    <!-- 积分 -->
    <view class="player-score">
      <text class="score-value">{{ score }}</text>
      <text class="score-label">分</text>
    </view>
  </view>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
  rank: {
    type: Number,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  isLazyKing: {
    type: Boolean,
    default: false,
  },
  isChampion: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["click"]);
</script>

<style lang="scss" scoped>
.player-card {
  display: flex;
  align-items: center;
  background: #16213e;
  border-radius: 12px;
  padding: 16px;
  margin: 6px 16px;
  transition: all 0.2s ease;
  position: relative;

  &:active {
    transform: scale(0.98);
  }

  &.top-three {
    border-left: 3px solid #FFD700;
    background: linear-gradient(135deg, #16213e, #1a2a4e);
  }

  &.is-lazy-king {
    box-shadow: 0 0 20px rgba(255, 107, 53, 0.2);
    border: 1px solid rgba(255, 107, 53, 0.3);
  }

  &.is-champion {
    box-shadow: 0 0 20px rgba(46, 196, 182, 0.2);
    border: 1px solid rgba(46, 196, 182, 0.3);
  }
}

.rank-badge {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;

  .medal {
    font-size: 28px;
  }

  .rank-number {
    font-size: 18px;
    font-weight: 800;
    color: #FF6B35;
  }
}

.player-info {
  flex: 1;
  min-width: 0;

  .player-name {
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tags {
    display: flex;
    gap: 6px;
    margin-top: 4px;
    flex-wrap: wrap;
  }

  .tag {
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 10px;
    display: inline-flex;
    align-items: center;

    &-lazy-king {
      background: rgba(255, 107, 53, 0.15);
      color: #FF6B35;
    }

    &-champion {
      background: rgba(46, 196, 182, 0.15);
      color: #2EC4B6;
    }
  }
}

.player-score {
  text-align: right;
  flex-shrink: 0;
  margin-left: 12px;

  .score-value {
    font-size: 22px;
    font-weight: 800;
    color: #FFD166;
  }

  .score-label {
    font-size: 12px;
    color: #6c6c8a;
    margin-left: 2px;
  }
}
</style>
