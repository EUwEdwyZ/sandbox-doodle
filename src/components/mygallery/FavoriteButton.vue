<template>
  <div class=""
    :class="{ isActive: liked }"
  >
    <BaseButton
      @click="onClick"
      aria-label="いいねボタン"
      padding="favorite"
      textColor="gray"
      bgColor="transparent"
      :class="liked ? 'text-red-500' : ''"
    >
      <span>
        <iconify-icon
          :icon="liked ? 'mdi:heart' : 'mdi:heart-outline'"
        />
      </span>
    </BaseButton>
  </div>
</template>



<script setup>
import BaseButton from '../_global/BaseButton.vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  liked: Boolean,
  index: Number
})

const emit = defineEmits(['toggleLike'])

const onClick = () => {
  emit('toggleLike', props.index)
}
</script>
