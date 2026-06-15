<template>
  <div
    class="flex gap-2 items-center"
    v-for="(checkboxOption, index) in items"
    :key="index"
  >
  <input
    type="checkbox"
    :id="checkboxOption.id"
    :name="checkboxOption.name"
    :disabled="disabled" :checked="Array.isArray(modelValue) ? modelValue.includes(checkboxOption.id) : modelValue"
    @change="onChange($event, checkboxOption.id)"
    :class="inputStyles({ disabled })"
  >
  <label
    :for="checkboxOption.id"
    :class="labelStyles({ disabled })"
  >
    {{ checkboxOption.label }}
  </label>
  </div>
</template>


<script setup>
import { cva } from 'class-variance-authority';
const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: [Array, Boolean], // 複数・単数にも対応したい
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});


const onChange = (e, id) => {
  if (Array.isArray(props.modelValue)) {
    // 配列の場合 → 複数チェック対応
    const newValue = [...props.modelValue];
    if (e.target.checked) {
      if (!newValue.includes(id)) newValue.push(id);
    } else {
      const index = newValue.indexOf(id);
      if (index > -1) newValue.splice(index, 1);
    }
    emit('update:modelValue', newValue);
  }
  // Boolean の場合 → 単一チェック対応
  else if (typeof props.modelValue === 'boolean') {
    emit('update:modelValue', e.target.checked);
  }
};

const inputStyles = cva(
  'w-4 h-4 cursor-pointer', // サイズを指定するとより綺麗です
  {
    variants: {
      disabled: {
        // bg- ではなく accent- を使う
        true: 'accent-gray-400 cursor-not-allowed opacity-50 pointer-events-none',
        false: 'accent-blue-500',
      }
    },
    defaultVariants: {
      disabled: false,
    }
  }
);

const labelStyles = cva(
  'cursor-pointer',
  {
    variants: {
      disabled: {
        true: 'text-gray-400 cursor-not-allowed pointer-events-none',
        false: 'text-gray-900',
      }
    },
    defaultVariants: {
      disabled: false,
    }
  }
)
</script>
