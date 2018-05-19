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
    ],
    getLocation: false
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
      },
      fail: function(res){
        // fail 
        if(!_this.data.getLocation) {
          wx.openSetting({
            //重新请求获取定位
            success: (res) => {
              console.log(res);
              if(res.authSetting['scope.userLocation']) {
                _this.setData({
                  getLocation: true
                })
              }
            }
          })
        }
      },
    })
  },
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  formDataImage: function(num) {
    const url = './images/food/food_@.png';
    num = num > 10 ? num : `0${num}`;
    return url.replace('@', num);
  },
  formSubmit: function(e) {
    const image = parseInt(Math.random() * 19 + 1);
    let value = {...e.detail.value, image: this.formDataImage(image)};
    console.log(value);
    const formData = value;
    wx.request({
      url: 'http://localhost:7788/house/addItem',
      data: {
        openid,        
        location: formData.location,
        iphone: formData.iphone,
        date: formData.date,
        type: formData.facility,
        logo: formData.image,
        imgList,
      },
      success: function(res) {
        
      }
    })
    return;
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