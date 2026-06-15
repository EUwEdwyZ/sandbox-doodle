<template>
  <div class="baseModal">
  <div class="baseModal__overlay modal-overlay" @click.self="$emit('close')">
    <div class="baseModal__content modal-content">
      <slot />
      <button class="baseModal__button close-button" @click="$emit('close')">×</button>
    </div>
  </div>
  </div>
</template>

<style scoped lang="scss">
@use '../../scss/_utility/utilities' as *;
@use 'sass:math';

.baseModal {
  &__overlay {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
  }

  &__content {
    position: relative;
    width: 90vw;
    max-width: 960px;
    background: $color-white;
    padding: minVw(40);
    border-radius: minVw(5);
  }

  &__button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: transparent;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }
}
</style>
