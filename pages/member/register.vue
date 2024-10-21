<template>
	<!-- #ifdef H5 -->
	<view class="register">
		<!-- #ifdef H5 -->
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<!-- #endif -->
		<view class="content">
			<!-- 头部logo -->
			<view class="header">
				省
			</view>
			<!-- 主体 -->
			<view class="main">
				<wInput v-model="phoneData" type="number" maxlength="11" placeholder="请输入手机号"></wInput>

				<wInput v-model="verCode" type="number" maxlength="6" placeholder="请输入验证码" isShowCode ref="runCode"
					@setCode="sendMsg()"></wInput>
				<wInput v-if="show" v-model="invitation" type="number" isShowGet ref="setNumberCode"
					@setNumberCode="isShowGet()" placeholder="请填写邀请码"></wInput>
			</view>

			<wButton text="登 录" :rotate="isRotate" @click.native="startReg()"></wButton>

			<!-- 底部信息 -->
			<view class="footer">
				<text @tap="isShowAgree" class="cuIcon" :class="showAgree?'cuIcon-radiobox':'cuIcon-round'">同意
				</text>
				<!-- 协议地址 -->
				<navigator url="/pages/member/mimi" open-type="navigate">《隐私政策》</navigator>和
				<navigator url="/pages/member/xieyi" open-type="navigate">《用户服务协议》</navigator>


			</view>

		</view>
	</view>
	<!-- #endif -->
	<!-- #ifdef MP-WEIXIN -->
	<view v-if="isCanUse">
		<view>
			<view class='headers'>
				<image src='../../static/img/logo.png'></image>
			</view>
			<view class='content'>
				<view>申请获取以下权限</view>
				<text>获得你的公开信息(昵称，头像、地区等)</text>
			</view>

			<!-- <button style="background: #FD6416;background-color: #FD6416;color: #FFFFFF;" class='bottom'
				bindtap="getUserProfile" @tap="wxGetUserInfo">
				授权登录
			</button> -->

			<button v-show="weixinPhone" style="background: #FD6416;background-color: #FD6416;color: #FFFFFF;"
				class='bottom' open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">授权手机号</button>

			<button v-show="!weixinPhone" style="background: #FD6416;background-color: #FD6416;color: #FFFFFF;"
				class='bottom' bindtap="getUserProfile" @tap="wxGetUserInfo">
				授权登录
			</button>

			<!-- <button style="background: #FD6416;background-color: #FD6416;" class='bottom' type='primary'
				bindtap="getUserProfile" @tap="wxGetUserInfo">
				授权登录
			</button> -->
		</view>
	</view>
	<!-- #endif -->
</template>

