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
  // 图片懒加载
  lazyLoad()
  $(window).scroll(lazyLoad)
})
