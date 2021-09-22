// 接口文档为：https://www.showdoc.com.cn/escook/3707158761215217

$(function() {
  // 点击“去注册账号”的链接
  $('#link_reg').on('click', function() {
    $('.login-box').hide()
    $('.reg-box').show()
  })

  // 点击“去登录”的链接
  $('#link_login').on('click', function() {
    $('.login-box').show()
    $('.reg-box').hide()
  })

  // 从 layui 中获取 form 对象
  var form = layui.form
  var layer = layui.layer
  // 通过 form.verify() 函数自定义校验规则，既支持repwd这种函数式的方式，也支持pwd这种数组的形式
  form.verify({
    // 自定义了一个叫做 pwd 校验规则，' '中的表示校验失败将提示的消息
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    // 校验两次密码是否一致的规则
    repwd: function(value) {
      // 通过形参value拿到的是确认密码框中的内容，还需要拿到密码框中的内容，然后进行一次等于的判断，如果判断失败,则return一个提示消息即可
      // 通过pwd拿到密码确认框的值
      var pwd = $('.reg-box [name=password]').val()
      if (pwd !== value) {
        return '两次密码不一致！'
      }
    }
  })

  // 监听注册表单的提交事件
  $('#form_reg').on('submit', function(e) {
    // 1. 阻止默认的提交行为
    e.preventDefault()
    // 2. 发起Ajax的POST请求
    var data = {
      // 得到用户输入的用户名和密码
      username: $('#form_reg [name=username]').val(),
      password: $('#form_reg [name=password]').val()
    }
    // 接口文档中查看接口为：/api/reguser
    $.post('/api/reguser', data, function(res) {
      // 请求是否成功，0：成功；1：失败
      if (res.status !== 0) {
        return layer.msg(res.message)
      }
      // layer.msg(content, options, end) - 提示框
      layer.msg('注册成功，请登录！')
      // 模拟人的点击行为,注册成功后自动跳转到登录界面
      $('#link_login').click()
    })
  })

  // 监听登录表单的提交事件
  $('#form_login').submit(function(e) {
    // 阻止默认提交行为
    e.preventDefault()
    $.ajax({
      url: '/api/login',
      method: 'POST',
      // 快速获取表单中的数据
      data: $(this).serialize(),
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('登录失败！')
        }
        layer.msg('登录成功！')
        // 将登录成功得到的 token 字符串，保存到 localStorage 中
        localStorage.setItem('token', res.token)
        // 跳转到后台主页
        location.href = '/index.html'
      }
    })
  })
})
