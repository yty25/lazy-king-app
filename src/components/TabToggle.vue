<template>
  <view class="tab-toggle">
    <scroll-view
      class="tab-scroll"
      scroll-x
      :show-scrollbar="false"
    >
      <view class="tab-list">
        <view
          v-for="(tab, index) in tabs"
          :key="index"
          class="tab-item"
          :class="{ active: activeIndex === index }"
          @tap="$emit('change', index)"
        >
          <text class="tab-text">{{ tab }}</text>
          <view v-if="activeIndex === index" class="tab-indicator" />
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
defineProps({
  tabs: {
    type: Array,
    required: true,
  },
  activeIndex: {
    type: Number,
    default: 0,
  },
});

defineEmits(["change"]);
</script>

<style lang="scss" scoped>
.tab-toggle {
  padding: 8px 0;
}

.tab-scroll {
  white-space: nowrap;
}

.tab-list {
  display: flex;
  padding: 0 12px;
  gap: 4px;
}

.tab-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 20px;
  border-radius: 8px;
  transition: all 0.2s ease;
  position: relative;

  &.active {
    background: rgba(255, 107, 53, 0.1);

    .tab-text {
      color: #FF6B35;
      font-weight: 600;
    }
  }
}

.tab-text {
  font-size: 14px;
  color: #a0a0c0;
  transition: color 0.2s;
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  width: 20px;
  height: 3px;
  background: #FF6B35;
  border-radius: 2px;
}
</style>
