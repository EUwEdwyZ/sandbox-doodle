<template>
  <section
    :class="sectionClass ? `baseSectionSet--${sectionClass}` : ''"
  >
    <div class="max-w-240 w-full mx-auto px-5">
      <h2 class="pb-1 border-b-1 border-current font-bold">{{ title }}</h2>
      <div class="mt-5">
        <slot />
      </div>
    </div>
  </section>
</template>


<script setup>
const props = defineProps({
  sectionClass: {
    type: String,
    required: false,
    default: '',
  },
  title: {
    type: String,
    required: true
  },
})
</script>
