import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '控制台', icon: 'dashboard' }
    }]
  },

  {
    path: '/novel',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Novel',
    meta: { title: '小说系统', icon: 'novel' },
    children: [
      {
        path: 'book',
        name: 'Book',
        redirect: 'noRedirect',
        component: () => import('@/views/novel/index'),
        meta: { title: '内容管理' },
        children: [
          {
            path: 'category',
            name: 'Category',
            component: () => import('@/views/novel/category/list'),
            meta: { title: '分类管理' }
          },
          {
            path: 'book',
            name: 'Book',
            component: () => import('@/views/novel/book/list'),
            meta: { title: '小说管理' }
          },
          {
            path: 'article',
            name: 'Article',
            hidden: true,
            component: () => import('@/views/novel/article/list'),
            meta: { title: '小说章节', activeMenu: '/novel/book/book' }
          }
        ]
      },
      {
        path: 'collect',
        name: 'Collect',
        redirect: 'noRedirect',
        component: () => import('@/views/novel/index'),
        meta: { title: '采集管理' },
        children: [
          {
            path: 'list',
            name: 'List',
            component: () => import('@/views/novel/collect/list'),
            meta: { title: '采集节点' }
          },
          {
            path: 'book',
            name: 'Book',
            component: () => import('@/views/novel/collect/book'),
            meta: { title: '采集小说' }
          },
          {
            path: 'article',
            name: 'Article',
            hidden: true,
            component: () => import('@/views/novel/collect/article'),
            meta: { title: '待采集章节', activeMenu: '/novel/collect/book' }
          }
        ]
      },
      {
        path: 'member',
        name: 'Member',
        redirect: 'noRedirect',
        component: () => import('@/views/novel/index'),
        meta: { title: '会员管理' }
      },
      {
        path: 'data',
        name: 'Data',
        redirect: 'noRedirect',
        component: () => import('@/views/novel/index'),
        meta: { title: '数据管理' }
      },
      {
        path: 'setting',
        name: 'Setting',
        component: () => import('@/views/novel/setting'),
        meta: { title: '系统设置' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
