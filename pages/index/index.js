//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    listData: [
      {
        name: 'id1',
        location: '滨江盛庐小区'
      },
      {
        name: 'id2',
        location: '滨江盛庐小区'
      },
      {
        name: 'id3',
        location: '滨江盛庐小区'
      },
      {
        name: 'id4',
        location: '滨江盛庐小区'
      },
    ],
    currentIndex: 0,
    startPageY: 0,
    moveY: 0,
    startPageX: 0,
    moveX: 0,
    moveLength: 0,
    currentLength: 75,
    moveIndex: -1
  },
  bindtouchstart: function (event) {
    this.setData({
      startPageY: event.touches[0].pageY,
      startPageX: event.touches[0].pageX,
    })
  },
  bindtouchmove: function (event) {
    // console.log(event.touches[0].pageY);
    let length;
    if (event.touches[0].pageX - this.data.startPageX > 0) {
      length = (event.touches[0].pageX - this.data.startPageX);
    } else {
      length = -(this.data.startPageX - event.touches[0].pageX);
    }
    // console.log('length:', length, 'achieve:', -325 + length);
    // length = Math.sqrt();
    this.setData({
      moveY: event.touches[0].pageY - this.data.startPageY,
      moveX: event.touches[0].pageX - this.data.startPageX,
      moveLength: this.data.currentLength+length,
    });
  },
  bindtouchend: function(event) {

    // 竖直的操作
    console.log(this.data.moveY);
    if (this.data.moveY < -50) {
      const index = this.data.currentIndex;
      this.data.listData.splice(index, 1);
      const newList = this.data.listData;
      this.setData({
        moveIndex: this.data.currentIndex
      })
      setTimeout(() => {
        this.setData({
          listData: newList,
          moveIndex: -1
        })
      }, 500)
    
      // this.setData({
      //   listData: newList
      // })
      // console.log(newList);
      return;
    }
    let currentLength = this.data.currentLength;
    let length = this.data.listData.length + 1;
    if (this.data.listData.length > 1 ) {
      if (this.data.moveX >= 10 && this.data.currentIndex > 0) {
        currentLength +=645;
        this.setData({
          currentLength: currentLength,
          currentIndex: this.data.currentIndex - 1
        })
      } else if (this.data.moveX <= -10 && this.data.currentIndex + 2 <= this.data.listData.length) {
        currentLength -= 645;
        this.setData({
          currentLength: currentLength,
          currentIndex: this.data.currentIndex + 1
        })
      }
      this.setData({
        moveLength: currentLength,
      })
    } else {
      this.setData({
        moveLength: 100
      })
    }


    
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
  onLoad: function () {
    if (this.data.listData.length > 1) {
      this.setData({
        moveLength: 75
      })
    } else {
      this.setData({
        moveLength: 75
      })
    }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  }
})
