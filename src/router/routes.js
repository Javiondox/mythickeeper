const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/landing' },
      {
        path: '/landing',
        name: 'home',
        component: () => import('pages/Index.vue')
      },
      {
        path: '/settings',
        name: 'settings',
        component: () => import('pages/AppSettings.vue')
      },
      {
        path: '/syncsettings',
        name: 'syncsettings',
        component: () => import('pages/SyncSettings.vue')
      },
      {
        path: '/gridExplorer',
        name: 'gridExplorer',
        component: () => import('pages/GridExplorer.vue')
      },
      {
        path: '/itemExplorer',
        name: 'itemExplorer',
        component: () => import('pages/ItemExplorer.vue')
      },
      {
        path: '/preview',
        name: 'preview',
        component: () => import('pages/Preview.vue')
      },
      {
        path: '/feedback',
        name: 'feedback',
        component: () => import('pages/Feedback.vue')
      },
      {
        path: '/help',
        name: 'help',
        component: () => import('pages/Help.vue')
      },
      {
        path: '/editor',
        name: 'editor',
        component: () => import('pages/Editor.vue')
      }
    ]
  },
  {
    path: '/guide',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      {
        path: '',
        name: 'guide',
        component: () => import('pages/GuideCarrusel.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
];

export default routes;
