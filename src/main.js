// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

// ここで Tailwind をインポート！
import './style.css';

// // デフォルトSCSSを読み込み
// import './scss/style.scss'


// ---------------------------
// Firebase Auth の状態確認後に Vue アプリを起動
// （アプリ起動のたびに強制ログアウトされてしまうため）
// ---------------------------
const auth = getAuth()
let app


// ---------------------------
// Firebaseの認証状態を監視するリスナー
// アプリが読み込まれたときや、ユーザーがログイン・ログアウトしたときに自動で呼び出される
// この中で、認証状態に応じてアプリの状態を更新したり、ルーティング制御などを行う
// ---------------------------
onAuthStateChanged(auth, () => {
  if (!app) {
    // ユーザーがログインしている場合の処理（例：storeにユーザー情報を保存）
    app = createApp(App)
    app.use(router)


    // ルートが変わるたびにスタイルを切り替える
    router.afterEach((to) => {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      // StaySearchページに遷移した場合のみstyle2.scssを読み込む
      if (to.name === 'StaySearch') {
        import('./scss/staysearch/staysearch.scss') // StaySearchページ用
      } else {
        import('./scss/style.scss') // その他のページ用
      }
      document.head.appendChild(link)
    })

    app.mount('#app')
  }
})
