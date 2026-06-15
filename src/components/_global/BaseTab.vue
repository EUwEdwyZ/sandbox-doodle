<template>
  <ul class="flex" role="tablist">
    <li
      v-for='tab in tabs'
      :key="tab.id"
      :class="tabStyles({
        status: modelValue === tab.id ? 'active' : 'inactive'
      })"
      :aria-selected="modelValue === tab.id"
      :aria-controls="`tab-panel-${tab.id}`"
      @click="modelValue = tab.id"
      role="tab"
    >
        <span>{{ tab.label }}</span>
    </li>
  </ul>
  <div>
    <div
      v-for='tab in tabs'
      v-show='modelValue === tab.id'
      role="tabpanel"
      :id="`tab-panel-${tab.id}`"
      :aria-labelledby="`tab-trigger-${tab.id}`"
    >
      {{ tab.content }}
  </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { cva } from 'class-variance-authority'

// 親からタブの配列を受け取る
const props = defineProps({
  tabs: {
    type: Array,
    required: true
  }
});

// 親と「現在のタブID」を同期する
const modelValue = defineModel();

const tabStyles = cva(
  // ベース：共通のスタイル
  'flex-1 py-2 px-5 text-center border-2 border-b-blue-950 rounded-tr-lg rounded-tl-lg cursor-pointer hover:opacity-70 transition-colors',
  {
    variants: {
      status: {
        active: 'bg-black text-white pointer-events-none',
        inactive: 'bg-white text-black',
      }
    },
    defaultVariants: {
      status: 'inactive'
    }
  }
)
</script>
