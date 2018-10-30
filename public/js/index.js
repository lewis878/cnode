function getTab() {
  var tab
  if (window.location.search) {
    var arr = window.location.search.substring(1).split('&')
    arr.forEach((item) => {
      if (item.indexOf('tab=') !== -1) {
        tab = item.split('=')[1]
      }
    })
  } else {
    tab = 'all'
  }
  return tab
}

function getLastTime(str) {
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

function getTagInfo(item) {
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

// 函数节流
function throttle(method, delay, duration) {
  var timer = null;
  var begin = new Date();
  return function () {
    var context = this, args = arguments;
    var current = new Date();
    clearTimeout(timer);
    if (current - begin >= duration) {
      method.apply(context, args);
      begin = current;
    } else {
      timer = setTimeout(function () {
        method.apply(context, args);
      }, delay);
    }
  }
}

function getTopics(tab, page) {
  var url = `https://cnodejs.org/api/v1/topics?tab=${tab}&page=${page}&limit=20&mdrender=true`
  $.get(url).then((res) => {
    if (res.data && res.data.length) {
      $('.topic-list').append(res.data.map((item) =>
        `<li>
      <a href="/topic/${item.id}" target="_blank">
      <h2 class="title">
      <span class="tag ${getTagInfo(item).className}">${getTagInfo(item).text}</span>
      <span class="text">${item.title}</span>
    </h2>
    <div class="content">
      <img data-src="${item.author.avatar_url}" width="40" height="40" class="avatar">
      <div class="info">
        <p>
          <span>${item.author.loginname}</span>
          <span><b>${item.reply_count}</b> /${item.visit_count}</span>
        </p>
        <p>
          <time>${getLastTime(item.create_at)}</time>
          <time>${getLastTime(item.last_reply_at)}</time>
        </p>
      </div>
    </div>
    </a>
  </li>`
      ).join(''))
    } else {
      // 数据全部加载完毕,移除loading
      $('.loading').remove()
    }
  })
}

// 图片懒加载
function lazyLoad() {
  $('.topic-list .avatar').each(function () {
    var totalHeight = window.pageYOffset + window.innerHeight
    if (this.offsetTop <= totalHeight) {
      this.src = $(this).attr('data-src')
    }
  })
}



$(function () {
  var tab = getTab(), page = 1

  // 上拉加载
  function getScrollData() {
    var totalHeight = window.pageYOffset + window.innerHeight
    if (document.documentElement.offsetHeight <= totalHeight + 200) {
      getTopics(tab, ++page)
    }
  }

  $(window).scroll(throttle(getScrollData, 300, 500))

  // 图片懒加载
  lazyLoad()
  $(window).scroll(lazyLoad)

})
