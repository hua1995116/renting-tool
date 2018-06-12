const app = getApp();
import {host} from '../../utils/config';

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
    let openid = wx.getStorageSync('openid');
    let avatarUrl = wx.getStorageSync('avatarUrl');
    let nickName = wx.getStorageSync('nickName');
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        that.setData({
          latitude,
          longitude
        })
      }
    })
    if(!openid) {
      // this.handleLogin();
    } else {
      this.setData({
        openid,
        avatarUrl,
        nickName
      });
      wx.request({
        url: `${host}/house/list`,
        data: {
          openid,
        },
        success: function(res) {
          const {data} = res.data;
          that.setData({
            listData: data,
          })
          wx.setStorageSync('create_list', JSON.stringify(data));
          // console.log(res);
        },
        fail: function() {
          let create_list = wx.getStorageSync('create_list');
          if(create_list) {
            const list = (JSON.parse(create_list));
            that.setData({
              listData: list
            })
          }
        }
      })
    }
  },
  getItem(a, b) {
    return 11;
  },
  handlegetUser(res) {
    this.handleLogin(res.detail);
  },
  handleLogin(info) {
    const that = this;
    wx.login({
      success: function(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: `${host}/user/getId`,
            data: {
              code: res.code
            },
            success: function(res) {
              const {openid} = res.data;
              wx.setStorageSync('openid', openid)
              console.log(openid);
              that.setData({
                openid,
              })
              that.handleUserInfo(info);
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg);
        }
      }
    });
    // wx.getUserInfo({
    //   success: function(res) {
    //     console.log(res);
    //     that.handleUserInfo(res);
    //   },
    //   fail: function(e){
    //     console.log(e);
    //   }
    // }) 
  },
  handleUserInfo(res) {
    const that = this;
    const {userInfo} = res;
    const {nickName, avatarUrl, gender, province, city, country} = userInfo;
    console.log('handleUserInfo'+this.data.openid);
    wx.request({
      url: `${host}/user/login`,
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
        console.log(res.data);
        if(res.data.code === 200 || res.data.code === 201) {
          console.log('登陆成功');
          wx.showToast({
            title: '登陆成功!',
            icon: 'success',
            duration: 2000
          })
        }
      }, 
      fail: function(err) {
        console.log(err);
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
  handleCreate() {
    this.handleUrl();
  },

  handleDelete(e) {
    const _this = this;
    const id = e.currentTarget.id;
    console.log(this.data.listData[id]);
    
    // return;
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
          _this.handleDateDel(_this.data.listData[id].houseId);
          // console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  handleDateDel(houseId) {
    console.log(houseId);
    const _this = this;
    wx.request({
      url: `${host}/house/delete`,
      data: {
        openid: _this.data.openid,
        houseId
      },
      success: function(res) {
        if(res && res.data.code === 201) {
          console.log('del success');
          wx.showToast({
            title: '删除成功!',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
  }
})