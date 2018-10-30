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

function tip(message) {
  clearTimeout(this.timer)
  $('.alert').addClass('show').text(message)
  this.timer = setTimeout(() => {
    $('.alert').removeClass('show')
  }, 2000)
}


function update({topic_id, title, tab, content}) {
  var url = 'https://cnodejs.org/api/v1/topics/update'
  $.post(url, {
    accesstoken: getCookie('accessToken'),
    topic_id,
    title,
    tab,
    content
  }).then((res) => {
    if (res.success) {
      tip('主题编辑成功')
      setTimeout(() => {
        window.location.href = '/?tab=' + tab
      }, 1500)
    }
  }).catch(() => {
    tip('主题编辑失败,请重新编辑')
  })
}


$(function () {
  $('.issue').click(function () {

    var topic_id = $('#topic_id').val()
    var title = $('.title input').val().trim()
    var tab = $('#select-tab option:selected').val()
    var content = $('.content textarea').val().trim()

    if (title.length <= 10) {
      tip('标题字数10字以上')
    } else if (!content.length) {
      tip('主题内容不能为空')
    } else {
      update({topic_id, title, tab, content})
    }

  })
})

