<template>
  <!-- <Header /> -->
  <div class="flex justify-center items-center min-h-[100vh]">
    <div class="max-w-full w-100 p-10 bg-white">
      <h2 class=" text-center text-2xl font-bold mb-7">ログイン</h2>
      <div class="login__form">
        <AuthForm submitLabel="ログイン" @submit="handleLogin" />
        <p class="mt-5 text-sm text-center">アカウントをお持ちでない場合 <router-link to="/signup" class="text-blue-500">登録はこちら</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import AuthForm from '../components/mygallery/AuthForm.vue'
import { useRouter, useRoute } from 'vue-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import Header from '../components/common/Header.vue'


const router = useRouter()
const route = useRoute()

// ---------------------------
// ログイン処理
// ---------------------------
const handleLogin = async ({ email, password }) => {
  if (!email || !password) {
    alert('メールアドレスとパスワードを入力してください')
    return
  }

  try {
    // Firebase認証でサインイン
    await signInWithEmailAndPassword(auth, email, password)

    // // ローカルにログイン状態を保存（必要なら別の方法に変更可）
    // localStorage.setItem('isLoggedIn', 'true')

    // リダイレクト先を取得（クエリがなければ /mygallery）
    const redirectTo = route.query.redirect || '/mygallery'
    router.push(redirectTo)
  } catch (error) {
    console.error('ログインエラー:', error)
    alert('ログインに失敗しました: ' + error.message)
  }
}
</script>
