const app = getApp();

Page({
  data: {
    listData: [],
    animationData: {},
    id: -1,
    showitem: {},
    startY: 0,
    moveY: 0,
    ishow: false,
    headUrl: '',
    headName: ''
  },
  onShow() {
    const that = this;
    let create_list = wx.getStorageSync('create_list');
    if(create_list) {
      const list = (JSON.parse(create_list));
      console.log(list);
      this.setData({
        listData: list
      })
    }
    wx.getUserInfo({
      success: function(res) {
        console.log(res);
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country
        that.setData({
          headUrl: avatarUrl,
          headName: nickName
        })
      }
    })
  },
  handletap(e) {
    const id = e.currentTarget.id;
    wx.navigateTo({
      url: `../detail/detail?id=${id}`
    })
  },
  formatListData(list) {
    return list.map(item => JSON.parse(item))
  },
  handleUrl() {
    wx.navigateTo({
      url: '../createhouse/createhouse'
    })
  },
  bindtouchstart(e) {
    this.setData({
      startY: e.touches[0].pageY,
    });
  },
  bindtouchmove(e) {
    this.setData({
      moveY: e.touches[0].pageY - this.data.startY,
    });
  },
  bindtouchend() {
    console.log(this.data.moveY);
    if(this.data.moveY < -30) {
      this.handleUrl();
    }
  },
  handleDelete(e) {
    const _this = this;
    const id = e.currentTarget.id;
    wx.showModal({
      title: '提示',
      content: '是否删除该条信息',
      success: function(res) {
        if (res.confirm) {
          _this.data.listData.splice(id, 1);
          console.log(_this.data.listData);
          _this.setData({
            listData: _this.data.listData
          });
          wx.setStorageSync('create_list', JSON.stringify(_this.data.listData));
          // console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  }
})