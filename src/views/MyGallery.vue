<template>
  <div class="page">
    <OperationMenu
      @changeView="handleChangeView"
      @sortFavorites="showAll"
    />

    <main>
      <section class="photoGallery">

        <div class="photoGallery__wrapper">
          <FilterLabel
            v-if="showFavoritesOnly || activeTag"
            :label="labelText"
            @clearFilter="clearAllFilters"
          />
          <InfiniteScroll
            :loading="loading"
            :hasMore="hasMore"
            :showEndMessage="visibleItems.length > perPage && !hasMore"
            @loadMore="loadMore"
          >
            <CardGrid
              :items="visibleItems"
              :columns="3"
              @toggleLike="toggleLike"
              @openImageModal="openImageModal"
              @edit="handleEdit"
              @delete="handleDelete"
              @filterByTag="handleFilterByTag"
            />
            <LoadingSpinner v-if="loading" />
          </InfiniteScroll>
        </div>
      </section>
    </main>

    <BaseModal v-if="currentView === 'add'" @close="closeModal">
      <RegistrationModal
        :editItem="currentEdit"
        @submit="handleRegister"
      />
    </BaseModal>
    <BaseModal v-if="currentView === 'search'" @close="closeModal">
      <SearchModal />
    </BaseModal>
    <BaseModal v-if="currentView === 'profile'" @close="closeModal">
      <ProfileModal />
    </BaseModal>
    <BaseModal v-if="selectedImage" @close="closeModal">
      <ImageModal
        :image="selectedImage"
      />
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import BaseModal from '../components/_global/BaseModal.vue'
import LoadingSpinner from '../components/_global/BaseLoadingSpinner.vue'
import InfiniteScroll from '../components/mygallery/InfiniteScroll.vue'
import FilterLabel from '../components/mygallery/FilterLabel.vue'
import CardGrid from '../components/mygallery/CardGrid.vue'
import OperationMenu from '../components/mygallery/OperationMenu.vue'
import RegistrationModal from '../components/mygallery/RegistrationModal.vue'
import SearchModal from '../components/mygallery/SearchModal.vue'
import ProfileModal from '../components/mygallery/ProfileModal.vue'
import ImageModal from '../components/mygallery/ImageModal.vue'
// Firebase関連のimport（データの登録先）
import { collection, getDocs, query, orderBy, deleteDoc, addDoc, updateDoc, doc } from 'firebase/firestore'
import { getStorage, ref as storageRef, deleteObject } from 'firebase/storage'
import { db } from '@/firebase'  // firebase.jsでexportしているFirestoreのインスタンス


// -----------------------------
// モーダル制御
// -----------------------------
const currentView = ref(null)  // 'add', 'search', 'profile' または null（モーダル非表示）
const currentEdit = ref(null)  // 編集対象の写真データ（編集時のみ）
const selectedImage = ref(null)  // 画像閲覧モーダルで表示する写真

const closeModal = () => {
  currentView.value = null
  currentEdit.value = null
  selectedImage.value = null
}

// ESCキー押下でモーダルを閉じる
const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    closeModal()
  }
}
onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

const handleChangeView = (viewName) => {
  // モーダルを開く際、編集対象をリセット
  currentEdit.value = null
  currentView.value = viewName
}

const openImageModal = (image) => {
  selectedImage.value = image
}


// -----------------------------
// Firestore写真データ管理
// -----------------------------
const photos = ref([])
const photosCollection = collection(db, 'photos')

