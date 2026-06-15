<template>
  <div class="mb-5 p-4 shadow-[0_10px_10px_-6px_rgba(0,0,0,0.3)]">
    <ul class="flex gap-10">
      <li class=""
        v-for="link in navLinks"
        :key="link.href"
        :class="{ 'font-bold pointer-events-none' : isCurrentLink(link.href) }"
      >
        <router-link :to="link.href"
          class="
            block relative text-gray-900
            transition-[opacity] duration-300 ease-in
            after:content-[''] after:block after:absolute after:left-[-70%] after:w-full after:h-[1px] after:bg-current after:opacity-0
            after:transition-[left,opacity] after:duration-700 after:ease-in-out
            hover:after:left-0 hover:after:opacity-100

          "
        >
          {{ link.label }}
        </router-link>
      </li>
    </ul>
  </div>
</template>


<script setup>
import { ref } from 'vue'
// import { ArrowRightIcon } from '@heroicons/vue/24/solid'

// ナビゲーションリンク一覧
const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'About', href: '/about' },
  // { label: 'Example', href: '/example' },
]

// 現在のパスを取得（ブラウザ環境の場合）
const currentPath = ref(window.location.pathname)

// 指定のhrefが現在のパスか判定する関数
const isCurrentLink = (href) => {
  return href === currentPath.value
}
</script>
