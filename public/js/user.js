$(function () {

  $('.recent > li').click(function () {
    $(this).addClass('current').siblings().removeClass('current')
    $('.topic-container>div').eq($(this).index()).show().siblings().hide()
  })
})
