<template>
  <div class="mb-3 bg-white border border-gray-200 rounded-sm">
    <div class="flex justify-between items-center p-3">
      <h2 class="text-sx">フィルター中：{{ props.label }}</h2>
      <div>
        <BaseButton @click="$emit('clearFilter')"><iconify-icon icon="mdi:refresh" style="margin-right: 0.3rem;"></iconify-icon>すべての投稿を表示</BaseButton>
      </div>
    </div>
  </div>
</template>


<script setup>
import BaseButton from '../_global/BaseButton.vue';

const props = defineProps({
    label: {
      type: String,
      required: true
    }
  })

  const emit = defineEmits(['clearFilter'])
</script>
