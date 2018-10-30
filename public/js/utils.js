
// bde8d6af-a621-4c1c-b914-67eb47473db3

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

