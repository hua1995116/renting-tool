var amapFile = require('../../lib/amap-wx.js');

const app = getApp();
const util = require('../../utils/util.js');
import {host} from '../../utils/config';

Page({
    data: {
        showitem: {},
        id: 1,
        imagesList: [],
        traffic: [],
        currentTab: 0,
        food: [],
        markers: [],
    },
    
    onShow() {
        let openid = wx.getStorageSync('openid');
        let create_list = wx.getStorageSync('create_list');
        const pages = getCurrentPages() //获取加载的页面
        const currentPage = pages[pages.length - 1] //获取当前页面的对象
        const url = currentPage.route //当前页面url
        const options = currentPage.options //如果要获取url中所带的参数可以查看options

        const id = options.id;
        console.log(id);
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
                    latitude: item.latitude,
                    longitude: item.longitude
                }
            })
            this.setData({
                showitem: list[id],
                houseId: list[id].houseId,
                openid,
            });
            this.fetch(this.data.openid, this.data.houseId);
            const {latitude, longitude} = this.data.showitem;
            console.log(this.data.showitem);
            this.randIpo(latitude, longitude);
        }
    },
    swiperTab: function (e) {
        var that = this;
        that.setData({
          currentTab: e.detail.current
        });
      },
      //点击切换
      clickTab: function (e) {
        var that = this;
        if (this.data.currentTab === e.target.dataset.current) {
          return false;
        } else {
          that.setData({
            currentTab: e.target.dataset.current
          })
        }
    },
    randIpo(latitude, longitude) {
        console.log(latitude, longitude);
        const that = this;
        const key = '040d154a143d6d788ffec62f611b28b7'

        var myAmapFun = new amapFile.AMapWX({key});
        const markers = [];
        myAmapFun.getPoiAround({
            querykeywords: '地铁站',
            location: `${longitude},${latitude}`,
            success: function(data){
            //   console.log(data);
                markers.push({
                    id: 'my',
                    width: 20,
                    height: 20,
                    latitude: latitude,
                    longitude: longitude,
                    iconPath: "./images/location.png"
                })
                data.markers.map(item => {
                    markers.push({
                        id: item.id,
                        width: 20,
                        height: 20,
                        longitude: item.longitude,
                        latitude: item.latitude,
                        iconPath: './images/car.png'
                    });
                })
                that.setData({
                    markers
                })
            },
            fail: function(info){
              //失败回调
              console.log(info)
            }
        });
        
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
                if(data.length > 0) {
                    that.setData({
                        imagesList: data,
                    })
                } else {
                    const list  = [];
                    list.push(util.randomImage());
                    list.push(util.randomImage());
                    that.setData({
                        imagesList: list
                    })
                }
            },
            fail: function() {
            }
        })
    },
    formatListData(list) {
        return list.map(item => JSON.parse(item))
    },
    handleCopy (e) {
        const text = e.currentTarget.dataset.text;
        wx.setClipboardData({
            data: text,
            success: function(res) {
                wx.showToast({
                    title: '复制成功',
                    icon: 'success',
                    duration: 2000
                })
            }
          })
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