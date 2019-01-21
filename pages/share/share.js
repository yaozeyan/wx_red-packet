// pages/share/share.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
		rule: false,
		userInfo: {},
		hasUserInfo: false,
		team: null,
		shareTeam : null,
		list: [],
		count: 0,
		prize: null,
		login : false,
		canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
	closeRuleTap: function () {
		this.setData({
			rule: false
		});
	},
	openRuleTap: function () {
		this.setData({
			rule: true
		});
	},
	luckDrawTap: function () {
		var that = this;
		app.ajax("reg_user/luckDraw?openid=" + app.globalData.openid, {}, function (data) {
			app.globalData.prize = data;
			that.setData({
				prize: data
			});
		});
	},
	acceptAnInvitationTap:function(){
		var that = this;
		app.ajax('reg_user/addTeam?openid=' + app.globalData.openid + '&team=' + this.data.shareTeam + '&pic=' + app.globalData.userInfo.avatarUrl,{},function(data){
			app.globalData.team = data.team;
			app.globalData.list = data.list;
			app.globalData.count = data.count;
			that.setData({
				team: app.globalData.team,
				list: app.globalData.list,
				count: app.globalData.count
			});
		});
	},
	backTap : function(){
		wx.navigateTo({
			url: '../index/index'
		})
	},
	onShareAppMessage: function (res) {
		var that = this;
		if (that.data.team == null) {
			that.setData({
				team: app.globalData.openid,
			});
		}
		return {
			title: '6月12，兄dei组队约起来！\n《魔力宝贝》SE正版日系回合，组队拆道具红包',
			path: that.data.login == true ? '/pages/share/share?team=' + that.data.team : '/pages/index/index',
			imageUrl: '',
			query: '',
			success: (res) => {
				if (this.data.login){
					var url = "reg_user/createTeam?openid=" + app.globalData.openid + "&pic=" + app.globalData.userInfo.avatarUrl;
					app.ajax(url, {}, function (data) {
						app.globalData.team = data.team;
						app.globalData.list = data.list;
						app.globalData.count = data.count;
						that.setData({
							team: app.globalData.team,
							list: app.globalData.list,
							count: app.globalData.count
						});
					});
				}
			},
			fail: (res) => { },
			complete: (res) => { },
		}
	},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		var that = this;
		app.wxlogin(function () {
			that.setData({
				team: app.globalData.team,
				shareTeam: options.team,
				list: app.globalData.list,
				count: app.globalData.count,
				prize: app.globalData.prize
			});
			if (app.globalData.team!=null){
				if (options.team != app.globalData.team){
					/*wx.navigateTo({
						url: '../index/index?team=' + app.globalData.team
					});*/
					that.setData({
						list: app.globalData.listmy,
						count: app.globalData.countmy
					});
					wx.showModal({
						title: '提示',
						content: "你已经有队伍了",
						showCancel: false
					});
				}
			}else{
				if (app.globalData.count==5){
					wx.showModal({
						title: '提示',
						content: "来晚了！您的好友队伍已满，邀请其他好友来一起组队抢道具红包吧！",
						success: function (res){
							if (res.confirm) {
								wx.navigateTo({
									url: '../index/index'
								});
							}
						}
					}); 
				}
			}
		}, options.team);
		if (app.globalData.userInfo) {
			this.setData({
				userInfo: app.globalData.userInfo,
				hasUserInfo: true,
				login: true
			})
		} else if (this.data.canIUse) {
			// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
			// 所以此处加入 callback 以防止这种情况
			app.userInfoReadyCallback = res => {
				this.setData({
					userInfo: res.userInfo,
					hasUserInfo: true,
					login: true
				})
			}
		} else {
			// 在没有 open-type=getUserInfo 版本的兼容处理
			wx.getUserInfo({
				success: res => {
					app.globalData.userInfo = res.userInfo
					this.setData({
						userInfo: res.userInfo,
						hasUserInfo: true,
						login: true
					})
				}
			})
		}
  },
	getUserInfo: function (e) {
		if (e.detail.userInfo!=null){
			app.globalData.userInfo = e.detail.userInfo
			this.setData({
				userInfo: e.detail.userInfo,
				hasUserInfo: true,
				login: true
			})
		}
	},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  }
})