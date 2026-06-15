<template>
  <div class="relative" ref="menuRef">
    <button @click="toggleMenu" class="text-2xl cursor-pointer hover:opacity-50">
      <iconify-icon icon="mdi:more-horiz" width="20" height="20" style="margin-right: 8px;" />
    </button>
    <div v-if="menuOpen" class="absolute top-[max(-5.9701492537vw, -80px)] left-[min(0.7462686567vw, 10px)] w-[min(11.1940298507vw,150px)] bg-white border border-gray-300 rounded-[min(0.3731343284vw,5px)] z-10 shadow-[0_2px_6px_rgba(0,0,0,0.1)]">
      <button @click="$emit('edit')" class="w-full p-[min(0.7462686567vw,10px)] text-[min(1.1940298507vw,16px)] leading text-left cursor-pointer"><iconify-icon data-v-a7877447="" icon="mdi:edit" class="mr-[min(0.373134328358209vw,5px)] text-[min(1.492537313432836vw,20px)] leading-none align-bottom"></iconify-icon>編集</button>
      <button @click="$emit('delete')" class="w-full p-[min(0.7462686567vw,10px)] text-[min(1.1940298507vw,16px)] leading text-left cursor-pointer border-t border-gray-300 text-red-500"><iconify-icon data-v-a7877447="" icon="mdi:delete" class="mr-[min(0.373134328358209vw,5px)] text-[min(1.492537313432836vw,20px)] leading-none align-sub"></iconify-icon>削除</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const menuOpen = ref(false)
const menuRef = ref(null)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const handleClickOutside = (event) => {
  if (menuRef.value && !menuRef.value.contains(event.target)) {
    menuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