// Firestoreから写真一覧取得
const fetchPhotos = async () => {
  const q = query(photosCollection, orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  photos.value = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

// 初回読み込み時にデータ取得、必要に応じて次ページもロード
onMounted(async () => {
  await fetchPhotos()
  setTimeout(() => {
    if (
      hasMore.value &&
      Array.isArray(visibleItems.value) &&
      visibleItems.value.length < perPage
    ) {
      loadMore()
    }
  }, 100)
})

// -----------------------------
// 登録・編集処理
// -----------------------------
const handleRegister = async (newItem) => {
  if (newItem.id) {
    const docRef = doc(db, 'photos', newItem.id)
    // 編集前のデータを取得（ローカル配列 or Firestoreから）
    const oldItem = photos.value.find(p => p.id === newItem.id)
    if (!oldItem) {
      console.warn('編集前のデータが見つかりません')
      return
    }
    // 画像パスが変わっていれば古い画像をStorageから削除
    if (oldItem.imagePath && oldItem.imagePath !== newItem.imagePath) {
      const storage = getStorage()
      const oldImageRef = storageRef(storage, oldItem.imagePath)
      try {
        await deleteObject(oldImageRef)
        console.log('旧画像をstorageから削除:', oldItem.imagePath)
      } catch (error) {
        console.warn('旧画像削除失敗:', error.message)
      }
    }
    // Firestoreのデータ更新
    await updateDoc(docRef, {
      caption: newItem.caption ?? '',
      liked: newItem.liked ?? false,
      imageUrl: newItem.imageUrl ?? '',
      imagePath: newItem.imagePath ?? '',
      tags: newItem.tags ?? [],
    })

  } else {
    // 新規追加の場合
    await addDoc(photosCollection, {
      caption: newItem.caption ?? '',
      liked: false,
      imageUrl: newItem.imageUrl ?? '',
      imagePath: newItem.imagePath ?? '',
      createdAt: new Date().toISOString(),
      tags: newItem.tags ?? [],
    })
  }

  closeModal()
  await fetchPhotos()
}


// -----------------------------
// いいね（liked）切替
// -----------------------------
const toggleLike = async (targetItem) => {
  const docRef = doc(db, 'photos', targetItem.id)
  await updateDoc(docRef, { liked: !targetItem.liked })
  await fetchPhotos()
}

// -----------------------------
// 削除処理
// -----------------------------
const handleDelete = async (id) => {
  const item = photos.value.find(p => p.id === id)
  if (!item) return

  // Storage の画像を削除
  const storage = getStorage()

  try {
    // 画像のパスをURLから取得してStorage参照を作成
    const url = new URL(item.imageUrl)
    const path = decodeURIComponent(url.pathname.replace(/^\/v0\/b\/[^\/]+\/o\//, ''))
    const imageRef = storageRef(storage, item.imagePath)

    await deleteObject(imageRef)
    console.log('画像をStorageから削除しました')
  } catch (error) {
    console.warn('画像削除エラー:', error.message)
  }

  // Firestoreからデータを削除
  await deleteDoc(doc(db, 'photos', id))
  await fetchPhotos()
}


// -----------------------------
// 編集開始時の処理
// -----------------------------
const handleEdit = (id) => {
  const item = photos.value.find(p => p.id === id)
  if (item) {
    currentEdit.value = { ...item }  // 編集対象をコピーして保持
    currentView.value = 'add'        // 登録モーダルを開く
  }
}


// -----------------------------
// フィルター管理（タグ・いいね）
// -----------------------------
const activeTag = ref(null) // フィルターされたハッシュタグ（nullならフィルターなし）
const showFavoritesOnly = ref(false) // いいねフィルター

// タグフィルターセット＆ページリセット
const handleFilterByTag = (tag) => {
  activeTag.value = tag
  page.value = 1
}

// いいねフィルターON
const showAll = () => {
  showFavoritesOnly.value = true // 押すと必ずお気に入りだけ表示にする
}


// フィルター適用後の一覧（computed）
const filteredItems = computed(() => {
  let base = photos.value

  if (showFavoritesOnly.value) {
    base = base.filter(p => p.liked)
  }

  if (activeTag.value) {
    base = base.filter(p => p.caption?.includes(`#${activeTag.value}`))
  }

  return base
})

// フィルター解除処理（全解除）
const clearAllFilters = () => {
  showFavoritesOnly.value = false
  activeTag.value = null
  page.value = 1
}

// フィルターラベルのテキストを生成
const labelText = computed(() => {
  if (showFavoritesOnly.value && activeTag.value) {
    return `いいね & #${activeTag.value}`
  } else if (showFavoritesOnly.value) {
    return 'いいね'
  } else if (activeTag.value) {
    return `#${activeTag.value}`
  } else {
    return ''
  }
})


// -----------------------------
// インフィニティスクロール（ページング）
// -----------------------------
const perPage = 6 // 初期の表示件数
const page = ref(1) // 現在のページ番号
const loading = ref(false)

// ページング適用後に表示するアイテム
const visibleItems = computed(() =>
  filteredItems.value.slice(0, page.value * perPage)
)

// さらに次ページが存在するか判定
const hasMore = computed(() =>
  visibleItems.value.length < filteredItems.value.length
)

// 次ページを読み込む処理（無限スクロール用）
const loadMore = () => {
  if (loading.value || !hasMore.value) return
  loading.value = true
  setTimeout(() => {
    page.value++
    loading.value = false
  }, 1000)
}
</script>

<style scoped lang="scss">
@use '../scss/_utility/utilities' as *;
@use 'sass:math';

.page {
  display: flex;
}
main {
  width: 100%;
  @include pc() {
    margin-left: min(math.div(300, 1340) * 100vw, 300px);
  }
}
</style>
