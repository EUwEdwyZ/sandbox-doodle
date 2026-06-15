<template>
  <ul :class="ulClass">
    <li
      v-for="(link, index) in sanitizedLists"
      :key="index"
      :class="liClass"
    >
    <!-- linkの有無は選択可能 -->
      <a
        v-if="useLink && link.useLink !== false"
        :href="link.href"
        :class="textClass"
        :target="link.blank ? '_blank' : null"
        :rel="link.blank ? 'noopener noreferrer' : null"
      >
        {{ link.label }}
      </a>
      <span
        v-else
        :class="textClass"
        v-html="link.safeLabel"
      >
      </span>
      <slot />
    </li>
  </ul>
  </template>


<script setup>
  import { computed } from 'vue';
  import DOMPurify from 'dompurify';

  const props = defineProps({
    lists: {
      type: Array,
      required: true
    },
    useLink: { // defaultでは必須
      type: Boolean,
      required: false,
      default: true
    },
    ulClass: {
      type: String,
      required: false,
      default: ''
    },
    liClass: {
      type: String,
      required: false,
      default: ''
    },
    textClass: {
      type: String,
      required: false,
      default: ''
    },
  });

  // 各リストのlabelを改行を<br>に変換してsanitizeするcomputed
  const sanitizedLists = computed(() => {
    return props.lists.map(item => {
      const replaced = item.label.replace(/\n/g, '<br>');
      return {
        ...item,
        safeLabel: DOMPurify.sanitize(replaced)
      };
    });
  });

</script>
