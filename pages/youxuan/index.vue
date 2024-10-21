<template>
	<view class="">
		<view class="padding-tb-xl" :style="{backgroundColor:(TabCur== '美团优选'?'#FEBD0B':'#FEBD0B')}"></view>
		<scroll-view scroll-x class="nav text-center" :style="{backgroundColor:(TabCur== '美团优选'?'#FEBD0B':'#FEBD0B')}">
			<view class="cu-item text-bold" :class="item.title==TabCur?'text-white cur':''" v-for="(item,index) in tabbar" :key="index" @tap="tabSelect(item)" :data-id="index">
				{{item.title}}
			</view>
		</scroll-view>
	
		<view v-if="TabCur== '优选'?true:''" style="padding-bottom: 50upx;">
			<image src="https://game.shengqianxiong.com.cn/img/20210629/48c48a55e65c4a41b642acf1ed123a37.png" class="top_view_image"></image>
			<view class="center_view">
				<image src="../../static/img/meituan/meituanjianbian.png" class="center_view_backgroundImage"></image>
				<view class="center_view_item">
					<view style="display: flex;">
						<image src="../../static/img/meituan/meituanlogo.png" class="logo"></image>
						<view class="logo_text">美团优选返利</view>
					</view>

					<view class="view_item_jieshao">
						<view>
							<image src="../../static/img/meituan/lingjuan.png" class="jieshao_image"></image>
							<view class="jieshao_text">先领券</view>
						</view>
						<image class="jieshao_right" src="../../static/img/meituan/xiangyou.png"></image>
						<view>
							<image src="../../static/img/meituan/xiadan.png" class="jieshao_image"></image>
							<view class="jieshao_text">再下单</view>
						</view>
						<image src="../../static/img/meituan/xiangyou.png" class="jieshao_right"></image>
						<view>
							<image src="../../static/img/meituan/fanli.png" class="jieshao_image"></image>
							<view class="jieshao_text">拿返利</view>
						</view>
					</view>


					<view class="Hongbao" @tap="goHongbao">优选领红包</view>
					<view class="flex justify-around">
						<button @click="sharurl()" class="cu-btn text-bold round lg"
							style="padding: 0px 70rpx;font-size: 30rpx;background: linear-gradient(0deg, #FFB447 0%, #FFE59F 100%);color: #6C3906;">邀请好友</button>
						<button @click.stop="onSaveImg()" class="cu-btn text-bold round lg"
							style="padding: 0px 70rpx;font-size: 30rpx;background: linear-gradient(0deg, #FFB447 0%, #FFE59F 100%);color: #6C3906;">生成海报</button>
					</view>
				</view>
			</view>


			<view class="fanli_view">
				<view class="zhuyi">返利注意事项</view>
				<view class="item_view">
					<view class="yuan"></view>
					<view class="text">美团优选，必须使用带渠道专享标记的优惠券有返利</view>
				</view>
				<view class="item_view">
					<view class="yuan"></view>
					<view class="text">领券后在红包有效期内下单均有返利。</view>
				</view>
				<view class="item_view">
					<view class="yuan"></view>
					<view class="text">收货后半小时内会有返利通知提醒</view>
				</view>
				<view class="item_view">
					<view class="yuan"></view>
					<view class="text">无论美团新老用户，每个手机号每天可领一次，红包金额随机发放</view>
				</view>
			</view>
			
			<view class="cu-modal" :class="modalName=='Modal'?'show':''">
				<view class="cu-dialog">
					<view class="cu-bar bg-white justify-end">
						<view class="content">长按复制分享给好友</view>
						<view class="action" @tap="hideModal">
							<text class="cuIcon-close text-red"></text>
						</view>
					</view>
					<view class="padding">
						<text user-select='true' selectable="true" style="width: 100%;word-break: break-all;">{{ fenxiang }}</text>
					</view>
				</view>
			</view>
			<canvas canvas-id="poster" class="poster_canvas"></canvas>
		</view>
		
		<view v-if="TabCur== '优选1.99'?true:''" style="padding-bottom: 50upx;">
			<image src="https://game.shengqianxiong.com.cn/img/20210629/c582d81803bc45fa80e7dd2079b7041f.png" class="top_view_image"></image>
			<view class="center_view">
				<image src="../../static/img/meituan/meituanjianbian.png" class="center_view_backgroundImage"></image>
				<view class="center_view_item">
					<view style="display: flex;">
						<image src="../../static/img/meituan/meituanlogo.png" class="logo"></image>
						<view class="logo_text">美团优选1.99</view>
					</view>
			
					<view class="view_item_jieshao">
						<view>
							<image src="../../static/img/meituan/lingjuan.png" class="jieshao_image"></image>
							<view class="jieshao_text">先领券</view>
						</view>
						<image class="jieshao_right" src="../../static/img/meituan/xiangyou.png"></image>
						<view>
							<image src="../../static/img/meituan/xiadan.png" class="jieshao_image"></image>
							<view class="jieshao_text">再下单</view>
						</view>
						<image src="../../static/img/meituan/xiangyou.png" class="jieshao_right"></image>
						<view>
							<image src="../../static/img/meituan/fanli.png" class="jieshao_image"></image>
							<view class="jieshao_text">拿返利</view>
						</view>
					</view>
			
			
					<view class="Hongbao" @tap="goHongbao">优选领红包</view>
					<view class="flex justify-around">
						<button @click="sharurl()" class="cu-btn text-bold round lg"
							style="padding: 0px 70rpx;font-size: 30rpx;background: linear-gradient(0deg, #FFB447 0%, #FFE59F 100%);color: #6C3906;">邀请好友</button>
						<button @click.stop="onSaveImg()" class="cu-btn text-bold round lg"
							style="padding: 0px 70rpx;font-size: 30rpx;background: linear-gradient(0deg, #FFB447 0%, #FFE59F 100%);color: #6C3906;">生成海报</button>
					</view>
				</view>
			</view>
		
			<view class="fanli_view">
				<view class="zhuyi">返利注意事项</view>
				<view class="item_view">
					<view class="yuan"></view>
					<view class="text">美团优选，必须使用带渠道专享标记的优惠券有返利</view>
				</view>
				<view class="item_view">
					<view class="yuan"></view>
					<view class="text">领券后在红包有效期内下单均有返利。</view>
				</view>
				<view class="item_view">
					<view class="yuan"></view>
					<view class="text">收货后半小时内会有返利通知提醒</view>
				</view>
				<view class="item_view">
					<view class="yuan"></view>
					<view class="text">无论美团新老用户，每个手机号每天可领一次，红包金额随机发放</view>
				</view>
			</view>
			
			<view class="cu-modal" :class="modalName=='Modal'?'show':''">
				<view class="cu-dialog">
					<view class="cu-bar bg-white justify-end">
						<view class="content">长按复制分享给好友</view>
						<view class="action" @tap="hideModal">
							<text class="cuIcon-close text-red"></text>
						</view>
					</view>
					<view class="padding">
						<text user-select='true' selectable="true" style="width: 100%;word-break: break-all;">{{ fenxiang }}</text>
					</view>
				</view>
			</view>
			<canvas canvas-id="poster" class="poster_canvas"></canvas>
		</view>
		
		<view v-if="TabCur== '秒杀'?true:''" style="padding-bottom: 50upx;">
			<image src="https://game.shengqianxiong.com.cn/img/20210629/88563fb260d844de849aab8a64db38d3.png" class="top_view_image"></image>
			<view class="center_view">
				<image src="../../static/img/meituan/meituanjianbian.png" class="center_view_backgroundImage"></image>
				<view class="center_view_item">
					<view style="display: flex;">
						<image src="../../static/img/meituan/meituanlogo.png" class="logo"></image>
						<view class="logo_text">美团优选秒杀</view>
					</view>
		
					<view class="view_item_jieshao">
						<view>
							<image src="../../static/img/meituan/lingjuan.png" class="jieshao_image"></image>
							<view class="jieshao_text">先领券</view>
						</view>
						<image class="jieshao_right" src="../../static/img/meituan/xiangyou.png"></image>
						<view>
							<image src="../../static/img/meituan/xiadan.png" class="jieshao_image"></image>
							<view class="jieshao_text">再下单</view>
						</view>
						<image src="../../static/img/meituan/xiangyou.png" class="jieshao_right"></image>
						<view>
							<image src="../../static/img/meituan/fanli.png" class="jieshao_image"></image>
							<view class="jieshao_text">拿返利</view>
						</view>
					</view>
		
					<view class="Hongbao" @tap="goHongbao">优选领红包</view>
					<view class="flex justify-around">
						<button @click="sharurl()" class="cu-btn text-bold round lg"
							style="padding: 0px 70rpx;font-size: 30rpx;background: linear-gradient(0deg, #FFB447 0%, #FFE59F 100%);color: #6C3906;">邀请好友</button>
						<button @click.stop="onSaveImg()" class="cu-btn text-bold round lg"
							style="padding: 0px 70rpx;font-size: 30rpx;background: linear-gradient(0deg, #FFB447 0%, #FFE59F 100%);color: #6C3906;">生成海报</button>
					</view>
				</view>
			</view>
		
		
			<view class="fanli_view">
				<view class="zhuyi">返利注意事项</view>
				<view class="item_view">
					<view class="yuan"></view>
					<view class="text">美团优选，必须使用带渠道专享标记的优惠券有返利</view>
				</view>
				<view class="item_view">
					<view class="yuan"></view>
					<view class="text">领券后在红包有效期内下单均有返利。</view>
				</view>
				<view class="item_view">
					<view class="yuan"></view>
					<view class="text">收货后半小时内会有返利通知提醒</view>
				</view>
				<view class="item_view">
					<view class="yuan"></view>
					<view class="text">无论美团新老用户，每个手机号每天可领一次，红包金额随机发放</view>
				</view>
			</view>
			
			<view class="cu-modal" :class="modalName=='Modal'?'show':''">
				<view class="cu-dialog">
					<view class="cu-bar bg-white justify-end">
						<view class="content">长按复制分享给好友</view>
						<view class="action" @tap="hideModal">
							<text class="cuIcon-close text-red"></text>
						</view>
					</view>
					<view class="padding">
						<text user-select='true' selectable="true" style="width: 100%;word-break: break-all;">{{ fenxiang }}</text>
					</view>
				</view>
			</view>
			<canvas canvas-id="poster" class="poster_canvas"></canvas>
		</view>
	</view>
