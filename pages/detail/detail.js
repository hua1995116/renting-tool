const app = getApp();

Page({
    data: {
        showitem: {},
        id: 1,
        imagesList: ['http://p9p788xph.bkt.clouddn.com/1527951803625-wx9b0e913c3e69d62e.o6zAJsxBRiaid9xcmfNXluf8qmoU.amI7pLkULHhK8190a8108744d7780c34de64ff5cad13.jpg'],
    },
    onShow() {
        let openid = wx.getStorageSync('openid');
        this.setData({
            openid,
        })
        let create_list = wx.getStorageSync('create_list');
        // const id = location.href;
        // console.log(id);
        var pages = getCurrentPages() //获取加载的页面

        var currentPage = pages[pages.length - 1] //获取当前页面的对象

        var url = currentPage.route //当前页面url

        var options = currentPage.options //如果要获取url中所带的参数可以查看options

        const id = options.id;
        if (create_list) {
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
        

        // console.log(this.data.showitem);
        // console.log(this.data.openid);
        const that = this;
        that.data.imagesList.push('http://p9p788xph.bkt.clouddn.com/1527951803625-wx9b0e913c3e69d62e.o6zAJsxBRiaid9xcmfNXluf8qmoU.amI7pLkULHhK8190a8108744d7780c34de64ff5cad13.jpg');
        console.log(that.data.imagesList);
        return;
        const length = this.data.imagesList.length;
        if (length >= 9) {
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
                    
                    //   console.log(tempFilePaths);
                    var successUp = 0; //成功个数
                    var failUp = 0; //失败个数
                    var length = tempFilePaths.length; //总共个数
                    var i = 0; //第几个
                    that.uploadDIY(tempFilePaths, successUp, failUp, i, length);
                    // wx.uploadFile({
                    //     url: 'http://localhost:7788/upload/houst-img', //仅为示例，非真实的接口地址
                    //     filePath: tempFilePaths[0],
                    //     name: 'file',
                    //     success: function(res){
                    //         var data = res.data;
                    //         //do something
                    //     }
                    // })
                }
            })
        }

    },
    uploadDIY(filePaths, successUp, failUp, i, length) {
        const {
            houseId
        } = this.data.showitem;
        // console.log(this.data.openid);
        const openid = this.data.openid;
        const that = this;
        wx.uploadFile({
            url: 'http://localhost:7788/upload/houst-img',
            filePath: filePaths[i],
            name: 'file',
            formData: {
                openid,
                houseId
            },
            success: (resp) => {
                successUp++;
                console.log(resp);
                const res = JSON.parse(resp.data);
                if(res.code === 0) {
                    that.data.imagesList.push(res.url);
                    console.log(res.url);
                }
            },
            fail: (res) => {
                failUp++;
            },
            complete: () => {
                i++;
                if (i == length) {
                    wx.showToast({
                        title: '总共' + successUp + '张上传成功,' + failUp + '张上传失败！',
                        icon: 'success',
                        duration: 2000
                    })
                } else { //递归调用uploadDIY函数
                    that.uploadDIY(filePaths, successUp, failUp, i, length);
                }
            },
        });
    },
})