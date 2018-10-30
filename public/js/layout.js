// 判断滚动条滚动方向
function scroll(fn) {
  var beforeScrollTop = window.pageYOffset
  window.addEventListener("scroll", function () {
    var afterScrollTop = window.pageYOffset
    var delta = afterScrollTop - beforeScrollTop
    if (delta === 0) return false
    fn(delta > 0 ? "down" : "up")
    beforeScrollTop = afterScrollTop
  }, false)
}

// 获取指定的cookie
function getCookie(key) {
  var arr = document.cookie.split(';')
  // console.log(arr)
  for (let i = 0; i < arr.length; i++) {
    var item = arr[i]
    var temp = item.split('=')
    if (key === temp[0].trim()) {
      return temp[1]
    }
  }
}


$(function () {

  // 菜单的显示和隐藏
  $('.toolbar').click(function () {
    $('.header,.mask,.menu').addClass('show')
  })
  $('.mask').click(function () {
    $('.header,.mask,.menu').removeClass('show')
  })

  // 阻止滚动穿透
  $('.mask,.menu').on('touchmove', function (e) {
    e.preventDefault()
  })

  // 高亮导航
  $('.menu-list>li').each(function () {
    var href = $('>a', this).attr('href')
    if (window.location.href.indexOf(href) !== -1) {
      $(this).addClass('current')
    }
  })
  if (!window.location.search && window.location.pathname === '/') {
    $('.menu-list>li:first').addClass('current')
  }

  // 返回顶部
  $('.back-to-top').click(function () {
    $('html,body').animate({
      scrollTop: 0
    })
  })

  // 返回顶部按钮的显示和隐藏
  $(window).scroll(function () {
    scroll(function (dir) {
      if (window.pageYOffset >= 800 && dir === 'up') {
        $('.back-to-top').addClass('show')
      } else {
        $('.back-to-top').removeClass('show')
      }
    })
  })

  // 退出登录
  $('.user-info .logout').click(function () {
    var date = new Date()
    date.setDate(date.getDate() - 1)
    document.cookie = `id=0;expires=${date.toGMTString()};`
    document.cookie = `name=0;expires=${date.toGMTString()};`
    document.cookie = `avatar=0;expires=${date.toGMTString()};`
    document.cookie = `accessToken=0;expires=${date.toGMTString()};`
    // window.location.reload(true)
    window.location.href = '/'
  })

  // 在未登录的情况下,用户点击需要登录的页面(create,message)链接时,
  // 直接跳转登录,并记录要前往的页面的路径
  function auth(e) {
    var id = getCookie('id')
    if (!id) {
      e.preventDefault()
      if (window.location.pathname !== '/login') {
        window.location.href = `/login?origin=${encodeURIComponent($(this).attr('href'))}`
      }
    }
  }
  $('.create>a').click(auth)
  $('.menu-list a[href="/message"]').click(auth)

})
