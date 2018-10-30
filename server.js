var express = require('express')
var path = require('path')
var axios = require('axios')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var app = express()

app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname)))
app.use(cookieParser())
// for parsing application/json
app.use(bodyParser.json())
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))

// ------------------------

var {menuList, getLastTime, getTagInfo, getIndexTitle, tabOptions} = require('./views/js/utils')

// 首页
app.get('/', (req, res) => {
  var schema = ['all', 'good', 'share', 'ask', 'job', 'dev']
  var tab = req.query.tab || 'all'
  if (!schema.includes(tab)) {
    return res.status(404).render('404.html')
  }

  var url = `https://cnodejs.org/api/v1/topics?tab=${tab}&page=1&limit=20&merender=true`
  var {id, name, avatar, accessToken} = req.cookies

  axios.get(url).then((response) => {
    res.render('index.html', {
      title: getIndexTitle(tab).title,
      head: getIndexTitle(tab).head,
      menuList,
      topics: response.data.data,
      getLastTime,
      getTagInfo,
      user: {id, name, avatar, accessToken}
    })
  }).catch((e) => {
    res.send(e.toString())
  })

})


// 新建主题
app.get('/topic/create', (req, res) => {
  var {id, name, avatar, accessToken} = req.cookies
  res.render('create.html', {
    title: '新建主题 - CNode技术社区',
    head: '新建主题',
    menuList,
    user: {id, name, avatar, accessToken}
  })
})


// 编辑主题
app.get('/topic/:id/edit', (req, res) => {
  var {id, name, avatar, accessToken} = req.cookies
  var url = `https://cnodejs.org/api/v1/topic/${req.params.id}?mdrender=false`

  axios.get(url).then((response) => {
    res.render('edit.html', {
      title: '编辑主题 - CNode技术社区',
      head: '编辑主题',
      menuList,
      user: {id, name, avatar, accessToken},
      topicData: response.data.data,
      tabOptions
    })
  })
})


// 主题详情
app.get('/topic/:id', (req, res) => {
  var {id, name, avatar, accessToken} = req.cookies
  var url = `https://cnodejs.org/api/v1/topic/${req.params.id}?mdrender=true&accesstoken=${accessToken}`

  axios.get(url).then((response) => {
    res.render('topic.html', {
      title: response.data.data.title + ' - CNode技术社区',
      head: '主题',
      menuList,
      topic: response.data.data,
      getLastTime,
      getTagInfo,
      user: {id, name, avatar, accessToken}
    })
  }).catch(() => {
    res.status(404).render('404.html')
  })
})

// 登录
app.get('/login', (req, res) => {
  var {id, name, avatar, accessToken} = req.cookies
  if (id) {
    return res.render('404.html',{
      title:'error',
      message:'您已登录!若要更换账号,退出后重新登录即可.'
    })
  }
  res.render('login.html', {
    title: '登录 - CNode技术社区',
    head: '登录',
    menuList,
    user: {id, name, avatar, accessToken}
  })
})


// 关于
app.get('/about', (req, res) => {
  var {id, name, avatar, accessToken} = req.cookies
  res.render('about.html', {
    title: '关于 - CNode技术社区',
    head: '关于',
    menuList,
    user: {id, name, avatar, accessToken}
  })
})

//消息
app.get('/message', (req, res) => {
  var {id, name, avatar, accessToken} = req.cookies
  var url = `https://cnodejs.org/api/v1/messages?accesstoken=${accessToken}&mdrender=true`

  axios.get(url).then((response) => {
    console.log(response.data.data)
    res.render('message.html', {
      title: '消息 - CNode技术社区',
      head: '消息',
      menuList,
      user: {id, name, avatar, accessToken},
      unread: response.data.data.hasnot_read_messages,
      hasread: response.data.data.has_read_messages,
      getLastTime
    })
  })


})


// 用户详情
app.get('/user/:loginname', (req, res) => {
  var {id, name, avatar, accessToken} = req.cookies
  var {loginname} = req.params
  var url = `https://cnodejs.org/api/v1/user/${loginname}`
  axios.get(url).then((response) => {
    res.render('user.html', {
      title: `@${response.data.data.loginname}的个人主页 - CNode技术社区`,
      head: '用户详情',
      menuList,
      user: {id, name, avatar, accessToken},
      userInfo: response.data.data,
      getLastTime
    })
  })
})

// 我的收藏
app.get('/my-collect', (req, res) => {
  var {id, name, avatar, accessToken} = req.cookies
  if (!id) {
    return res.render('404.html',{
      title:'error',
      message:'登录即可查看收藏的主题~'
    })
  }
  var url = `https://cnodejs.org/api/v1/topic_collect/${name}`
  axios.get(url).then((response) => {
    res.render('collect.html', {
      title: `我的收藏 - CNode技术社区`,
      head: '我的收藏',
      menuList,
      user: {id, name, avatar, accessToken},
      collects:response.data.data,
      getLastTime,
      getTagInfo,
    })
  })
})


app.get('*', (req, res) => {
  res.render('404.html')
})


app.listen(3000, () => {
  console.log('server is running at port 3000')
})
