<template>
	<view>
		<view class="container">
			<view style="text-align: center;">
				<image style="width: 120upx;height: 120upx;margin-top: 140upx;border-radius:20upx"
					src="../../static/img/logo.png"></image>
				<view style="font-size: 28upx;margin-top: 32upx">你的外卖省钱专家</view>
				<view style="margin-top: 100upx;color: #FD6416;font-size: 32upx;font-weight: bold;">会员特权</view>
				<view style="margin-top: 32upx">1、会员购买商品享受省钱+返现！</view>
				<view style="margin-top: 2px">2、邀好友享受永久团队佣金提成！</view>
				<view style="margin-top: 2px">3、分享商品给好友购买拿高额佣金！</view>
				<!-- <view style="margin-top: 32upx">请长按复制授权链接粘贴到浏览器打开</view> -->
				<!-- <view class="margin-top padding-lr" style="color: #FD6416;font-size: 32upx">
					<text selectable="true" user-select='true' style="width: 100%;">{{tkl}}</text>
				</view> -->
				<view style="font-size: 32upx;margin: 52upx 30upx 0;color: #FD6416;font-size: 32upx;font-weight: bold;">
					{{ des }}
					
				</view>

				<!-- <button class="confirm-btn" @click="goHome">{{ description }}</button> -->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				weiXin: false,
				urls: '',
				description: '立即申请',
				show_share: false,
				des: '',
				timer: null,
				userInfo: 'userInfo',
				relation_id: '',
				tkl: '',
				isOpen: false
			};
		},
		onPullDownRefresh: function() {
			uni.stopPullDownRefresh(); // 停止刷新
		},
		onUnload: function() {
			if (this.timer) {
				clearInterval(this.timer);
				this.timer = null;
			}
		},
		onLoad(d) {
			this.isOpen = true
			//#ifdef H5
			let ua = navigator.userAgent.toLowerCase();
			if (ua.indexOf('micromessenger') !== -1) {
				this.weiXin = true;
				if (window.location.href.indexOf('?uid=') !== -1 && window.location.href.indexOf('&time=order') === -1 &&
					window.location
					.href.indexOf('&code=') === -1) {
					window.location.href = window.location.href + '&time=order';
				}
				if (window.location.href.indexOf('?uid=') === -1 && window.location.href.indexOf('?time=order') === -1 &&
					window.location
					.href.indexOf('&code=') === -1) {
					window.location.href = window.location.href + '?time=order';
				}
			} else {
				if (window.location.href.indexOf('?code=') !== -1 || window.location.href.indexOf('&code=') !== -1) {
					let code;
					if (window.location.href.indexOf('?code=') !== -1) {
						code = window.location.href.split('?code=')[1].split('&')[0];
					} else {
						code = window.location.href.split('&code=')[1].split('&')[0];
					}
					this.getUserInfo(code);
				}
				if (window.location.href.indexOf('?uid=') !== -1 && window.location.href.indexOf('&token=') !== -1) {
					let uid = window.location.href.split('?uid=')[1].split('&')[0];
					let token = window.location.href.split('&token=')[1].split('&')[0];
					this.$queue.setData('token', token);
					this.$queue.setData('userId', uid);
					//#ifdef H5
					let ua = navigator.userAgent.toLowerCase();
					if (ua.indexOf('micromessenger') === -1) {
						this.getUserInfos(uid);
					}
					//#endif
					//#ifndef H5
					this.getUserInfos(uid);
					//#endif
				}
			}
			//#endif

			this.getTKL()

		},
		onShow() {
			let that = this
			let userId = that.$queue.getData('userId');
			that.$Request.getT('/taobao/getRelationIdByUserId?userId=' + userId).then(res => {
				console.log(res)
				if (res.status == -200) {
					that.isOpen = true
				} else if (res.status == 200) {
					that.isOpen = false
				}
			});
		},
		methods: {
			// 获取淘口令
			getTKL() {
				let userId = this.$queue.getData('userId');
				this.$Request.getT('/taobao/getTwd?userId=' + userId).then(res => {
					this.tkl = JSON.parse(res.data).tbk_tpwd_create_response.data.model
					// console.log(this.tkl)
				});
			},
			// 复制淘口令
			copyTKL() {
				let that = this
				uni.showModal({
					content: that.tkl,
					confirmText: '复制内容',
					success: () => {
						console.log(that.tkl)
						uni.getClipboardData({
							data: that.tkl,
							success: (res) => {
								uni.showToast({
									title: '复制成功'
								})
								console.log(res)
							},
							complete: (res) => {
								console.log(res)
							}
						});
					},
				})
			},

			copyHref() {
				let token = this.$queue.getData('token');
				let userId = this.$queue.getData('userId');
				this.$Request.getT('/user/' + userId).then(res => {
					if (res.status === 0) {
						if (!res.data.relationId) {
							this.urls = this.$queue.getTaoBaoRedirect() + '?uid=' + userId + '&token=' + token
							console.log(this.urls)
						}
					}
				});
			},
			goBack() {
				uni.navigateBack({

				})
			},

			getUserInfos(userId) {
				this.$Request.getT('/user/' + userId).then(res => {
					if (res.status === 0) {
						this.$queue.setData('image_url', res.data.image_url);
						this.$queue.setData('relation_id', res.data.relationId);
						this.$queue.setData('nickName', res.data.nickName);
						this.$queue.setData('gender', parseInt(res.data.gender));
						if (res.data.relationId) {
							this.relation_id = res.data.relationId;
							this.description = '返回';
							this.des = '恭喜你已成为【省钱兄外卖】的会员，请切换到【省钱兄外卖】小程序！';
							let href = this.$queue.getData('href');
							if (href) {
								this.$queue.remove('href');
								uni.redirectTo({
									url: href
								});
							} else {
								uni.switchTab({
									url: '/pages/index/index'
								});
							}
						} else {
							this.authorized();
							this.description = '立即申请';
						}
					} else {
						this.$queue.logout();
					}
				});
			},
			closeShare() {
				this.show_share = false;
			},
			goHome() {
				let that = this;
				let userId = this.$queue.getData('userId');
				let relation = this.$queue.getData('relation');
				if (userId) {
					this.$Request.getT('/user/' + userId).then(res => {
						if (res.status === 0) {
							if (res.data.relationId) {
								this.$queue.setData('relation_id', res.data.relationId);
								let href = this.$queue.getData('href');
								if (href) {
									this.$queue.remove('href');
									uni.redirectTo({
										url: href
									});
								} else {
									uni.switchTab({
										url: '/pages/index/index'
									});
								}
							} else {
								that.authorized();
							}
						}
					});
				} else {
					this.$queue.setData('href', '/pages/member/publisher');
					//#ifdef H5
					uni.navigateTo({
						url: '/pages/member/register'
					});
					//#endif
					//#ifndef H5
					uni.navigateTo({
						url: '/pages/public/login'
					});
					//#endif
				}
			},
			authorized() {
				let ua = navigator.userAgent.toLowerCase();
				if (ua.indexOf('micromessenger') !== -1) {
					this.show_share = true;
				} else {
					window.location.assign(
						'https://oauth.taobao.com/authorize?response_type=code&client_id=' +
						this.$queue.getTaoBaoAppid() +
						'&redirect_uri=' +
						this.$queue.publicYuMing() +
						'/pages/member/publisher&state=1&view=wap'
					);
				}
			},
			getUserInfo(code) {

				let that = this;
				that.$Request
					.post('/sessionKey', {
						grant_type: 'authorization_code',
						response_type: 'code',
						client_id: this.$queue.getTaoBaoAppid(),
						client_secret: this.$queue.getTaoBaoSecret(),
						redirect_uri: this.$queue.getTaoBaoRedirect(),
						code: code
					})
					.then(res => {
						if (res) {
							that.$queue.setData('access_token', res.access_token);
							that.$queue.setData('taobao_user_nick', res.taobao_user_nick);
							that.$Request.get('/taobao/savePublisher/' + res.access_token).then(res => {
								if (res.tbk_sc_publisher_info_save_response && res
									.tbk_sc_publisher_info_save_response.data.relation_id) {
									that.$Request
										.getT('/user/bind/relationId/' + res
											.tbk_sc_publisher_info_save_response.data.relation_id + '/' + this
											.$queue
											.getData('userId'))
										.then(ress => {
											if (ress.status === 0) {
												that.$queue.setData('relation_id', ress.data.relationId);
												that.relation_id = res.tbk_sc_publisher_info_save_response
													.data.relation_id;
												if (res.tbk_sc_publisher_info_save_response.data
													.relation_id) {
													this.relation_id = res
														.tbk_sc_publisher_info_save_response.data
														.relation_id;
													this.description = '回首页分享赚钱';
													this.des = '恭喜你已成为【省钱兄外卖】的会员，请切换到【省钱兄外卖】小程序！';
												}
											} else {
												uni.showModal({
													title: '加入会员失败，请联系客服！',
													content: ress.msg,
													showCancel: false
												});
											}
										});
								} else {
									uni.showModal({
										title: '加入会员失败，请联系客服！',
										content: res.error_response.sub_msg,
										showCancel: false
									});
								}
							});
						}
					});
			}
		}
	};