<script>
	var _this;
	import wInput from '../../components/watch-login/watch-input.vue' //input
	import wButton from '../../components/watch-login/watch-button.vue' //button

	export default {
		data() {
			return {
				SessionKey: '',
				OpenId: '',
				nickName: null,
				avatarUrl: null,
				isCanUse: uni.getStorageSync('isCanUse') || true, //默认为true
				platform: "mp",
				weixinPhone: false,
				iv: '',
				sessionkey: '',
				//logo图片 base64
				logoImage: '',
				phoneData: '', // 用户/电话
				passData: '123456', //密码
				verCode: "", //验证码
				showAgree: true, //协议是否选择
				isRotate: false, //是否加载旋转
				invitation: '',
				invitations: '',
				isEnable: '否',
				show: false,
			}
		},
		components: {
			wInput,
			wButton,
		},
		onLoad() {
			let a = this.$queue.getData("isEnable")
			if (a) {
				this.isEnable = a;
			}
			let relation = this.$queue.getData("relation");
			if (relation) {
				this.invitation = relation;
				this.show = false;
			}
			//#ifdef MP-WEIXIN

			if (relation) {
				this.invitation = relation;
			} else {
				//查询官方邀请码
				this.$Request.getT('/common/type/4').then(res => {
					if (res.status == 0) {
						this.invitation = res.data.value;
					}
				});
				// this.invitation = this.$queue.getInvitation();
			}
			// this.login()
			//#endif

		},

		mounted() {
			_this = this;
		},
		methods: {
			//小程序微信登录后获取手机号
			getPhoneNumber: function(e) {
				console.log(e);
				if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
					console.log('用户拒绝提供手机号');
				} else {
					console.log('用户同意提供手机号');
					this.setPhoneByInsert(e.detail.encryptedData, e.detail.iv);

				}
			},
			//小程序微信登录后获取手机号
			setPhoneByInsert(decryptData, iv) {
				this.$queue.showLoading('登录中...');

				let data = {
					decryptData: decryptData,
					key: this.sessionkey,
					iv: iv
				};
				this.$Request.postT('/wx/selectPhone', data).then(res => {
					if (res.status === 0) {
						uni.hideLoading();
						this.phone = res.data.phoneNumber;
						this.getWeixinInfo(this.nickName, this.avatarUrl);

					} else {
						uni.hideLoading();
						this.$queue.showToast(res.msg);
					}
				})
			},
			//第一授权获取用户信息===》按钮触发
			wxGetUserInfo() {
				let _this = this;

				wx.getUserProfile({
					desc: '业务需要',
					success: function(infoRes) {
						let nickName = infoRes.userInfo.nickName; //昵称
						let avatarUrl = infoRes.userInfo.avatarUrl; //头像
						try {
							uni.setStorageSync('isCanUse', false); //记录是否第一次授权  false:表示不是第一次授权
							_this.iv = infoRes.iv;
							_this.login(nickName, avatarUrl)

						} catch (e) {}
					},
					fail(res) {}
				});
			}, //登录

			getWeixinInfo(nickName, avatarUrl) {
				uni.showLoading({
					title: '登录中...'
				});
				let relation = this.$queue.getData("relation");
				if (relation) {
					this.invitation = relation;
				} else {
					this.invitation = this.$queue.getInvitation();
				}
				this.$Request.postJson("/user/mp/update", {
					invitation: this.invitation,
					unionid: this.$queue.getData("unionid"),
					imageUrl: avatarUrl,
					nickName: nickName,
					openid: this.$queue.getData("openid"),
					phone: this.phone,
				}).then(res => {
					if (res.status === 0) {
						this.$queue.setData("token", res.data.uuid);
						this.$queue.setData("userId", res.data.userId);
						this.$queue.setData("mobile", _this.phoneData);
						this.getUserInfo(res.data.userId, res.data.uuid);
					} else {

						uni.hideLoading();
						uni.showModal({
							showCancel: false,
							title: '登录失败',
							content: res.msg,
						});
					}
				});
			},
			login(nickName, avatarUrl) {
				let _this = this;
				uni.showLoading({
					title: '登录中...'
				});
				// 1.wx获取登录用户code
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						let code = loginRes.code;

						_this.$Request.getT("/wx/mp/login?code=" + code).then(res => {
							if (res.status === 0) {
								_this.$queue.setData("openid", res.data.open_id)
								_this.$queue.setData("unionid", res.data.unionid)
								_this.nickName = nickName; //昵称
								_this.avatarUrl = avatarUrl; //头像
								_this.sessionkey = res.data.session_key;
								uni.hideLoading()
								if (res.data.isPhone == '否') {
									_this.getWeixinInfo(_this.nickName, _this.avatarUrl);
								} else {
									if (res.data.phone) {
										_this.getWeixinInfo(_this.nickName, _this.avatarUrl);
									} else {
										_this.weixinPhone = true;
									}
								}

								//非第一次授权获取用户信息
								// _this.getWeixinInfo(nickName, avatarUrl);
							}
						});
					},
				});
			},
			navBack() {
				uni.navigateBack();
			},
			isShowGet() {
				this.show = true;
				this.invitation = this.$queue.getInvitation()
			},
			sendMsg() {
				const {
					phoneData
				} = this;
				if (!phoneData) {
					this.$queue.showToast("请输入手机号");
				} else if (phoneData.length !== 11) {
					this.$queue.showToast("请输入正确的手机号");
				} else {
					this.$queue.showLoading("正在发送验证码...");
					this.$Request.getT("/user/sendMsg/" + phoneData + "/login").then(res => {
						if (res.status === 0) {
							if (res.data === 'register') {
								this.show = true;
							}
							this.sending = true;
							this.$queue.showToast('验证码发送成功请注意查收');
							this.$refs.runCode.$emit('runCode');
							uni.hideLoading();
						} else {
							uni.hideLoading();
							uni.showModal({
								showCancel: false,
								title: '短信发送失败',
								content: res.msg ? res.msg : '请一分钟后再获取验证码',
							});
						}
					});
				}
			},
			isShowAgree() {
				//是否选择协议
				_this.showAgree = !_this.showAgree;
			},
			startReg() {
				//注册
				if (this.isRotate) {
					//判断是否加载中，避免重复点击请求
					return false;
				}
				if (this.showAgree == false) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '请先同意《协议》'
					});
					return false;
				}
				if (this.phoneData.length != 11) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '手机号不正确'
					});
					return false;
				}
				if (this.passData.length < 6) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '密码不能低于六位'
					});
					return false;
				}
				if (this.verCode.length != 6) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '验证码不正确'
					});
					return false;
				}
				if (this.show) {
					if (this.invitation.length == 0) {
						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: '请输入邀请码'
						});
						return false;
					}
				}
				_this.isRotate = true;
				this.$Request.postJson("/user/bindOpenid", {
					pwd: _this.passData,
					phone: _this.phoneData,
					msg: _this.verCode,
					platform: _this.platform,
					invitation: _this.invitation,
					openid: this.$queue.getData("openid")
				}).then(res => {
					if (res.status === 0) {
						this.$queue.setData("token", res.data.uuid);
						this.$queue.setData("userId", res.data.userId);
						this.$queue.setData("mobile", _this.phoneData);
						this.getUserInfo(res.data.userId, res.data.uuid);
					} else {
						_this.isRotate = false;
						uni.hideLoading();
						uni.showModal({
							showCancel: false,
							title: '登录失败',
							content: res.msg,
						});
					}
				});

			},

			getUserInfo(userId, token) {
				this.$Request.getT("/user/" + userId).then(res => {
					if (res.status === 0) {
						this.$queue.setData("image_url", res.data.image_url ? res.data.image_url :
							'/static/img/common/logo.jpg');
						this.$queue.setData("relation_id", res.data.relationId);
						this.$queue.setData("relation", res.data.invitation);
						this.$queue.setData("grade", res.data.grade);
						this.$queue.setData('pddpid', res.data.pdd);
						this.$queue.setData('jdpid', res.data.jd);
						this.$queue.setData("isInvitation", res.data.isInvitation);
						this.$queue.setData("nickName", res.data.nickName ? res.data.nickName : res.data.phone);
						this.$queue.setData("gender", parseInt(res.data.gender));
						let href = this.$queue.getData("href");
						if (href) {
							if (href === '/pages/member/publisher') {
								this.$queue.remove("href");
								uni.redirectTo({
									url: '/pages/member/publisher?uid=' + userId + '&token=' + token
								});
							} else if (href === '/pages/member/user') {
								this.$queue.remove("href");
								uni.switchTab({
									url: '/pages/member/user'
								});
							} else {
								this.$queue.remove("href");
								uni.redirectTo({
									url: href
								});
							}
						} else {
							uni.switchTab({
								url: '/pages/index/index'
							});
						}

					} else {
						uni.showModal({
							showCancel: false,
							title: '登录失败',
							content: res.msg,
						});
						this.$queue.logout();
					}
					_this.isRotate = false
				});
			}
		}
	}
</script>

<style lang='scss'>
	@import url("../../components/watch-login/css/icon.css");
	@import url("./css/main.css");

	.back-btn {
		position: absolute;
		left: 20px;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 20px;
		font-size: 20px;
		opacity: 0.8;
		color: $font-color-dark;
	}

	.headers {

		margin: 90rpx 0 90rpx 50rpx;
		border-bottom: 1px solid #ccc;
		text-align: center;
		width: 650rpx;
		height: 300rpx;
		line-height: 450rpx;
	}

	.headers image {
		border-radius: 100upx;
		width: 200rpx;
		height: 200rpx;
	}

	.content {
		margin-left: 50rpx;
		margin-bottom: 90rpx;
	}

	.content text {
		display: block;
		color: #9d9d9d;
		margin-top: 40rpx;
	}

	.bottom {
		line-height: 80upx;
		border-radius: 80upx;
		margin: 70rpx 50rpx;
		height: 80upx;
		font-size: 35rpx;
	}
</style>
