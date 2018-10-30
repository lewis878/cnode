exports.menuList = [
  {
    to: '/?tab=all',
    name: 'all',
    text: '首页'
  },
  {
    to: '/?tab=good',
    name: 'good',
    text: '精华'
  },
  {
    to: '/?tab=share',
    name: 'share',
    text: '分享'
  },
  {
    to: '/?tab=ask',
    name: 'ask',
    text: '问答'
  },
  {
    to: '/?tab=job',
    name: 'job',
    text: '招聘'
  },
  {
    to: '/?tab=dev',
    name: 'dev',
    text: '测试'
  },
  {
    to: '/message',
    name: 'message',
    text: '消息'
  },
  {
    to: '/about',
    name: 'about',
    text: '关于'
  }
]

exports.getLastTime = function (str) {
  var d = new Date(str)
  var diff = (new Date() - d) / 1000

  if (diff < 60) {
    return '刚刚'
  } else if (diff < 3600) {
    return Math.floor(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.floor(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 7) {
    return Math.floor(diff / (3600 * 24)) + '天前'
  } else if (diff < 3600 * 24 * 30) {
    return Math.floor(diff / (3600 * 24 * 7)) + '周前'
  } else if (diff < 3600 * 24 * 30 * 12) {
    return Math.floor(diff / (3600 * 24 * 30)) + '个月前'
  } else {
    return Math.floor(diff / (3600 * 24 * 30 * 12)) + '年前'
  }
}


exports.getTagInfo = function (item) {
  var schema = {
    top: {
      text: '置顶',
      className: 'top'
    },
    good: {
      text: '精华',
      className: 'good'
    },
    share: {
      text: '分享',
      className: 'share'
    },
    ask: {
      text: '问答',
      className: 'ask'
    },
    job: {
      text: '招聘',
      className: 'job'
    },
    dev: {
      text: '测试',
      className: 'dev'
    }
  }

  if (item.top) {
    return schema.top
  } else if (item.good) {
    return schema.good
  } else if (item.tab) {
    return schema[item.tab]
  } else {
    return {
      text: '暂无',
      className: ''
    }
  }
}

exports.getIndexTitle = function (tab) {
  var schema = {
    all: {
      title: 'CNode：Node.js专业中文社区',
      head: '首页'
    },
    good: {
      title: '精华版块 - CNode技术社区',
      head: '精华'
    },
    share: {
      title: '分享版块 - CNode技术社区',
      head: '分享'
    },
    ask: {
      title: '问答版块 - CNode技术社区',
      head: '问答'
    },
    job: {
      title: '招聘版块 - CNode技术社区',
      head: '招聘'
    },
    dev: {
      title: '测试版块 - CNode技术社区',
      head: '测试'
    }
  }

  return schema[tab]
}

exports.tabOptions = [
  {
    value:'share',
    text:'分享'
  },
  {
    value:'ask',
    text:'问答'
  },
  {
    value:'job',
    text:'招聘'
  },
  {
    value:'dev',
    text:'测试'
  }
]
