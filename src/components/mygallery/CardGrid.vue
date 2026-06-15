<template>
  <ul class="cardGrid grid gap-6" :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)` }">
    <li v-for="(item, i) in items" :key="item.id"
      class="grid grid-rows-[subgrid] row-span-4 gap-2 bg-white rounded-sm p-3">
      <a href="#" @click.prevent="$emit('openImageModal', item)">
        <img class="block w-full h-auto aspect-square object-cover transition-opacity duration-200 ease-in hover:opacity-70" :src="item.imageUrl" alt="" />
      </a>

      <div class="mt-4 text-sm">
        {{ formatDate(item.createdAt) }}
      </div>

      <div class="flex justify-between mt-auto">
        <FavoriteButton
          :liked="item.liked"
          @toggleLike="$emit('toggleLike', item)"
        />
        <EditMenu
          @edit="$emit('edit', item.id)"
          @delete="$emit('delete', item.id)"
        />
      </div>

      <div
        class="line-clamp-4 overflow-hidden text-ellipsis"
        v-html="linkedCaption(item.caption)"
      >
      </div>
    </li>
  </ul>
</template>

<script setup>
import { nextTick, watch, onUpdated } from 'vue'
import DOMPurify from 'dompurify'
import FavoriteButton from './FavoriteButton.vue'
import EditMenu from './EditMenu.vue'

// Propsの型とデフォルト値
const props = defineProps({
  items: Array,
  columns: {
    type: Number,
    default: 3, // 表示するグリッドの数
  }
})

// イベントを外部に通知
const emit = defineEmits([
  'openImageModal',
  'toggleLike',
  'edit',
  'delete',
  'filterByTag'
])

/**
 * 日付文字列を見やすいフォーマットに変換
 * @param {string} rawDate Firestore等の日時文字列
 * @returns {string} フォーマット済み日時（例: 2023/08/04 14:00）
 */
const formatDate = (rawDate) => {
  if (!rawDate) return ''
  const d = new Date(rawDate)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return `${yyyy}/${mm}/${dd} ${hh}:${mi}`
}

/**
 * キャプション内のハッシュタグをリンク化し、XSS対策でサニタイズして返す
 * @param {string} caption キャプションテキスト
 * @returns {string} HTML文字列（リンク化済み）
 */
const linkedCaption = (caption) => {
  if (!caption) return ''
  // 改行はbrタグに置換
  const escaped = caption.replace(/\n/g, '<br>')
  // ハッシュタグ部分を<a>リンクに置換
  // 英数字、アンダースコア、ひらがな、カタカナ、漢字、長音符「ー」に対応
  const linked = escaped.replace(/#([\wぁ-んァ-ヶ一-龠ー]+)/g, (match, tag) => {
    return `<a href="#" class="text-blue-500 hover:opacity-70" data-tag="${tag}">#${tag}</a>`
  })
  // DOMPurifyで安全化。許可タグはaとbrのみ、属性はhref/class/data-tagのみ
  return DOMPurify.sanitize(linked, {
    ALLOWED_TAGS: ['a', 'br'],
    ALLOWED_ATTR: ['href', 'class', 'data-tag']
  })
}


/**
 * ハッシュタグリンクにクリックイベントを付与
 * - props.itemsの変化やDOM更新時に実行して再設定
 * - クリック時にフィルター用のタグ名をemitで親に通知する
 */
const attachTagClick = () => {
  nextTick(() => {
    document.querySelectorAll('.hashtag').forEach(el => {
      el.onclick = e => {
        e.preventDefault()
        const tag = el.dataset.tag
        emit('filterByTag', tag)
      }
    })
  })
}
// itemsの変更を監視し、ハッシュタグクリックイベントを再設定
watch(() => props.items, attachTagClick, { deep: true })
// DOM更新時にもイベントを再設定
onUpdated(() => {
  attachTagClick()
})

</script>
