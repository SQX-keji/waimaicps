<template>
	<view class="content">
		<view class="view1" v-bind:style="{backgroundImage: 'url('+backgroundImage+')'}">
			<view style="padding-top: 820upx;" @longpress="logoTime(userImageUrl)">
				<view style="width: 100%;height: 150upx;display: flex;background: #1F2029;padding: 20upx 10upx;">
					<image :src="userImageUrl" style="border-radius: 100upx;width: 100upx;height: 100upx;margin-left: 30upx;"></image>
					<view class="login-view-text1" style="margin-left: 30upx;width: 59%;">
						<view style="color: #FFFFFF;font-size: 16px;">{{ nickName }}</view>
						<view style="color: #FFFFFF; font-size: 12px;margin-top: 20upx;">邀请码:{{invitationCode}}</view>
					</view>
					<canvas canvas-id="qrcode" style="width: 140upx;height: 130upx;" />
				</view>
			</view>
		</view>
		<view style="display: flex;flex-direction: row; padding: 40upx;">
		
			<button @tap="showModal()" type="default" style="background-color: #FF5808;font-size: 16px;font-weight: bold;color: #FFFFFF; width: 100%; margin-left: 40upx;">生成海报</button>

			<!-- 生成海报 -->
			<!-- 图片展示由自己实现 -->
			<view class="flex_row_c_c modalView" :class="qrShow?'show':''" @tap="hideQr()">
				<view class="flex_column">
					<view class="backgroundColor-white padding1vh border_radius_10px">
						<image :src="poster.finalPath || ''" mode="widthFix" class="posterImage"></image>
					</view>
					<view class="flex_row marginTop2vh">
						<!-- #ifdef H5 -->
						<button type="primary" size="mini">长按上方图片保存</button>
						<!-- #endif -->
						<!-- #ifndef H5 -->
						<button type="primary" size="mini" @tap.prevent.stop="saveImage()">保存图片</button>
						<!-- #endif -->
					</view>
				</view>
			</view>
			<!-- 画布 -->
			<view class="hideCanvasView">
				<canvas class="hideCanvas" canvas-id="default_PosterCanvasId" :style="{width: (poster.width||10) + 'px', height: (poster.height||10) + 'px'}"></canvas>
			</view>
		</view>
		<tki-qrcode ref="qrcode" :val="url" :size="200" background="#fff" foreground="#000" pdground="#000" :onval="true"
		 :loadMake="true" @result="qrR" :show="false"></tki-qrcode>
		<view class="cu-modal" :class="modalName == 'Image' ? 'show' : ''" @tap="hideModal">
			<view class="cu-dialog" v-if="backgroundImage && erweimapath && haibaoShow" @tap="hideModal">
				<view class="bg-img">
					<wm-poster @success="posterSuccess" :imgSrc="backgroundImage" :Referrer="'我的邀请码:'+invitationCode" :QrSrc="erweimapath"
					 :Title="tuiguang" :LineType="false"></wm-poster>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue';
	import appShare from '@/utils/share.js';
	import wmPoster from '@/components/wm-poster/wm-posterorders.vue';
	import uQRCode from "../../js_sdk/Sansnn-uQRCode/uqrcode.js"
	import _app from '../../js_sdk/QuShe-SharerPoster/QS-SharePoster/app.js';
	import {
		getSharePoster
	} from '../../js_sdk/QuShe-SharerPoster/QS-SharePoster/QS-SharePoster.js';
	export default {
		components: {
			tkiQrcode,
			wmPoster,
			getSharePoster
		},
		data() {
			return {
				erweimapath: '',
				poster: {},
				qrShow: false,
				backgroundImage: 'https://api.shengqianxiong.com.cn/img/download/WechatIMG3305.png',
				haibaoImg: null,
				haibaoShow: false,
				modalName: '',
				canvasId: 'default_PosterCanvasId',
				imageUrl: '',
				userImageUrl: '',
				isShowWxAPPShare:'否',
				nickName: '',
				invitationCode: '',
				
				tuiguang: '购物省钱就上省钱兄外卖,
				url: ''
			};
		},
		onLoad() {
			
			this.getBackImageList();


			
			
			let userId = this.$queue.getData('userId');
			if (userId) {
				
				this.$Request.getT('/user/' + userId).then(res => {
					if (res.status === 0) {
						this.$queue.setData('image_url', res.data.image_url);
						this.$queue.setData('mobile', res.data.phone);
						this.isInvitation = res.data.isInvitation;
						if(res.data.image_url){
							this.userImageUrl = res.data.image_url;
						}else{
							this.userImageUrl = '../../static/logo2.png';
						}
						
						this.invitationCode = res.data.invitationCode;
						this.$queue.setData('isInvitation', res.data.isInvitation);
						this.$queue.setData('relation', res.data.invitation);
						this.$queue.setData('grade', res.data.grade);
						this.$queue.setData('nickName', res.data.nickName);
						if (res.data.nickName) {
							this.nickName = res.data.nickName;
						} else {
							this.nickName = '游客';
						}
						this.$queue.setData('relation_id', res.data.relationId);
						this.$queue.setData('gender', parseInt(res.data.gender));
						//#ifdef H5
						let relation = this.$queue.getData('relation_id') + '-' + this.$queue.getData('relation_id');
						this.loadInfos(relation);
						//#endif
						//#ifndef H5
						
						if (this.invitationCode) {
							this.url = this.$queue.publicYuMing() + '/pages/member/download?relationId=' + this.$queue.getData(
								'relation_id') + '&invitationCode=' + this.invitationCode;
						
						} else {
							this.url = this.$queue.publicYuMing() + '/pages/member/download?relationId=' + this.$queue.getData(
								'relation_id');
						
						}
						//#endif
					}
				});
			}

		},
		methods: {
			loadInfos(relation) {
				let that = this;
				this.$Request.getT('/wx/createQr?relation=' + relation).then(res => {
					if (res.status == 0) {
						that.url = res.data.url;
					}
				});
			},
			posterSuccess(haibaoImg) {
				this.haibaoImg = haibaoImg;
				this.modalName = 'Image';
			},
			showModal() {
				if (!this.haibaoImg) {
					this.haibaoShow = true;
					this.$queue.showLoading('海报生成中...');
				} else {
					this.modalName = 'Image';
				}
			},
			hideModal() {
				this.modalName = null;
			},
			qrR(path) {
				this.erweimapath = path;
			},
			getBackImageList() {
			
				this.make();

			},
			make() {
				uQRCode.make({
					canvasId: 'default_PosterCanvasId',
					componentInstance: this,
					text: this.url,
					size: 68,
					margin: 4,
					backgroundColor: '#ffffff',
					foregroundColor: '#000000',
					fileType: 'jpg',
					correctLevel: uQRCode.errorCorrectLevel.H,
					success: res => {
						console.log(res)
					}
				})
			},
		
			async shareFc() {
				let _this = this;
				try {
					const d = await getSharePoster({
						type: 'testShareType',
						backgroundImage: _this.backgroundImage,
						posterCanvasId: _this.canvasId, //canvasId
						delayTimeScale: 20, //延时系数
						drawArray: ({
							bgObj,
							type,
							bgScale
						}) => {
							const dx = bgObj.width * 0.3;
							const fontSize = bgObj.width * 0.045;
							const lineHeight = bgObj.height * 0.04;
							//可直接return数组，也可以return一个promise对象, 但最终resolve一个数组, 这样就可以方便实现后台可控绘制海报
							return new Promise((rs, rj) => {
								rs([{
										type: 'custom',
										setDraw(Context) {
											Context.setFillStyle('black');
											Context.setGlobalAlpha(0.3);
											Context.fillRect(0, bgObj.height - bgObj.height * 0.2, bgObj.width, bgObj.height * 0.2);
											Context.setGlobalAlpha(1);
										}
									},
									{
										type: 'text',
										fontStyle: 'italic',
										text: '邀请码:' + _this.invitationCode,
										size: fontSize,
										color: 'white',
										alpha: 1,
										textAlign: 'left',
										textBaseline: 'middle',
										infoCallBack(textLength) {
											return {
												dx: bgObj.width - textLength - fontSize,
												dy: bgObj.height - lineHeight * 3
											}
										},
										serialNum: 0,
										id: 'tag1' //自定义标识
									},
									{
										type: 'qrcode',
										text: _this.url,
										size: bgObj.width * 0.2,
										dx: bgObj.width * 0.05,
										dy: bgObj.height - bgObj.width * 0.25
									}
								]);
							})
						},
						setCanvasWH: ({
							bgObj,
							type,
							bgScale
						}) => { // 为动态设置画布宽高的方法，
							_this.poster = bgObj;
						}
					});
					//_app.log('海报生成成功, 时间:' + new Date() + '， 临时路径: ' + d.poster.tempFilePath)
					_this.poster.finalPath = d.poster.tempFilePath;
					_this.qrShow = true;
				} catch (e) {
					_app.hideLoading();
				}
			},
			saveImage() {
				uni.saveImageToPhotosAlbum({
					filePath: this.poster.finalPath,
					success(res) {
						_app.showToast('保存成功');
					}
				})
			},
			hideQr() {
				this.qrShow = false;
			}
		}
	}
</script>

<style>
	page {
		background: #18181C;
	}

	.view1 {
		border-radius: 15upx;
		background-size: 100%;
		margin: 20upx 20upx 0 20upx;
	}

	.hideCanvasView {
		position: relative;
	}

	.hideCanvas {
		position: fixed;
		top: -99999upx;
		left: -99999upx;
		z-index: -99999;
	}

	.flex_row_c_c {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.modalView {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0;
		outline: 0;
		transform: scale(1.2);
		perspective: 2500upx;
		background: rgba(0, 0, 0, 0.6);
		transition: all .3s ease-in-out;
		pointer-events: none;
		backface-visibility: hidden;
		z-index: 999;
	}

	.modalView.show {
		opacity: 1;
		transform: scale(1);
		pointer-events: auto;
	}

	.flex_column {
		display: flex;
		flex-direction: column;
	}

	.backgroundColor-white {
		background-color: white;
	}

	.border_radius_10px {
		border-radius: 10px;
	}

	.padding1vh {
		padding: 1vh;
	}

	.posterImage {
		width: 60vw;
	}

	.flex_row {
		display: flex;
		flex-direction: row;
	}

	.marginTop2vh {
		margin-top: 2vh;
	}
</style>