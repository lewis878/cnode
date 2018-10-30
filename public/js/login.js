function tip(message) {
  clearTimeout(this.timer)
  $('.alert').addClass('show').text(message)
  this.timer = setTimeout(() => {
    $('.alert').removeClass('show')
  }, 2000)
}

function getOrigin(str) {
  var arr = str.split('&')
  for (let i = 0; i < arr.length; i++) {
    var item = arr[i]
    var temp = item.split('=')
    if (temp[0] === 'origin') {
      return temp[1]
    }
  }
}

function login(){
  var token = $('#input').val().trim()
  if (!token) {
    tip('accessToken不能为空')
  } else {
    var url = 'https://cnodejs.org/api/v1/accesstoken'
    $.post(url, {
      accesstoken: token
    }).then((d) => {
      // console.log(d)
      var search = window.location.search
      document.cookie = `id=${d.id};`
      document.cookie = `name=${d.loginname};`
      document.cookie = `avatar=${d.avatar_url};`
      document.cookie = `accessToken=${token};`
      window.location.href = search ? decodeURIComponent(getOrigin(search.slice(1))) : '/'
    }).catch(() => {
      tip('错误的accessToken 或 服务端抽风!')
    })
  }
}


$(function () {
  $('.login button').click(login)
})


