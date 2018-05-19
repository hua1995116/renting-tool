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
    avatarUrl: '',
    nickName: '',
    openid: '',
  },
  onShow() {
    const that = this;
    let create_list = wx.getStorageSync('create_list');
    if(create_list) {
      const list = (JSON.parse(create_list));
      this.setData({
        listData: list
      })
    }
    let openid = wx.getStorageSync('openid');
    let avatarUrl = wx.getStorageSync('avatarUrl');
    let nickName = wx.getStorageSync('nickName');
    if(!openid) {
      this.handleLogin();
    } else {
      this.setData({
        openid,
        avatarUrl,
        nickName
      })
    }
  },
  handlegetUser(res) {
    this.handleUserInfo(res.detail);
  },
  handleLogin() {
    const that = this;
    wx.login({
      success: function(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'http://localhost:7788/user/getId',
            data: {
              code: res.code
            },
            success: function(res) {
              const {openid} = res.data;
              wx.setStorageSync('openid', openid)
              that.setData({
                openid,
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg);
        }
      }
    });
    wx.getUserInfo({
      success: function(res) {
        console.log(res);
        that.handleUserInfo(res);
      },
      fail: function(e){
        console.log(e);
      }
    }) 
  },
  handleUserInfo(res) {
    const that = this;
    const {userInfo} = res;
    const {nickName, avatarUrl, gender, province, city, country} = userInfo;
    wx.request({
      url: 'http://localhost:7788/user/login',
      data: {
        nickName, 
        avatarUrl, 
        gender, 
        province, 
        city, 
        country,
        openid: this.data.openid
      },
      success: function(res) {
        const {openid} = res.data;
        that.setData({
          openid,
        })
      }
    })
    this.setData({
      avatarUrl: avatarUrl,
      nickName: nickName
    });
    wx.setStorageSync('avatarUrl', avatarUrl)
    wx.setStorageSync('nickName', nickName)
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