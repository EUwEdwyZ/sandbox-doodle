<template>
  <div class="RegistrationModal">
    <h2 class="RegistrationModal__title">{{ editItem ? '投稿編集' : '新規投稿' }}</h2>
    <form class="RegistrationModal__form" @submit.prevent="submitForm">
      <div class="RegistrationModal__formItem">
        <input
          id="imageUpload"
          class="RegistrationModal__formInput"
          type="file"
          accept="image/*"
          @change="handleFileChoice"
          :required="!editItem"
        >
      </div>

      <div class="Registration__formItem">
        <textarea
          id="description"
          class="RegistrationModal__formCaption"
          v-model="description"
          rows="4"
          placeholder="キャプション、#ハッシュタグを追加…"
        ></textarea>
      </div>
      <div class="RegistrationModal__formLoadingBg" v-if="loading">
        <BaseLoadingSpinner/>
      </div>
      <div class="RegistrationModal__formSubmit">
        <BaseButton type="submit">{{ editItem ? '更新' : '投稿' }}</BaseButton>
      </div>
    </form>
  </div>
</template>

<script setup>
import BaseButton from '../_global/BaseButton.vue'
import BaseLoadingSpinner from '../_global/BaseLoadingSpinner.vue'
import { ref, watch, defineProps, defineEmits } from 'vue'
import { storage } from '@/firebase'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import imageCompression from 'browser-image-compression' // 登録時に画像を圧縮

const emit = defineEmits(['submit']);

const props = defineProps({
  editItem: {
    type: Object,
    default: null,
  }
})

const file = ref(null)
const description = ref(props.editItem?.caption || '')
const imageUrl = ref(props.editItem?.imageUrl || '')
const loading = ref(false);

// 編集アイテムが変わったらフォームの値を更新
watch(() => props.editItem, (newVal) => {
  if (newVal) {
    description.value = newVal.caption
    imageUrl.value = newVal.imageUrl
  } else {
    description.value = ''
    imageUrl.value = ''
  }
  file.value = null
})

// ファイル選択時
const handleFileChoice = (e) => {
  const selectedFile = e.target.files[0]
  if (!selectedFile) return
  file.value = selectedFile
}

// ハッシュタグ抽出関数
const extractTags = (text) => {
  if (!text) return []
  const regex = /#([\p{L}\p{N}_\-]+)/gu
  const matches = text.matchAll(regex)
  const tags = []
  for (const match of matches) {
    tags.push(match[1])
  }
  return tags
}

// 登録／更新処理
const submitForm = async () => {
  if (!file.value && !imageUrl.value) {
    alert('画像ファイルを選んでください')
    return
  }

  loading.value = true
  try {
    let uploadedUrl = imageUrl.value
    let uploadedPath = props.editItem?.imagePath || ''  // 初期値は編集前のもの

    if (file.value) {
      const options = {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 800,
        initialQuality: 0.7,
        useWebWorker: true
      }
      const compressedFile = await imageCompression(file.value, options)

      // Storage内でのファイルパスを生成!
      uploadedPath = `images/${compressedFile.name}_${Date.now()}`

      const imgRef = storageRef(storage, `images/${compressedFile.name}_${Date.now()}`)
      await uploadBytes(imgRef, compressedFile)
      uploadedUrl = await getDownloadURL(imgRef)
    }

    // ここでdescriptionからタグ抽出
    const tags = extractTags(description.value)

    emit('submit', {
      id: props.editItem?.id || null,
      imageUrl: uploadedUrl,
      imagePath: uploadedPath,
      caption: description.value,
      tags,
      liked: props.editItem?.liked || false,
    })
    resetForm()
  } catch (error) {
    console.error('画像圧縮・アップロード中にエラー:', error)
    alert('画像のアップロードに失敗しました')
  } finally {
    loading.value = false
  }
}


const resetForm = () => {
  file.value = null
  description.value = ''
  imageUrl.value = ''
  document.getElementById('imageUpload').value = ''
}
</script>

<style scoped lang="scss">
@use '../../scss/_utility/utilities' as *;
@use 'sass:math';
.RegistrationModal {
  &__title {
    @include fz(18);
    text-align: center;
  }
  &__form {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-top: 24px;
    &Item {
      display: flex;
      flex-direction: column;
    }
    &Input[type="file"] {
      padding: 12px;
      border: 2px dashed #ccc;
      border-radius: 8px;
      background-color: #fafafa;
      cursor: pointer;
      transition: border-color 0.2s;
      @include hover() {
        border-color: #999;
      }
    }
    &Label {
      margin-bottom: 8px;
      color: #444;
      font-weight: bold;
    }
    &Caption {
      width: 100%;
      min-height: 100px;
      padding: 12px;
      border: 1px solid #ccc;
      border-radius: 8px;
      resize: vertical;
    }
    &Submit {
      width: 100px;
      margin-inline: auto;
      padding: 10px 20px;
      background-color: #a18564;
      color: #fff;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      transition: background-color 0.2s;
      text-align: center;
      @include hover() {
        background-color: #715d45;
      }
      button {
        padding: 0;
        background-color: transparent;
        border: none;
      }
    }

    &LoadingBg {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgb(0, 0, 0, .7);
    }
  }
  // ローディング
  .baseLoadingSpinner {
    position: fixed;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
  }
}
</style>
