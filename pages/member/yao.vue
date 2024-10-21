<template>
	<view>
		<canvas canvas-id="poster" class="poster_canvas"></canvas>
		<view style="padding: 42upx;margin: 12upx;" class="bg">
		
			<text class="num" style="font-size: 32upx;color: #000000;margin-bottom: 10px">
				<text style="font-size: 32upx;font-weight: bold;color: #000000;margin-right:10upx;">当前等级</text>
				<text style="font-size: 30upx;font-weight: bold;margin-right:6upx;"> • VIP</text>
				<text style="font-size: 50upx;font-weight: bold;font-weight: bold;">{{ dengji }}</text>
			</text>
			<view style="font-size: 28upx;margin-top: 32upx;color: #000000;">{{ dengjides }}</view>
		</view>
		<view style="text-align: left;color: #333333;font-size: 28upx;">
			<view style="margin-top: 16upx;background: #FFFFFF;border-radius: 16upx;padding: 26upx;margin: 12upx;">
				<view style="font-size: 32upx;font-weight: bold;margin-bottom: 16upx;">邀请规则</view>
				<view>1、每成功邀请1位好友提升1级，最高{{ invitatioNum }}级每级对应相应的返现比例</view>
				<view style="margin-top: 8upx">2、邀请成功可享受直属好友佣金{{twoMoney }}%提成</view>
				<view style="margin-top: 8upx" v-if="setting==2">3、已邀请成功的好友再邀请好友可享受非直属好友佣金{{ threeMoney }}%提成</view>
			</view>
			<view style="margin-top: 16upx;background: #FFFFFF;border-radius: 16upx;padding: 26upx;margin: 12upx;">
				<view style="font-size: 32upx;font-weight: bold;margin-bottom: 16upx;margin-top: 16upx;">邀请方式</view>
				<view >1、点击下方【分享好友】分享好友、群，让好友注册即可升级</view>
			</view>
		</view>

		<view class="btn-wrap">
			<button class="share" open-type="share">
				<text>分享微信好友</text>
			</button>
			<view @click.stop="onSaveImg" class="share download">
				<text>立即生成海报</text>
			</view>
		</view>
	</view>
</template>
<script>
	let settingWritePhotosAlbum = false;
	import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue';
	export default {
		components: {
			tkiQrcode
		},
		onShareAppMessage(res) {
			return {
				title: this.tuiguang,
				imageUrl: this.backgroundImageUrl,
				path: '/pages/index/index?invitation=' + this.relationId
			};
		},
		data() {
			return {
				setting: 1,
				threeMoney: '',
				modalName: '',
				totalMoney: '0',
				dengji: 0,
				itemendprice: '识别二维码免费领取',
				imageUrl:'',
				tuiguang: '',
				itemtitle: '',
				relationId: '',
				itemprice: '',
				erweima: '',
				itempic: '',
				teamMoney: '20',
				twoMoney:"",
				url: '',
				invitatioNum: 2,
				dengjides: '生成海报',
				urlCode:"",
				backgroundImageUrl:""
			};
		},
		onLoad() {
			this.getSetting();
			
			this.twoMoney = parseFloat(this.$queue.teamMoney()) * 100;
			this.threeMoney = parseFloat(this.$queue.threeMoney()) * 100;
			
		},
		onShow() {
			let relationId = this.$queue.getData('relation_id');
			if (relationId) {
				this.relationId = relationId;
				this.url = this.$queue.publicYuMing() + '/?invitation=' + relationId;
				this.getQRCode(relationId);
				// console.log(relationId, 'relationId/////////////////////////')
			}
			let userId = this.$queue.getData('userId');
			if (userId) {
				this.getUserInfo(userId);
				this.getBackImageList();
			}
		},
		methods: {
			getSetting() {
				this.$Request.getT('/common/type/91').then(res => {
					if (res.status == 0) {
						if (res.data && res.data.value) {
							this.setting = res.data.value
						}
					}
				});
				//邀请多少人到达10级
				this.$Request.getT('/common/type/42').then(res => {
					if (res.status == 0) {
						if (res.data && res.data.value) {
							this.$queue.setData('invitaionNum', res.data.value);
							this.invitatioNum = res.data.value;
						}
					}
				});
				
				this.$Request.getT('/common/type/137').then(res => {
					if (res.status == 0) {
						if (res.data && res.data.value) {
							this.tuiguang = res.data.value;
						}
					}
				});
				
			},
			productHaibao() {
				uni.navigateTo({
					url: '/pages/share/product'
				});
			},
			yaoqing() {
				uni.navigateTo({
					url: '/pages/member/yaoqing'
				});
			},
			hideModal() {
				this.modalName = null;
			},

			getUserInfo(userId) {
				this.$Request.getT('/user/' + userId).then(res => {
					if (res.status === 0) {
						if (res.data.gradeDes) {
							this.dengji = res.data.gradeIndex;
						} else {
							this.dengji = 0;
						}
						if (res.data.gradeNumber) {
							if (res.data.gradeNumber == '还可邀请0人') {
								this.dengjides = '已到达最高等级';
							} else {
								this.dengjides = res.data.gradeNumber;
							}
						} else {
							this.dengjides = '还可邀请10人';
						}
					}
				});
			},
			
			// 创建海报
			getQRCode(relation) {
				this.urlCode = this.$queue.publicYuMingTao() + "/wx/mpCreateQr?relation=" + relation;
				// console.log(this.urlCode,'************')
			},
			getBackImageList() {
				this.$Request.getT('/banner/user/list/2').then(res => {
					if (res.status === 0) {
						this.backgroundImageUrl = res.data[0].image_url;
					}
				});
			},
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
					let imgUrl = that.backgroundImageUrl;
					console.log(imgUrl,'url+++++++++++')
					uni.downloadFile({
						url: imgUrl,
						success: (res) => {
							console.log(res,'*/*/*/*/*/*')
							if (res.statusCode === 200) {
								let imgCodeUrl = that.urlCode;
								console.log(imgCodeUrl, '------------------')
								uni.downloadFile({
									url: imgCodeUrl,
									success: (res2) => {
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
	};
</script>

<style lang="scss">
	@import '../../static/css/index.css';
	.bg {
		background-image: url(../../static/img/my/VIP.png);
		background-repeat: round;
		background-size: 100%;
	}
	.poster_canvas {
		width: 750upx;
		height: 1334upx;
		position: fixed;
		top: -10000upx;
		left: 0;
	}
	.btn-wrap {
		width: 100%;
		height: 15%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 100upx;
		margin-top: 50upx;
		.share {
			width: 45%;
			height: 80upx;
			background-color: #FB5531;
			color: #fff;
			line-height: 80upx;
			font-size: 28upx;
			margin: 0;
		}
		.download {
			width: 40%;
			height: 80upx;
			background-color: #06C061;
			color: #fff;
			line-height: 80upx;
			font-size: 28upx;
			border-radius: 10upx;
			text-align: center;
		}
	}
</style>
