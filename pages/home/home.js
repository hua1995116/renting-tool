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
  },
  onShow() {
    let create_list = wx.getStorageSync('create_list');
    if(create_list) {
      const list = this.formatListData(JSON.parse(create_list));
      console.log(list);
      this.setData({
        listData: list
      })
    }
  },
  handletap(e) {
    // console.log(e);
    const id = e.currentTarget.id;
    // this.setData({
    //   ishow: true,
    //   id: +id+1
    // });
    // let animation;
    // animation = wx.createAnimation({
    //   transformOrigin: "center center",
    //   duration: 1000,
    //   timingFunction: 'ease',
    // });
    // this.animation = animation;

    // setTimeout(function(){
    //   animation.opacity(1).step(); 
    //   this.setData({
    //     animationData:animation.export(),
    //     showitem: this.data.listData[id],
    //   });
    // }.bind(this), 500);
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
  handleClose() {
    this.animation.opacity(0).step(); 
    this.setData({
      animationData:this.animation.export(),
    });
    setTimeout(function() {
      this.setData({
        ishow: false,
        showitem: {}
      })
    }.bind(this), 500);
  },
  
})