<template>
  <div class="space-y-2">
    <div
      v-for='item in items'
      :key='item.id'
    >
      <div
        @click='modelValue = (modelValue === item.id ? null: item.id)'
        class='cursor-pointer'
      >
        {{ item.label }}
      </div>
      <div
        v-show='modelValue === item.id'
        class=' duration-300'
      >
        {{ item.content }}
      </div>
    </div>

    <!-- <div class="bg-red-300 mt-10">
      <div data-parent=1 class="bg-red-300">
        <div data-trigger=1>タイトル1</div>
        <div data-content=1 class="hidden">内容</div>
      </div>
      <div data-parent=2>
        <div data-trigger=2>タイトル2</div>
        <div data-content=2 class="hidden">内容2</div>
      </div>
    </div> -->

  </div>
</template>


<script setup>

  // 親からタブの配列を受け取る
  const props = defineProps({
    items: {
      type: Array,
      required: true
    }
  });

  // 親と「現在のタブID」を同期する
  const modelValue = defineModel();


// import { onMounted } from 'vue';

// onMounted(() => {
//   const triggers = document.querySelectorAll('[data-trigger]')

//   triggers.forEach((trigger) => {
//     trigger.addEventListener('click', () => {
//       // クリックしたidを取得
//       const id = trigger.dataset.trigger

//       // 2. 対応するコンテンツを探す
//       const targetContent = document.querySelector(`[data-content="${id}"]`)

//       // 3. hiddenクラスを付け外しする（toggle）
//       if(targetContent) {
//         targetContent.classList.toggle('hidden')
//       }
//     })
//   })
// })
</script>
