<template>
  <Header />
  <div class="flex justify-center items-center min-h-[100vh]">
    <div class="w-100 max-w-full p-10 bg-white rounded-l shadow-[0_8px_20px_rgba(0,0,0,0.1)]">
      <h2 class="mb-7 text-center text-2xl font-bold">新規登録</h2>
      <div class="signup__form">
        <AuthForm submitLabel="アカウント作成" @submit="handleSignup" />
        <p class="mt-5 text-sm text-center">アカウントをお持ちの場合 <router-link to="/login" class="text-blue-500">ログイン</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import AuthForm from '../components/mygallery/AuthForm.vue'
import { useRouter } from 'vue-router'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import Header from '../components/common/Header.vue'


const router = useRouter()

const handleSignup = async ({ email, password }) => {
  if (!email || !password) {
    alert('メールとパスワードを入力してください')
    return
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password)
    localStorage.setItem('user', 'true') // 必要ならトークン等に置き換えを検討
    router.push('/mygallery')
  } catch (error) {
    console.error(error)
    alert('登録に失敗しました: ' + error.message)
  }
}
</script>


