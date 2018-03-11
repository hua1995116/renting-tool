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
      }
    });

    const animation = wx.createAnimation({
      transformOrigin: "center center",
      duration: 1000,
      timingFunction: 'ease',
    });
    this.animation = animation;

    this.animation.left(left).top(top).backgroundColor('#f6ffed').width('10px').height('10px').scale(200).step()

    this.setData({
      animationData:this.animation.export()
    });

    setTimeout(function(){
      this.animation.width('100%').height('100%').top(0).left(0).scale(1).step();
      this.setData({
        animationData:this.animation.export(),
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
    if(this.data.showitem.location) {
      this.animation.width(0).height(0).step();
      this.setData({
        showitem: {},
        animationData: this.animation.export()
      });
      this.animation = {};
    } else {
      wx.navigateTo({
        url: '../createhouse/createhouse'
      })
      
    }
  }
})