var Bmob = require('../utils/bmob.js');

var menu_database = new Array();

var Dish = Bmob.Object.extend("dish");
var query = new Bmob.Query(Dish);
// 查询所有数据
query.find({
  success: function (results) {
    //console.log("共查询到 " + results.length + " 条记录");
    // 循环处理查询到的数据
    for (var i = 0; i < results.length; i++) {
      var object = results[i];
      var temp_data = new Object();
      temp_data.title = object.get('dish_name');
      temp_data.price = object.get('dish_price');
      temp_data.postId = object.get('dish_post_id');
      temp_data.sketch = object.get('dish_sketch');
      temp_data.menuImg = object.get('dish_img')._url;
      temp_data.storeTotal = object.get('dish_store_total');
      temp_data.standard = '[{"0":"小份","1":"中份","2":"大份","3":"超大份","name":"份量","code":"cm"},{"1":"超辣","0":"微辣","2":"无辣","name":"口味","code":"ys"}]';
      menu_database[i] = temp_data;
    }
  },
  error: function (error) {
    console.log("查询失败: " + error.code + " " + error.message);
  }
});

module.exports = {
  postList: menu_database
}