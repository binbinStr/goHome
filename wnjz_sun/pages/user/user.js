var _Page;

function _defineProperty(a, e, t) {
    return e in a ? Object.defineProperty(a, e, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[e] = t, a;
}

var app = getApp();

Page((_defineProperty(_Page = {
    data: {
        umoney: [],
        cardnum: [],
        jszc: {
            js_name: "",
            js_logo: "",
            js_tel: ""
        },
        isIpx: app.globalData.isIpx,
        whichone: 5,
        open_distribution: !1,
      isShow:0,
      is_modal_Hidden: !0,
      open_distribution_show:0,
    },
    onLoad: function(a) {
        app.editTabBar();
        var e = this;
        e.getUrl(), wx.getUserInfo({
            success: function(a) {
                e.setData({
                    thumb: a.userInfo.avatarUrl,
                    nickname: a.userInfo.nickName,
                    open_distribution_show:1
                });
            },
            fail:function(){
              e.setData({
                isShow: 1, 
              })
              console.log("暂未授权！！！");
            }
        });
        var t = this;
        wx.setNavigationBarColor({
            frontColor: wx.getStorageSync("fontcolor"),
            backgroundColor: wx.getStorageSync("color"),
            animation: {
                duration: 0,
                timingFunc: "easeIn"
            }
        }), app.util.request({
            url: "entry/wxapp/system",
            cachetime: "0",
            success: function(a) {
                "" != a.data.js_tel && null != a.data.js_tel && (t.data.jszc.js_tel = a.data.js_tel), 
                "" != a.data.js_name && null != a.data.js_name && (t.data.jszc.js_name = a.data.js_name), 
                "" != a.data.js_logo && null != a.data.js_logo && (t.data.jszc.js_logo = a.data.js_logo), 
                t.setData({
                    shop: a.data,
                    jszc: t.data.jszc
                });
            }
        }), app.util.request({
            url: "entry/wxapp/Plugin",
            data: {
                type: 1
            },
            showLoading: !1,
            success: function(a) {
                var e = 2 != a.data && a.data;
                console.log(e);
                console.log("分销"), console.log(a.data), t.setData({
                    open_distribution: e
                });
            }
        });
    },
  bindGetUserInfo:function(e){
    this.wxauthSetting();
  },
  wxauthSetting: function (t) {
    var s = this;
    wx.getStorageSync("openid") ? wx.getSetting({
      success: function (t) {
        t.authSetting["scope.userInfo"] ? (console.log("scope.userInfo已授权 1"),
          wx.getUserInfo({
            success: function (t) {
              s.setData({
                is_modal_Hidden: !0,
                thumb: t.userInfo.avatarUrl,
                nickname: t.userInfo.nickName,
                open_distribution_show: 1
              });
              console.log(s.data.open_distribution_show);
            }
          })) : (console.log("scope.userInfo没有授权 1"), wx.showModal({
            title: "获取信息失败",
            content: "请允许授权以便为您提供给服务",
            success: function (t) {
              s.setData({
                is_modal_Hidden: !1
              });
            }
          }));
      },
      fail: function (t) {
         s.setData({
          is_modal_Hidden: !1
        });
      }
    }) : wx.login({
      success: function (t) {
        var e = t.code;
        wx.setStorageSync("code", e), wx.getSetting({
          success: function (t) {
             t.authSetting["scope.userInfo"] ? (console.log("scope.userInfo已授权"),
              wx.getUserInfo({
                success: function (t) {
                  s.setData({
                    isShow: 0,
                    is_modal_Hidden: !0,
                    thumb: t.userInfo.avatarUrl,
                    nickname: t.userInfo.nickName,
                    open_distribution_show: 1
                  }), console.log(s.data.open_distribution_show),wx.setStorageSync("user_info", t.userInfo);
                  var a = t.userInfo.nickName, o = t.userInfo.avatarUrl, n = t.userInfo.gender;
                  app.util.request({
                    url: "entry/wxapp/openid",
                    cachetime: "0",
                    data: {
                      code: e
                    },
                    success: function (t) {
                       wx.setStorageSync("key", t.data.session_key),
                        wx.setStorageSync("openid", t.data.openid);
                      var e = t.data.openid;
                      wx.setStorage({
                        key: "openid",
                        data: e
                      }), app.util.request({
                        url: "entry/wxapp/Login",
                        cachetime: "0",
                        data: {
                          openid: e,
                          img: o,
                          name: a,
                          gender: n
                        },
                        success: function (t) {
                           wx.setStorageSync("users", t.data),
                            wx.setStorageSync("uniacid", t.data.uniacid), s.setData({
                              usersinfo: t.data
                            });
                          s.toParsent();
                        }
                      });
                    }
                  });
                },
                fail: function (t) {
                  wx.showModal({
                    title: "获取信息失败",
                    content: "请允许授权以便为您提供给服务!",
                    success: function (t) {
                      s.setData({
                        is_modal_Hidden: !1
                      });
                    }
                  });
                }
              })) : (console.log("scope.userInfo没有授权"), s.setData({
                is_modal_Hidden: !1
              }));
          }
        });
      },
      fail: function () {
        wx.showModal({
          title: "获取信息失败",
          content: "请允许授权以便为您提供给服务!!!",
          success: function (t) {
            s.setData({
              is_modal_Hidden: !1
            });
          }
        });
      }
    });
  },
    getUrl: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/url",
            cachetime: "0",
            success: function(a) {
                wx.setStorageSync("url", a.data), e.setData({
                    url: a.data
                });
            }
        });
    },
    onReady: function() {
        app.getNavList(2);
    },
    onShow: function() {
        var t = this, a = wx.getStorageSync("openid"), e = wx.getStorageSync("build_id");
        app.util.request({
            url: "entry/wxapp/Countcounp",
            method: "GET",
            data: {
                userid: a,
                build_id: e
            },
            success: function(a) {
                var e = a.data.length;
                t.setData({
                    cardnum: e
                }), t.Moneys();
            }
        });
      console.log(wx.getStorageSync("d_user_id"));
      wx.getStorageSync("d_user_id") && app.distribution.distribution_parsent(app, wx.getStorageSync("d_user_id")), t.setData({
        showAd: app.globalData.showAd
      });
    },
  toParsent: function () {
    console.log(wx.getStorageSync("d_user_id"));
    wx.getStorageSync("d_user_id") && app.distribution.distribution_parsent(app, wx.getStorageSync("d_user_id")), this.setData({
      showAd: app.globalData.showAd
    });
  },
    Moneys: function() {
        var e = this, a = wx.getStorageSync("openid");
        app.util.request({
            url: "entry/wxapp/Money",
            method: "GET",
            data: {
                userid: a
            },
            success: function(a) {
                e.setData({
                    umoney: a.data
                });
            }
        });
    },
    toBackstage: function() {
        wx.navigateTo({
            url: "../backstage/index2/index2"
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    toService: function(a) {
        wx.navigateTo({
            url: "service/service"
        });
    },
    toAddress: function(a) {
        wx.navigateTo({
            url: "address/address"
        });
    }
}, "toBackstage", function(a) {
    wx.navigateTo({
        url: "../backstage/backstage"
    });
}), _defineProperty(_Page, "toDialogue", function(a) {
    wx.navigateTo({
        url: "dialogue/dialogue"
    });
}), _defineProperty(_Page, "toBgorder", function(a) {
    wx.navigateTo({
        url: "bgorder/bgorder"
    });
}), _defineProperty(_Page, "toRecharge", function(a) {
    wx.navigateTo({
        url: "recharge/recharge"
    });
}), _defineProperty(_Page, "toBargain", function(a) {
    wx.navigateTo({
        url: "bargain/bargain"
    });
}), _defineProperty(_Page, "toCards", function(a) {
    wx.navigateTo({
        url: "cards/cards"
    });
}), _defineProperty(_Page, "dialogYZ", function(a) {
    wx.makePhoneCall({
        phoneNumber: this.data.shop.js_tel
    });
}), _defineProperty(_Page, "toAddress", function() {
    var e = this;
    wx.chooseAddress({
        success: function(a) {
            console.log(a), console.log("获取地址成功"), e.setData({
                address: a,
                hasAddress: !0
            });
        },
        fail: function(a) {
            console.log("获取地址失败");
        }
    });
}), _defineProperty(_Page, "toMybill", function(a) {
    wx.navigateTo({
        url: "mybill/mybill"
    });
}), _defineProperty(_Page, "toFxCenter", function(a) {
    this.data.open_distribution;
    var e = wx.getStorageSync("openid"), t = a.detail.formId, n = wx.getStorageSync("users");
    console.log(n);
    app.util.request({
        url: "entry/wxapp/IsPromoter",
        data: {
            openid: e,
            form_id: t,
            uid: n.id,
            status: 3,
            m: app.globalData.Plugin_distribution
        },
        showLoading: !1,
        success: function(a) {
            a && 9 != a.data ? 0 == a.data ? wx.navigateTo({
                url: "/wnjz_sun/plugin/distribution/fxAddShare/fxAddShare"
            }) : wx.navigateTo({
                url: "/wnjz_sun/plugin/distribution/fxCenter/fxCenter"
            }) : wx.navigateTo({
                url: "/wnjz_sun/plugin/distribution/fxAddShare/fxAddShare"
            });
        }
    });
}), _Page));