module.exports = [
  {
    title: '选择活动',
    filename: 'index.html',
    entry: './src/pages/List',
    chunks: [ 'List' ],
  },
  {
    title: '现场签到-大屏活动',
    filename: 'activity.html',
    entry: './src/activity/live',
    chunks: ['activity'],
  },
  {
    title: '扫码登录',
    filename: 'login.html',
    entry: './src/pages/Login',
    chunks: [ 'Login' ],
  },
]
