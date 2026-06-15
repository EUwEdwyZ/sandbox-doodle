<template>
  <textarea
    class="baseTextarea"
    :name="name"
    :id="id"
    :placeholder="placeholder"
    :rows="rows"
    :cols="cols"
    :value="modelValue"
    @input="onInput"
  >
  </textarea>
</template>


<script setup>
import { computed } from 'vue';
import DOMPurify from 'dompurify';

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    required: false,
    default: '内容を入力',
  },
  rows: {
    type: Number,
    required: false,
    default: 5,
  },
  cols: {
    type: Number,
    required: false,
    default: 30,
  },
  modelValue: {
    type: String,
    required: false,
    default: '',
  },
});

// inputのvalueを親に渡す
const onInput = (e) => {
  emit('update:modelValue', e.target.value)
}

</script>

<style scoped lang="scss">
</style>
