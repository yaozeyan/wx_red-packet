//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
		rule:false,
    userInfo: {},
    hasUserInfo: false,
		team: null,
		list: [],
		count:0,
		prize: null,
		login : false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  luckDrawTap: function() {
		var that = this;
		app.ajax("reg_user/luckDraw?openid=" + app.globalData.openid, {}, function (data) {
			app.globalData.prize = data;
			that.setData({
				prize: data
			});
		});
  },
	closeRuleTap : function(){
		this.setData({
			rule: false
		});
	},
	openRuleTap : function(){
		this.setData({
			rule : true
		});
	},
	onShareAppMessage: function (res) {
		var that = this;
		if (that.data.team==null){
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
				if (that.data.login){
					app.ajax("reg_user/createTeam?openid=" + app.globalData.openid + "&pic=" + app.globalData.userInfo.avatarUrl, {},function(data){
						app.globalData.team = data.team;
						app.globalData.list = data.list;
						app.globalData.count = data.count;
						app.globalData.prize = data.prize;
						that.setData({
							team: data.team,
							list: data.list,
							count: data.count,
							prize: data.prize
						});
					});
				}
			},
			fail: (res) => { },
			complete: (res) => { },
		}
	},
	onLoad: function () {
		var that = this;
		app.wxlogin(function(){
			that.setData({
				team: app.globalData.team,
				list: app.globalData.list,
				count: app.globalData.count,
				prize: app.globalData.prize
			});
		});
		if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
				login : true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
					login:true
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
						login : true
          })
        }
      })
    }
	},
  getUserInfo: function(e) {
		if (e.detail.userInfo!=null){
			app.globalData.userInfo = e.detail.userInfo
			this.setData({
				userInfo: e.detail.userInfo,
				hasUserInfo: true,
				login:true
			})
		}
	}
})
