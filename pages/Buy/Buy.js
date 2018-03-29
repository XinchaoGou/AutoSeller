var detail = require('../../data/posts-data.js');
var common = require('../../utils/util.js');
var Bmob = require('../../utils/bmob.js');

// 引入coolsite360交互配置设定
require('coolsite.config.js');
// 获取全局应用程序实例对象
var app = getApp();
// 创建页面实例对象
Page({
  data: {
    indicatorDots: true,
    //asd
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    isShow: false,
    warning: false,
    warnDes: "",
    number: 1,
    amount: 0,
    orderId: "",
    postData: {},
  },
  postData: {},

  onLoad: function (option) {
    app.coolsite360.register(this);
    // 获取到加入购物车选项信息
    var that = this;
    var postId = option.id;
    var item = detail.postList[postId];
    item.property = common.Tap(item.standard);
    that.setData({
      storeTotal: item.storeTotal,
      item: item,
      imgUrls: common.strToArray(item.imgBanner),
    })
  },

  // 触发coolsite360交互事件
  onShow() {
    app.coolsite360.onShow(this);
  },
  tap_3013baf2: function (e) {
    app.coolsite360.fireEvent(e, this);
  },
  tap_d5808da3: function (e) {
    app.coolsite360.fireEvent(e, this);
  },


  // 显示隐藏购物车
  showCartDetail: function () {
    this.setData({
      showCartDetail: !this.data.showCartDetail
    });
  },
  hideCartDetail: function () {
    this.setData({
      showCartDetail: false
    });
  },

  // 抽屉显示和隐藏
  setModalStatus: function (e) {
    console.log("设置显示状态，1显示0不显示", e.currentTarget.dataset.status);
    var animation = wx.createAnimation({
      duration: 388,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export()
    })
    if (e.currentTarget.dataset.status == 1) {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
    /* 抽屉弹出动画 */
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation
      })
      if (e.currentTarget.dataset.status == 0) {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)
  },

  // 抽屉弹出信息的属性值
  getChecked: function (e) {
    var that = this,
      haveCheckedProp = "",
      name = e.currentTarget.dataset.property,
      value = e.currentTarget.dataset.value,
      length, objLength;
    that.postData[name] = value;
    length = that.data.item.property.length;
    objLength = common.objLength(that.postData);
    for (var key in that.postData) {
      haveCheckedProp += " " + that.postData[key];
    }
    if (length == objLength) {
      that.setData({
        getCount: true,
      });
    }
    this.setData({
      postData: that.postData,
      haveCheckedProp: haveCheckedProp
    })
  },

  goToCounter: function () {
    var that = this,
      length = that.data.item.property.length,   //属性num
      objLength = common.objLength(that.data.postData);   //已选择属性num
    if (that.data.item.storeTotal == 0) {
      common.alert.call(that, "供应不足");
    } else {
      if (length === objLength) {
        var number = that.data.number,
          title = that.data.item.title,
          tagline = that.data.item.tagline,
          price = that.data.item.sellPrice,
          image = that.data.imgUrls[0];
        wx.navigateTo({
          url: "counter?number=" + number + "&title=" + title + "&tagline=" + tagline + "&price=" + price + "&image=" + image,
          success: function (res) {
          }
        })
      } else {
        common.alert.call(that, "请选择菜品属性");
      }
    }
  },

  addNum: function () {
    var that = this,
      num = that.data.number;
    if (num + 1 > that.data.item.storeTotal) {
      common.alert.call(that, "超过最大供应量");
    } else {
      num += 1;
      that.setData({
        number: num,
      })
    }
  },

  minusNum: function () {
    var that = this,
      num = that.data.number;
    if (num - 1 < 1) {
      common.alert.call(that, "购买份数最少为1");
    } else {
      num -= 1;
      that.setData({
        number: num,
      })
    }
  },

  // 微信支付实现
  wxpay: function () {
    var code = app.code;
    var url = 'https://www.xxy1978.com/wxpay/example/jsapi.php';
    wx.request({
      url: url,
      data: {
        code: code,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: 'MD5',
          paySign: res.data.paySign,
          success: function (res) {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 3000
            });
          },
          fail: function (res) {
            console.log("支付失败")
          },
        })
      }
    })
  },


  //苟新超 测试order表
  test_payment: function () {

    let promise = new Promise(function (resolve, reject) {

      var that = getCurrentPages()[1];

      //计算订单金额
      var Dish = Bmob.Object.extend("dish");
      var query = new Bmob.Query(Dish);
      query.equalTo("dish_name", that.data.item.title);
      query.first({
        success: function (result) {
          var price = result.get("dish_price");
          that.setData({
            amount: (price * that.data.number)
          });
          // 查询成功
          console.log("计算订单金额成功" + that.data.amount);
          resolve(that.data.amount);
        },
        error: function (error) {
          console.log("查询失败: " + error.code + " " + error.message);
          reject(error);
        }
      });
    });

    promise.then(function (value) {
      var that = getCurrentPages()[getCurrentPages().length - 1];
      var Order = Bmob.Object.extend("Order");
      var order = new Order();
      //设定昵称，菜品名称，以及数量,订单时间
      order.set("nickName", app.globalData.userInfo.nickName);
      order.set("title", that.data.item.title);
      order.set("quantity", that.data.number);
      order.set("order_time", new Date());
      //关联到用户
      var User = Bmob.Object.extend("_User");
      var user = Bmob.Object.createWithoutData("_User", Bmob.User.current().id);
      order.set("user", user);
      //设定订单口味，份量详情
      order.set("size", that.data.postData.cm);
      order.set("taste", that.data.postData.ys);
      order.set('amount', value);

      //上传订单数据
      order.save(null, {
        success: function (result) {
          // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
          console.log("创建成功, objectId:" + result.id);
          that.setData({
            orderId: result.id
          });
        },
        error: function (result, error) {
          // 添加失败
          console.log('创建失败');
        }
      });
      // success
    }, function (error) {
      // failure
      console.log("写入金额失败" + error.code + " " + error.message);
    });
  },

})

