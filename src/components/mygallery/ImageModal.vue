<template>
  <div class="imageModal">
    <img :src="image.imageUrl" :alt="image.caption" />
    <p>{{ image.caption }}</p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  image: Object
})
</script>

<style scoped lang="scss">
.imageModal {
  max-width: 80vw;
  max-height: 80vh;
  text-align: center;

  img {
    max-width: 100%;
    max-height: 60vh;
    object-fit: contain;
  }

  &__caption {
    margin-top: 10px;
    color: #333;
  }
}
</style>
