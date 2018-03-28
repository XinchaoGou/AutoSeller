var Bmob = require('../../utils/bmob.js');
var app = getApp()
Page({
  data: {
    orders: []
  },
  onLoad: function () {
    var that = this;
    //找到用户的所有订单
    var Order = Bmob.Object.extend("Order");
    var query = new Bmob.Query(Order);
    query.equalTo("user", Bmob.User.current().id);
    // 查询所有数据
    query.find({
      success: function (results) {
        console.log("共查询到 " + results.length + " 条记录");
        var detail = new Array();
        // 循环处理查询到的数据
        for (var i = 0; i < results.length; i++) {
          var object = results[i];
          //获得订单详情
          var temp_data = new Object();
          temp_data.title = object.get('title');
          temp_data.date = object.get('order_time');
          temp_data.amount = object.get('amount');
          console.log("金额"+temp_data.amount);
          //添加订单到数组
          detail[i] = temp_data;
        }
        that.setData({
          orders: detail
        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
  },
  onShow: function () { }
});

