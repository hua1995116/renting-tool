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

        const id = options.id;
        if(create_list) {
          let list = JSON.parse(create_list);
          console.log(list);
          list = list.map(item => {
              return {  
                date: item.date,
                houseId: item.houseId,
                id: item.id,
                image: item.image,
                iphone: item.iphone,
                location: item.location,
                openid: item.openid,
                type: JSON.parse(item.type),
              }
          })  
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
        const length = this.data.imagesList.length;
        if(length >= 9) {
            wx.showToast({
                title: '上传超过最大张数！',
                icon: 'success',
                duration: 2000
            })
        } else {
            const count = 9 - length;
            wx.chooseImage({
                count, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                  // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                  var tempFilePaths = res.tempFilePaths;
                  that.data.imagesList.push(...tempFilePaths);
                  console.log(that.data.imagesList);
                //   console.log(tempFilePaths);
                  wx.uploadFile({
                      url: 'http://localhost:7788/upload/houst-img', //仅为示例，非真实的接口地址
                      filePath: JSON.stringify(tempFilePaths[0]),
                      name: 'file',
                      success: function(res){
                        var data = res.data;
                        //do something
                      }
                  })
                }
            })
        }
        
    }
})