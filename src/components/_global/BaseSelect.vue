<template>
  <select class="baseSelect"
    :class="selectClass"
    :name="name"
    :id="id"
    :value="modelValue"
    @change="$emit('update:modelValue', $event.target.value)"
  >
    <!-- 初期選択されている option を追加 -->
    <option value="" disabled selected hidden>
      {{ placeholder }}
    </option>
    <!-- 任意で追加できる内容 -->
    <option class="baseSelect__option"
      v-for="(selectOption, index) in items"
      key="index"
      :value="selectOption.value"
      :class="optionClass"
    >
      {{ selectOption.value }}
    </option>
  </select>

</template>


<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  selectClass: {
    type: String,
    required: false,
    default: '',
  },
  optionClass: {
    type: String,
    required: false,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: '',
  },
  // v-model に必要
  modelValue: {
    type: String,
  },
  placeholder: {
    type: String,
    default: '選択してください',
  },
});

const emit = defineEmits(['update:modelValue']);

</script>

<style scoped lang="scss">
@use '../../scss/_utility/utilities' as *;
@use 'sass:math';
</style>
