import Layout from '@/layout'

export const novelRouter = {
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
          path: 'edit',
          name: 'Edit',
          hidden: true,
          component: () => import('@/views/novel/collect/edit'),
          meta: { title: '编辑采集节点', activeMenu: '/novel/collect/list' }
        },
        {
          path: 'book',
          name: 'Book',
          component: () => import('@/views/novel/collect/book'),
          meta: { title: '采集小说' }
        },
        {
          path: 'do',
          name: 'Do',
          hidden: true,
          component: () => import('@/views/novel/collect/do'),
          meta: { title: '采集中', activeMenu: '/novel/collect/book' }
        },
        {
          path: 'article',
          name: 'Article',
          hidden: true,
          component: () => import('@/views/novel/collect/article'),
          meta: { title: '待采集章节', activeMenu: '/novel/collect/book' }
        },
        {
          path: 'test',
          name: 'Test',
          hidden: true,
          component: () => import('@/views/novel/collect/test'),
          meta: { title: '采集测试', activeMenu: '/novel/collect/list' }
        }
      ]
    },
    {
      path: 'member',
      name: 'Member',
      redirect: 'noRedirect',
      component: () => import('@/views/novel/index'),
      meta: { title: '会员管理' },
      children: [
        {
          path: 'list',
          name: 'List',
          component: () => import('@/views/novel/member/list'),
          meta: { title: '会员列表' }
        },
        {
          path: 'apply',
          name: 'Apply',
          component: () => import('@/views/novel/book/apply'),
          meta: { title: '收录申请' }
        },
        {
          path: 'book',
          name: 'Book',
          component: () => import('@/views/novel/member/book'),
          meta: { title: '会员书架' }
        }
      ]
    },
    {
      path: 'data',
      name: 'Data',
      redirect: 'noRedirect',
      component: () => import('@/views/novel/index'),
      meta: { title: '数据管理' },
      children: [
        {
          path: 'keywords',
          name: 'Keywords',
          component: () => import('@/views/novel/data/keywords'),
          meta: { title: '搜索关键字' }
        },
        {
          path: 'apply',
          name: 'Apply',
          component: () => import('@/views/novel/data/spider'),
          meta: { title: '搜索引擎来源' }
        }
      ]
    },
    {
      path: 'setting',
      name: 'Setting',
      component: () => import('@/views/novel/setting'),
      meta: { title: '系统设置' }
    }
  ]
}
