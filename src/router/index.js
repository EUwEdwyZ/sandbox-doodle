import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import Home from '../views/Home.vue'
import MyGallery from '../views/MyGallery.vue'
import Login from '../views/Login.vue' //一旦認証ページを作るけどGalleryにリダイレクトさせる

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/signup', name: 'Signup', component: () => import('../views/Signup.vue')},
  { path: '/mygallery', name: 'MyGallery', component: MyGallery, meta: { requiresAuth: true } }, // 認証が必要
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// -----------------------------
// 認証チェック用の関数
// -----------------------------
const isAuthenticated = () => {
  const auth = getAuth()
  return auth.currentUser !== null
}


// -----------------------------
// グローバルナビゲーションガード
// -----------------------------
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({
      name: 'Login',
      query: { redirect: to.fullPath } // ログイン後に戻れるように
    })
  } else {
    next()
  }
})

export default router
