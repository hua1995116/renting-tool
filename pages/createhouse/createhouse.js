const app = getApp();

Page({
  data: {
    location: '',
    iphone: '',
    date: '',
    items: [
      {name: '阳台', value: '阳台'},
      {name: '独卫', value: '独卫'},
      {name: '厨房', value: '厨房'},
      {name: '客厅', value: '客厅'},
      {name: '洗衣', value: '洗衣'},
      {name: '空调', value: '空调'},
      {name: '冰箱', value: '冰箱'},
      {name: '无线', value: '无线'},
    ]
  },
  bindLocation: function() {
    const _this = this;
    wx.chooseLocation({
      success: function (res) {
        var name = res.name;
        var address = res.address;
        var latitude = res.latitude;
        var longitude = res.longitude;
        _this.setData({
          location: name
        })
      }
    })
  },
  bindDateChange: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    console.log(JSON.stringify(e.detail.value));
    const formData = JSON.stringify(e.detail.value);
    const data = wx.getStorageSync('create_list');
    if(data) {
      const list = JSON.parse(data);
      list.push(formData);
      wx.setStorageSync('create_list', JSON.stringify(list));
      console.log(1);
    } else {
      const list = [];
      list.push(formData);
      wx.setStorageSync('create_list', JSON.stringify(list));
    }
    wx.navigateTo({
      url: '../home/home'
    })
  },
})