<template>
  <button
    :type="buttonType"
    :class="[
      buttonStyles({ padding, textColor, bgColor, rounded, textAlign, disabled }),
    ]"
    @click="onClick"
  >
    <slot :index="index" />
  </button>
</template>

<script setup>
import { cva } from 'class-variance-authority';

const props = defineProps({
  index: Number,
  buttonType: { type: String, default: 'button' },
  buttonClass: { type: String, default: '' },
  padding: {
    type: String,
    default: 'default',
  },
  textColor: {
    type: String,
    default: 'white',
  },
  bgColor: {
    type: String,
    default: 'blue',
  },
  rounded: {
    type: String,
    default: 'md',
  },
  textAlign: {
    type: String,
    default: 'center',
  },
  disabled: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(['click']);

// CVAの variants セクションと同じ役割
const buttonStyles = cva(
  // 共通クラス
  'block w-full h-full border-none transition-opacity duration-300 ease-in cursor-pointer hover:opacity-80',
  {
    variants: {
      padding: {
        default: 'p-3',
        favorite: '',
      },
      textColor: {
        white: 'text-white',
        gray: 'text-gray-900',
      },
      bgColor: {
        blue:   'bg-blue-500',
        black:  'bg-black',
        red:    'bg-red-500',
        orange: 'bg-orange-500',
        transparent: 'bg-transparent'
      },
      rounded: {
        xs:   'rounded-xs',
        sm:   'rounded-sm',
        md:   'rounded-md',
        lg:   'rounded-lg',
        full: 'rounded-full',
      },
      textAlign: {
        center: 'text-center',
        left:   'text-left',
        right:  'text-right',
      },
      disabled: {
        true: 'pointer-events-none bg-gray-200 !text-gray-500',
        false: ''
      },
    },
    compoundVariants: [
      {
        disabled: true,
        // disabled が true なら、どの color であっても文字色をグレーに上書き
        class: 'text-gray-500'
      }
    ],
    defaultVariants: {
      padding: 'default',
      textColor: 'white',
      bgColor: 'blue',
      rounded: 'md',
      align: 'center',
      disabled: false,
    },
  }
);

const onClick = (e) => emit('click', e);
</script>
