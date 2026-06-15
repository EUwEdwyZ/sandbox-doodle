<template>
  <input
    :class="[
      inputStyles({
        disabled,
      })
    ]"
    :type="inputType"
    :name="name"
    :placeholder="placeholder"
    :value="modelValue"
    @input="onInput"
    :disabled="props.disabled"
  >
</template>


<script setup>
import { cva } from 'class-variance-authority';
const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  inputClass: {
    type: String,
    required: false,
    default: ''
  },
  inputType: {
    type: String,
    required: false,
    default: 'text',
  },
  name: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    required: false,
    default: '内容を入力',
  },
  modelValue: {
    type: [String, Number],
    required: false,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  }
});

// inputのvalueを親に渡す
const onInput = (e) => {
  emit('update:modelValue', e.target.value)
}

const inputStyles = cva(
  // 共通スタイル
  'block w-full h-full p-4 border-1 border-gray-300 rounded-sm cursor-pointer transition-opacity duration-300 ease-in hover:opacity-70',
  {
    variants: {
      disabled: {
        true: 'bg-gray-200 pointer-events-none cursor-not-allowed',
        false: 'bg-white'
      }
    },
    defaultVariants: {
      disabled: false,
    }
  }
)
</script>

