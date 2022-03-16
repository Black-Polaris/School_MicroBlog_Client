import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/views/Login";
import Blogs from "@/views/Blogs";
import BlogEdit from "@/views/BlogEdit";
import BlogDetail from "@/views/BlogDetail";
import Mine from "@/views/Mine";
import IndexBlogs from "@/views/IndexBlogs";
import SearchBlog from "@/views/SearchBlog";
import UserBlogs from "@/views/UserBlogs";
import Register from "@/views/Register";
import GroupChat from "@/views/GroupChat";
import Chat from "@/views/Chat";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    redirect: {name: "IndexBlogs"}
  },
  {
    path: '/blogs',
    name: 'IndexBlogs',
    component: IndexBlogs
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/blog/:blogId/edit',
    name: 'BlogEdit',
    component: BlogEdit,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/blog/add',
    name: 'BlogAdd',
    component: BlogEdit,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/blog/:blogId',
    name: 'BlogDetail',
    component: BlogDetail
  },
  {
    path: '/mine',
    name: 'Mine',
    component: Mine
  },
  {
    path: '/search/:searchWords',
    name: 'SearchBlog',
    component: SearchBlog
  },
  {
    path: '/userBlogs/:userId',
    name: 'UserBlogs',
    component: UserBlogs
  },
  {
    path: '/groupChat',
    name: 'GroupChat',
    component: GroupChat
  },
  {
    path: '/chat',
    name: 'Chat',
    component: Chat
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
