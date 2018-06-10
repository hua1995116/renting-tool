const app = getApp();
const util = require('../../utils/util.js');
import {host} from '../../utils/config';

Page({
    data: {
        showitem: {},
        id: 1,
        imagesList: [],
    },
    onShow() {
        let openid = wx.getStorageSync('openid');
        let create_list = wx.getStorageSync('create_list');
        const pages = getCurrentPages() //获取加载的页面
        const currentPage = pages[pages.length - 1] //获取当前页面的对象
        const url = currentPage.route //当前页面url
        const options = currentPage.options //如果要获取url中所带的参数可以查看options

        const id = options.id;
        if (create_list) {
            let list = JSON.parse(create_list);
            console.log(list);
            list = list.map(item => {
                return {
                    date: util.formatTime(new Date(item.date)),
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
                showitem: list[id],
                houseId: list[id].houseId,
                openid,
            });
            this.fetch(this.data.openid, this.data.houseId);
        }
    },
    fetch(openid, houseId) {
        const that = this;
        wx.request({
            url: `${host}/upload/house-img-list`,
            data: {
              openid,
              houseId
            },
            success: function(res) {
              const {data} = res.data;
              that.setData({
                imagesList: data,
              })
            },
            fail: function() {
            }
        })
    },
    formatListData(list) {
        return list.map(item => JSON.parse(item))
    },
    handleCamera() {
        // console.log(this.data.showitem);
        // console.log(this.data.openid);
        const that = this;
        // console.log(that.data.imagesList);
        // return;
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
            url: `${host}/upload/houst-img`,
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
                    const list =  that.data.imagesList.concat(res.url);
                    this.setData({
                        imagesList: list
                    })
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