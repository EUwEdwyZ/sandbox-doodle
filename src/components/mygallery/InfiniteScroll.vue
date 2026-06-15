<template>
  <slot />
  <div class="loading-zone">
    <div
      v-if="!hasMore && showEndMessage"
      class="end-message"
    >
      もうこれ以上ありません
    </div>
  </div>
</template>


<script setup>
import { onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  // 親から渡してもらう
  loading: Boolean,
  hasMore: Boolean,
  showEndMessage: Boolean
})

const emit = defineEmits(['loadMore'])

const handleScroll = () => {
  if (props.loading || !props.hasMore) return

  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const windowHeight = window.innerHeight
  const fullHeight = document.documentElement.scrollHeight

  if (scrollTop + windowHeight >= fullHeight - 200) {
    emit('loadMore')
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.loading-zone {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
