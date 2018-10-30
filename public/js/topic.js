function lazyLoad() {
  $('.reply-list .avatar').each(function () {
    var totalHeight = window.pageYOffset + window.innerHeight
    if (this.offsetTop <= totalHeight) {
      this.src = $(this).attr('data-src')
    }
  })
}

function getCookie(key) {
  var arr = document.cookie.split(';')
  for (let i = 0; i < arr.length; i++) {
    var item = arr[i]
    var temp = item.split('=')
    if (temp[0].trim() === key) {
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


// 评论
function comment({topicId, content, reply_id = ''}) {
  var url = `https://cnodejs.org/api/v1/topic/${topicId}/replies`

  $.post(url, {
    accesstoken: getCookie('accessToken'),
    content,
    reply_id
  }).then((res) => {
    if (res.success) {
      tip('评论发表成功')
      setTimeout(() => {
        window.location.reload(true)
      }, 2000)
    }
  }).catch(() => {
    tip('评论发表失败,请重新发表.')
  })

}

// 对评论点赞
function awesome(accesstoken, reply_id) {
  var url = `https://cnodejs.org/api/v1/reply/${reply_id}/ups`
  $.post(url, {
    accesstoken
  }).then((res) => {
    if (res.success) {
      // console.log(res.action)
      if (res.action === 'up') {
        $(this).addClass('active')
        let num = Number($(this).prev().html())
        $(this).prev().html(++num)
      } else {
        $(this).removeClass('active')
        let num = Number($(this).prev().html())
        num = --num === 0 ? '' : num
        $(this).prev().html(num)
      }
    }
  })
}

$(function () {

  var accessToken = getCookie('accessToken')
  var topicId = $('#topicId').val()

  // 图片懒加载
  lazyLoad()
  $(window).scroll(lazyLoad)

  // 发表评论
  $('#send').click(function () {
    var content = $('#user-comment').val().trim()

    if (!content) {
      tip('评论不能为空')
    } else {
      comment({
        topicId, content
      })
    }
  })

  // 取消发表
  $('#cancel').click(function () {
    $('#user-comment').val('').focus()
  })

  // 对另一个评论的回复
  $('.icon-reply').prop('flag', true).click(function () {
    if (this.flag) {
      this.flag = false
      $(this).parents('li').append(`<div class="comment">
    <textarea placeholder="写下你的评论..."></textarea>
    <div class="ctrl">
      <button class="cancel">取消</button>
      <button class="send">发送</button>
    </div>
  </div>`)
      $('.reply-list .comment>textarea').focus().val(`@${$(this).parents('li').find('.name').text()} `)
      $('.reply-list .cancel').click(function () {
        $(this).parents('.comment').remove()
        $('.icon-reply').prop('flag', true)
      })
      $('.reply-list .send').click(function () {
        var topicId = $('#topicId').val()
        var content = $(this).parents('.comment').find('textarea').val().trim()
        var reply_id = $(this).parents('li').children('input[type=hidden]').val()
        if (!content) {
          tip('评论不能为空')
        } else {
          comment({
            topicId, content, reply_id
          })
        }
      })
    } else {
      $(this).parents('li').children('.comment').remove()
      this.flag = true
    }
  })

  // 点赞
  $('.icon-awesome').click(function () {
    if (!accessToken) {
      window.location.href = `/login?origin=${encodeURIComponent(window.location.href)}`
      return
    }
    var reply_id = $(this).parents('li').find('input[type=hidden]').val()
    awesome.call(this, accessToken, reply_id)
  })

  // 收藏主题
  $('#collect-btn').click(function () {
    if ($(this).attr('is_collect') === 'false') {
      let url = 'https://cnodejs.org/api/v1/topic_collect/collect'
      $.post(url, {
        accesstoken: accessToken,
        topic_id: topicId
      }).then((res) => {
        // console.log(res)
        if (res.success) {
          $(this).addClass('cancel').text('取消收藏')
          $(this).attr('is_collect', 'true')
        }
      })
    } else {
      let url = 'https://cnodejs.org/api/v1/topic_collect/de_collect'
      $.post(url, {
        accesstoken: accessToken,
        topic_id: topicId
      }).then((res) => {
        // console.log(res)
        if (res.success) {
          $(this).removeClass('cancel').text('收藏')
          $(this).attr('is_collect', 'false')
        }
      })
    }


  })


})
