<template>
  <nav class="operationMenu fixed bottom-0 md:bottom-[revert] md:top-0 md:left-0 w-full md:w-[min(22.3880597015vw,300px)] md:h-[100dvh] md:py-4 bg-white">
    <ul class="flex justify-center md:flex-col gap-4">
      <li
        class="operationMenu__item"
        v-for="date in navDate"
        :key="date.label"
      >
        <div class="operationMenu__itemButton">
          <BaseButton :onClick="() => selectView(date.label)">
            <iconify-icon :icon="date.icon" style="vertical-align: middle;" />
            <span>{{ date.label }}</span>
          </BaseButton>
        </div>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, defineEmits, onMounted } from 'vue'
import BaseButton from '../_global/BaseButton.vue'
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const emit = defineEmits(['changeView', 'sortFavorites', 'resetTagFilter'])

const navDate = [
  { label: 'add', icon: 'mdi:plus-box' },
  { label: 'favorite', icon: 'mdi:heart' },
  { label: 'logout', icon: 'mdi:logout' },
  // { label: 'search', icon: 'mdi:magnify' },
  // { label: 'profile', icon: 'mdi:account' },
]

const isAuthenticated = ref(false)

const selectView = async (label) => {
  if (label === 'favorite') {
    emit('sortFavorites', 'favorite')
  } else if (label === 'logout') {
    try {
      const auth = getAuth()
      await signOut(auth)
      router.push('/login')
    } catch (error) {
      console.error('ログアウトに失敗しました:', error)
    }
  } else {
    emit('changeView', label)
  }
}


// Firebase認証状態の監視
onMounted(() => {
  const auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    isAuthenticated.value = !!user
    if (!user) {
      router.push('/login')
    }
  })
})
</script>

<style scoped lang="scss">
@use '../../scss/_utility/utilities' as *;
@use 'sass:math';

.operationMenu {
  &__itemButton {
    transition: background-color 0.3s ease-in;
    text-align: left;

    &:hover {
      background-color: #e0e0e0;
    }

    & > * {
      all: unset;
      cursor: pointer;
      display: block;
      width: 100%;
      padding: 15px 10px;
      box-sizing: border-box;
      line-height: 1;
    }

    span {
      @include sp() {
        font-size: 0;
      }
    }
  }
}
</style>
