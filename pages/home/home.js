const app = getApp();

Page({
  data: {
    listData: [],
    animationData: {},
    createPosition: {
      left:0,
      top:0,
    },
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
    console.log(e);
    const id = e.currentTarget.id;
    const left = e.touches[0].pageX;
    const top = e.touches[0].pageY;
    this.setData({
      createPosition: {
        left,
        top
      },
      ishow: true,
    });
    let animation;
    animation = wx.createAnimation({
      transformOrigin: "center center",
      duration: 1000,
      timingFunction: 'ease',
    });
    this.animation = animation;
    animation.width('10px').height('10px').left(left).top(top).backgroundColor('#f6ffed').scale(200).step()

    this.setData({
      animationData:animation.export()
    });

    setTimeout(function(){
      animation.width('100%').height('100%').top(0).left(0).scale(1).step();
      this.setData({
        animationData:animation.export(),
      });
    }.bind(this), 1000);

    setTimeout(function(){
      this.setData({
        showitem: this.data.listData[id],
      });
    }.bind(this), 1200);

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
    // console.log(e.touches[0].pageY - this.data.startY)
    this.setData({
      moveY: e.touches[0].pageY - this.data.startY,
    });
  },
  bindtouchend() {
    console.log(this.data.moveY);
    if(this.data.moveY < -30) {
      this.handleUrl();
    }
  }
})