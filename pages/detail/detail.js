const app = getApp();

Page({
    data: {
        showitem: {},
        id: 1
    },
    onShow() {
        let create_list = wx.getStorageSync('create_list');
        // const id = location.href;
        // console.log(id);
        var pages = getCurrentPages()    //获取加载的页面

        var currentPage = pages[pages.length-1]    //获取当前页面的对象

        var url = currentPage.route    //当前页面url

        var options = currentPage.options    //如果要获取url中所带的参数可以查看options
        // console.log(options);
        const id = options.id;
        if(create_list) {
          const list = this.formatListData(JSON.parse(create_list));
          this.setData({
            showitem: list[id]
          })
        }
    },
    formatListData(list) {
        return list.map(item => JSON.parse(item))
    },
})