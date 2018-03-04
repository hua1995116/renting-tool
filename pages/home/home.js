const app = getApp();

Page({
  data: {
    listData: [],
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
  formatListData(list) {
    return list.map(item => JSON.parse(item))
  }
})