</script>

<style lang="scss">
	@import '../../static/css/index.css';

	page {
		background: #ffffff;
	}

	.container {
		// top: 0;
		// padding-top: 50px;
		// position: relative;
		width: 100%;
		// height: 100%;
		// overflow: hidden;
		background: #fff;
	}

	.confirm-btn {
		width: 200px;
		height: 42px;
		line-height: 42px;
		border-radius: 30px;
		margin-top: 80upx;
		background: #FD6416;
		color: #fff;
		font-size: $font-lg;

		&:after {
			border-radius: 60px;
		}
	}

	#shareit {
		-webkit-user-select: none;
		position: fixed;
		/*width: 100%;*/
		height: 2000px;
		background: rgba(0, 0, 0, 0.85);
		text-align: center;
		top: 0;
		left: 0;
		z-index: 999;
	}

	#shareit img {
		max-width: 100%;
	}

	.arrow {
		width: 100px;
		height: 150px;
		position: absolute;
		right: 5%;
		top: 1%;
	}

	#follow {
		margin-right: 60px;
		margin-left: 30px;
		width: 90%;
		height: 50px;
		line-height: 50px;
		text-align: left;
		text-decoration: none;
		font-size: 18px;
		color: white;
		float: left;
		margin-top: 160px;
	}
</style>