</template>

<script>
	import configdata from '../../common/config.js';
	let settingWritePhotosAlbum = false;
	export default {
		data() {
			return {
				releationId: 0,
				shareUrl: '',
				url: '',
				bgImg: '',
				modalName: '',
				TabCur: '优选',
				activityId: 138,
				tabbar: [
					{
						title: '优选',
						value: 138
					},
					{
						title: '优选1.99',
						value: 139
					},
					{
						title: '秒杀',
						value: 140
					}
				],
				fenxiang: '',
				wenan: ''
			}
		},
		onLoad(opction) {
			//获取全局邀请码
			let relation_id = this.$queue.getData('relation_id') ? this.$queue.getData('relation_id') : this.releationId;
			this.$Request.getT('/common/type/4').then(res => {
				if (res.status == 0) {
					if (res.data && res.data.value) {
						this.releationId = relation_id ? relation_id : res.data.value;
						this.getMtUrl();
					}
				}
			});
			this.getBgImg()
		},
		methods: {
			//切换navbar
			tabSelect(e) {
				this.TabCur = e.title
				this.activityId = e.value
				this.getMtUrl();
			},
			//获取美团URL
			getMtUrl() {
				console.log(this.activityId)
				this.$Request.getT('/common/type/' + this.activityId).then(res => {
					if (res.status == 0) {
						if (res.data && res.data.value) {
							this.activityId = res.data.value;
							
							
							this.$Request.get('/order/getMtUrl?relationId=' + this.releationId + '&activityId=' + this.activityId).then(res => {
								if (res.status == 0) {
									this.url = res.data;
								}
							});
						}
					}
				});
				
			},
			goLoginInfo() {
				uni.navigateTo({
					url: '/pages/member/register'
				});
				
			},
			copyTklWenAn: function() {
				let relation_id = this.$queue.getData('relation_id');
				let token = this.$queue.getData('token');
				let userId = this.$queue.getData('userId');
				let gradle = this.$queue.getData('gradle');
				if (!token) {
					this.goLoginInfo();
				} else {
					if (!relation_id) {
						uni.navigateTo({
							url: '/pages/member/publisher?uid=' + userId + '&token=' + token
						});
					}
				}
			},
			// 邀请好友
			sharurl() {
				let token = this.$queue.getData('token');
				if (token) {
					let relation_id = this.$queue.getData('relation_id');
					if (relation_id) {
						uni.navigateTo({
							url: '/pages/member/yao'
						});
					} else {
						uni.showModal({
							showCancel: true,
							title: '温馨提示',
							confirmColor: '#FD6416',
							cancelText: '#999999',
							cancelText: '关闭',
							confirmText: '开通会员',
							content: '此功能为会员专享功能\n申请成为会员后可使用',
							success: res => {
								if (res.confirm) {
									this.copyTklWenAn();
								}
							}
						});
					}
				} else {
					this.goLoginInfo();
				}
			},
			//关闭弹框
			hideModal(e) {
				this.modalName = null
			},
			shareWeiXin() {
				let relation_id = this.$queue.getData('relation_id') ? this.$queue.getData('relation_id') : this.releationId;
				let shareData = {
					shareUrl: this.shareUrl,
					shareTitle: '邀请你加入省钱兄外卖！先领券，再购物，更划算！',
					shareContent: this.activityId,
					shareImg: this.$queue.publicYuMing() + '/logo.png',
					type: 0
				};
				appShare(shareData, res => {
					console.log('分享成功回调', res);
				});
			},
			
			goHongbao() {
				// #ifdef MP-WEIXIN
				uni.navigateToMiniProgram({
					appId: 'wx77af438b3505c00e',
					path: this.url,
					fail(res) {
						console.error(res)
					}
				})
				// #endif

				// #ifdef H5
				window.location.href = this.url;
				//#endif

				// #ifdef APP-PLUS
				// url=' + meituanOpen  + '' + relation_id
				this.$queue.setData('mturl', this.url);
				uni.navigateTo({
					url: '/pages/member/webview?class=mt&url=123'
				});
				// #endif
			},
			//获取背景图
			getBgImg() {
				this.$Request.getT('/banner/user/list/2').then(res => {
					if (res.status == 0) {
						this.bgImg = res.data[0].image_url
						console.log(this.bgImg)
					}
				});
			},
			config: function(name) {
				var info = null;
				if (name) {
					var name2 = name.split("."); //字符分割
					if (name2.length > 1) {
						info = configdata[name2[0]][name2[1]] || null;
					} else {
						info = configdata[name] || null;
					}
					if (info == null) {
						let web_config = cache.get("web_config");
						if (web_config) {
							if (name2.length > 1) {
								info = web_config[name2[0]][name2[1]] || null;
							} else {
								info = web_config[name] || null;
							}
						}
					}
				}
				return info;
			},
			//生成海报
			createPoster() {
				let that = this;
				return new Promise((resolve, reject) => {
					uni.showLoading({
						title: '海报生成中'
					});
					const ctx = uni.createCanvasContext('poster');
					ctx.fillRect(0, 0, 375, 673);
					ctx.setFillStyle("#FFF");
					ctx.fillRect(0, 0, 375, 673);
					let imgUrl = that.bgImg;
					uni.downloadFile({
						url: imgUrl,
						success: (res) => {
							if (res.statusCode === 200) {
								let imgCodeUrl = that.url;
								uni.downloadFile({
									url: that.config("APIHOST1") +'/wx/mpCreateQr?relation=' + that.releationId,
									success: (res2) => {
										console.log(res2)
										if (res.statusCode === 200) {
											ctx.drawImage(res.tempFilePath, 0, 0, 375, 500);
											// 长按识别二维码访问
											let textTop = 0;
											ctx.setFontSize(19);
											ctx.setFillStyle('#333');
											ctx.fillText("长按识别图中二维码", 17, textTop + 590);
											// 二维码
											ctx.drawImage(res2.tempFilePath, 238, textTop + 526, 120, 120);
											ctx.draw(true, () => {
												// canvas画布转成图片并返回图片地址
												uni.canvasToTempFilePath({
													canvasId: 'poster',
													width: 375,
													height: 673,
													success: (res) => {
														console.log("海报制作成功！");
														resolve(res.tempFilePath);
													},
													fail: () => {
														uni.hideLoading();
														reject();
													}
												})
											});
										} else {
											uni.hideLoading();
											uni.showToast({
												title: '海报制作失败，图片下载失败',
												icon: 'none'
											});
										}
									},
									fail: err => {
										console.log(err)
										uni.hideLoading();
										uni.showToast({
											title: '海报制作失败，图片下载失败',
											icon: 'none'
										});
									},
									complete: com => {
										console.log(com)
										uni.showToast({
											title: com,
											icon: 'none'
										});
									},
								});
							} else {
								uni.hideLoading();
								uni.showToast({
									title: '海报制作失败，图片下载失败',
									icon: 'none'
								});
							}
						},
						fail: err => {
							that.yu.toast(err)
							console.log(err)
							uni.hideLoading();
							uni.showToast({
								title: '海报制作失败，图片下载失败',
								icon: 'none',
							});
						}
					});
				});
			},
			// 保存图片
			async onSaveImg() {
				let imgUrl = await this.createPoster();
				// #ifdef H5
				this.h5SaveImg = imgUrl;
				uni.hideLoading();
				// #endif
				// #ifdef MP-WEIXIN
				uni.showLoading({
					title: '海报下载中'
				});
				if (settingWritePhotosAlbum) {
					uni.getSetting({
						success: res => {
							if (res.authSetting['scope.writePhotosAlbum']) {
								uni.saveImageToPhotosAlbum({
									filePath: imgUrl,
									success: () => {
										uni.hideLoading();
										uni.showToast({
											title: '保存成功'
										});
									}
								});
							} else {
								uni.showModal({
									title: '提示',
									content: '请先在设置页面打开“保存相册”使用权限',
									confirmText: '去设置',
									cancelText: '算了',
									success: data => {
										if (data.confirm) {
											uni.hideLoading();
											uni.openSetting();
										}
									}
								});
							}
						}
					});
				} else {
					uni.hideLoading();
					settingWritePhotosAlbum = true;
					uni.authorize({
						scope: 'scope.writePhotosAlbum',
						success: () => {
							uni.saveImageToPhotosAlbum({
								filePath: imgUrl,
								success: () => {
									uni.hideLoading();
									uni.showToast({
										title: '保存成功'
									});
								}
							});
						}
					});
				}
				// #endif
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #FEBD0B;
	}

	.poster_canvas {
		width: 750upx;
		height: 1334upx;
		position: fixed;
		top: -10000upx;
		left: 0;
	}

	.top_view_image {
		width: 750upx;
		height: 438upx;
		background-size: 100%;
	}

	.center_view {
		height: 475upx;
		margin: 0 32upx;
		margin-top: -7upx;
	}

	.fanli_view {
		width: 686upx;
		height: 492upx;
		background: #FFFFFF;
		border-radius: 20upx;
		margin: 20upx 32upx;
		text-align: center;

		.zhuyi {
			font-size: 30upx;
			color: #333333;
			font-weight: bold;
			padding-top: 23upx;
		}

		.item_view {
			display: flex;
			margin-left: 31upx;
			margin-top: 38upx;
			text-align: left;
		}

		.yuan {
			width: 12upx;
			height: 12upx;
			background: #FCCF17;
			border-radius: 50%;
			margin-top: 13upx;
		}
		.yuan1 {
			width: 12upx;
			height: 12upx;
			background: #FEBD0B;
			border-radius: 50%;
			margin-top: 13upx;
		}

		.text {
			font-size: 24upx;
			font-weight: 600;
			color: #3E393E;
			margin-left: 15upx;
		}
	}

	.btn_view {
		height: 80upx;
		display: flex;
		margin: 32upx;

		.btn_view1 {
			width: 680upx;
			height: 80upx;
			background: #FF1A1F;
			border-radius: 8upx;
			font-size: 30upx;
			color: #FFFFFF;
			text-align: center;
			line-height: 80upx;
		}

		.btn_view2 {
			width: 327upx;
			height: 80upx;
			background: #FFFFFF;
			border-radius: 8upx;
			font-size: 30upx;
			color: #333333;
			text-align: center;
			margin-left: 32upx;
			line-height: 80upx;
		}
	}

	.center_view_backgroundImage {
		width: 686upx;
		height: 475upx;
		background-size: 100%;
		position: absolute;
	}

	.center_view_item {
		position: absolute;
		margin-left: 30upx;

		.Hongbao {
			text-align: center;
			line-height: 80upx;
			font-weight: bold;
			margin: 27upx 20upx;
			width: 594rpx;
			height: 80upx;
			background: linear-gradient(0deg, #FFB447 0%, #FFE59F 100%);
			border-radius: 40px;
			font-size: 30upx;
			color: #6C3906;
		}

		.youhui_view {
			width: 638upx;
			height: 175upx;
			margin-top: 37upx;

			.item_view {
				position: absolute;
				display: flex;
				margin: 50upx;
				width: 100%;
			}

			.youhui_image {
				width: 638upx;
				height: 175upx;
				position: absolute;
				background-size: 100%;
			}

			.item_name {
				font-size: 30upx;
				color: #6C3906;
				font-weight: 800;
			}

			.zuigao {
				font-size: 24upx;
				color: #333333;
				font-weight: bold;
				margin-top: 10upx;
			}

			.item_zhekou {
				font-size: 20upx;
				color: #FDBF60;
				margin-top: 10upx;
				font-weight: 500;
			}
		}

		.logo {
			width: 64upx;
			height: 65upx;
		}

		.logo_text {
			font-size: 30upx;
			color: #6C3906;
			font-weight: 800;
			margin-left: 20upx;
			margin-top: 20upx;
		}

		.view_item_jieshao {
			display: flex;
			align-items: center;
			margin-top: 31upx;
			margin-left: 20upx;

			.jieshao_image {
				width: 70upx;
				height: 70upx;
			}

			.jieshao_text {
				font-size: 24upx;
				color: #666666;
			}

			.jieshao_right {
				width: 64upx;
				height: 21upx;
				margin-left: 58upx;
				margin-right: 64upx;
			}
		}
	}
</style>
