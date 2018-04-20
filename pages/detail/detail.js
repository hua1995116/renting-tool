const app = getApp();

Page({
    data: {
        showitem: {},
        id: 1,
        imagesList: [],
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
    handleCamera() {
        const that = this;
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            var tempFilePaths = res.tempFilePaths;
            console.log(tempFilePaths);
            wx.saveFile({
                tempFilePath: tempFilePaths[0],
                success: function(res) {
                    var savedFilePath = res.savedFilePath;
                    that.setData({
                        imagesList: [savedFilePath]
                    })
                }
            })
          }
        })
    }
})