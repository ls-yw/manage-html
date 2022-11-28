import Layout from '@/layout'

export const blogRouter = {
  path: '/blog',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Blog',
  meta: { title: '博客系统', icon: 'blogger' },
  children: [
    {
      path: 'category',
      name: 'Category',
      component: () => import('@/views/blog/category'),
      meta: { title: '分类管理' }
    },
    {
      path: 'article',
      name: 'article',
      redirect: 'noRedirect',
      component: () => import('@/views/blog/index'),
      meta: { title: '内容管理' },
      children: [
        {
          path: 'list',
          name: 'list',
          component: () => import('@/views/blog/article'),
          meta: { title: '文章列表' }
        },
        {
          path: 'edit',
          name: 'Edit',
          hidden: true,
          component: () => import('@/views/blog/articleEdit'),
          meta: { title: '编辑文章', activeMenu: '/blog/article/list' }
        }
      ]
    }
  ]
}
