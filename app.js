//app.js
App({
	onShow : function(){
		const updateManager = wx.getUpdateManager();
		updateManager.onUpdateReady(function () {
			wx.showModal({
				title: '更新提示',
				content: '新版本已经准备好，是否重启应用？',
				success: function (res) {
					if (res.confirm) {
						// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
						updateManager.applyUpdate()
					}
				}
			})
		})
	},
  onLaunch: function () {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        /*if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }*/
				wx.getUserInfo({
					success: res => {
						this.globalData.userInfo = res.userInfo
						if (this.userInfoReadyCallback) {
							this.userInfoReadyCallback(res)
						}
					}
				})
      }
    })
  },
  globalData: {
    userInfo: null,
		openid : null,
		list : [],
		team : null,
		count : 0,
		prize : false,
		click : true,
		listmy : [],
		countmy : 0,
		httpUrl: "https://mlbbxcx.wxgamemini.com/MLBBRP/"
		//httpUrl: "http://192.168.1.129:8888/MLBBRP/"
  },
	ajax : function(url,data,fun){
		var that = this;
		if (!this.globalData.click)
		that.globalData.click = false;
		wx.request({
			url: this.globalData.httpUrl+url,
			data: {},
			header: {
				'content-type': 'application/json'
			},
			success: function (res) {
				that.globalData.click = true;
				if (res.data.status == 1){
					wx.showModal({
						title: '提示',
						content: res.data.msg,
						showCancel : false
					});
				}else{
					fun(res.data.msg);
				}
			}
		})
	},
	wxlogin: function(fun,team){
		var that = this;
		if (team==null){
			team="";
		}
		wx.login({
			success: res => {
				that.ajax('reg_user/getOpenId?code=' + res.code+'&team='+team, {}, function (data) {
					that.globalData.openid = data.openid;
					that.globalData.list = data.list;
					that.globalData.team = data.team;
					that.globalData.count = data.count;
					that.globalData.prize = data.prize;
					that.globalData.listmy = data.listmy;
					that.globalData.countmy = data.countmy;
					fun();
				});
			}
		})
	}
})