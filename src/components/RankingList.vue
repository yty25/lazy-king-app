<template>
  <view class="ranking-list">
    <!-- 标题 -->
    <view class="list-header">
      <text class="list-title">{{ title }}</text>
      <text class="list-type">
        <text v-if="type === 'annual'">🏆 年度</text>
        <text v-else-if="type === 'quarterly'">📅 季度</text>
        <text v-else>📊 周度</text>
      </text>
    </view>

    <!-- 列表 -->
    <view class="list-body">
      <view v-if="players.length === 0" class="empty">
        <text class="empty-icon">📭</text>
        <text class="empty-text">暂无排行数据</text>
      </view>

      <view v-else class="players">
        <PlayerCard
          v-for="(player, index) in players"
          :key="player.id || index"
          :name="player.name"
          :rank="index + 1"
          :score="player.score"
          :isLazyKing="player.isLazyKing"
          :isChampion="player.isChampion"
          @click="onPlayerClick(player)"
        />
      </view>
    </view>

    <!-- 查看更多 -->
    <view v-if="showMore" class="list-footer" @tap="$emit('showMore')">
      <text class="more-text">查看更多</text>
      <text class="more-icon">→</text>
    </view>
  </view>
</template>

<script setup>
import PlayerCard from "./PlayerCard.vue";

const props = defineProps({
  title: {
    type: String,
    default: "排行榜",
  },
  players: {
    type: Array,
    default: () => [],
  },
  type: {
    type: String,
    default: "annual", // annual | quarterly | weekly
    validator: (value) => ["annual", "quarterly", "weekly"].includes(value),
  },
  showMore: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["showMore"]);

const onPlayerClick = (player) => {
  console.log("Player clicked:", player.name);
};
</script>

<style lang="scss" scoped>
.ranking-list {
  margin-bottom: 16px;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 8px;

  .list-title {
    font-size: 18px;
    font-weight: 700;
    color: #ffffff;
  }

  .list-type {
    font-size: 13px;
    color: #a0a0c0;
  }
}

.list-body {
  min-height: 100px;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  text-align: center;

  .empty-icon {
    font-size: 48px;
    margin-bottom: 12px;
  }

  .empty-text {
    font-size: 16px;
    color: #6c6c8a;
  }
}

.list-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  gap: 4px;

  .more-text {
    font-size: 14px;
    color: #FF6B35;
  }

  .more-icon {
    font-size: 14px;
    color: #FF6B35;
  }
}
</style>
