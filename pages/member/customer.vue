<template>
	<view style="height: 100vh;margin: 32upx 0; ">
		<!-- border-radius: 32upx; -->
		<view style="text-align: center;background: #FFFFFF;padding: 30upx;">
			<view class="item" v-if="qq">
				<view class="lef">
					<image src="../../static/my/QQ.png"></image>
					<view class="txt">
						<text>QQ</text>
						<text>{{qq}}</text>
					</view>
				</view>
				<view  @click="copyHref" class="copy" data-txt='qq'>复制QQ</view>
			</view>
			<view class="item" v-if="weixin">
				<view class="lef">
					<image  src="../../static/my/wx.png"></image>
					<view class="txt">
						<text>微信</text>
						<text>{{weixin}}</text>
					</view>
				</view>
				<view  @click="copyHref" class="copy" data-txt='weixin'>复制微信</view>
			</view>
			<view class="item items" v-if='phone'>
				<view class="lef">
					<image  src="../../static/my/phone.png"></image>
					<view class="txt">
						<text>电话</text>
						<text>{{phone}}</text>
					</view>
				</view>
				<view   @click="copyHref" data-txt='phone' class="copy">拨打电话</view>
			</view> 
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			image: 'https://tk.gomyorder.cn/custom.jpg',
			isWeiXin: false,
			weixin: '',
			qq:'',
			phone:'',
			webviewStyles: {
				progress: {
					color: '#FD6416'
				}
			}
		};
	},
	onLoad() {
		// #ifdef H5
		let ua = navigator.userAgent.toLowerCase();
		if (ua.indexOf('micromessenger') !== -1) {
			this.isWeiXin = true;
		}
		// #endif
		
		//微信号码
		this.$Request.getT('/common/type/44').then(res => {
			if (res.status == 0) {
				if (res.data && res.data.value) {
					this.weixin = res.data.value;
				}
			}
		});
		
		//客服电话
		this.$Request.getT('/common/type/116').then(res => {
			if (res.status == 0) {
				if (res.data && res.data.value) {
					this.phone = res.data.value;
				}
			}
		});
		//qq号码
		this.$Request.getT('/common/type/115').then(res => {
			if (res.status == 0) {
				if (res.data && res.data.value) {
					this.qq = res.data.value;
				}
			}
		});
	},
	onPullDownRefresh: function() {
		uni.stopPullDownRefresh(); // 停止刷新
	},
	methods: {
		//邀请码复制
		copyHref(e) {
			console.log(e.target.dataset.txt)
			if(e.target.dataset.txt=='qq'){
				this.copy(this.qq)
			}else if(e.target.dataset.txt=='weixin'){
				this.copy(this.weixin)
			}else{
				uni.makePhoneCall({
					phoneNumber:this.phone
				})
			 	
			} 
		},
		copy(item){
			uni.setClipboardData({
					data:item,
					success: r => {
						this.$queue.showToast('复制成功');
					}
				}); 
		},
		saveImg() {
			let that = this;
			uni.saveImageToPhotosAlbum({
				filePath: that.image,
				success(res) {
					that.$queue.showToast('保存成功');
				}
			});
		},
		rests() {
			uni.showToast({
				title: '已刷新请再次长按识别',
				mask: false,
				duration: 1500,
				icon: 'none'
			});
			window.location.reload();
		}
	}
};
</script>

<style scoped>
@import '../../static/css/index.css';
.item{
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 36rpx;
}
.items{margin-bottom: 0;}
.lef{
	display: flex;
	justify-content: flex-start;
	align-items: center;
}
	.item image{
		width: 89rpx;
		height: 89rpx;
		margin-right: 26rpx;
	}
	.item .txt{
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
	}
	.txt>text:nth-child(1){ 
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #1F2029;
		/* line-height: 87rpx; */
		margin-bottom: 10rpx;
	}
		.txt>text:nth-child(2){ 
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #666666;
			/* line-height: 87rpx; */
	}
	.copy{
		width: 140rpx;
		height: 54rpx;
		background: #FD6416;
		border-radius: 27rpx;
		text-align: center;
		line-height: 54rpx; 
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #FFFFFF;
	}

/* 
	<!-- <view style="font-size: 38upx;color: #000000">添加客服微信咨询</view>
			<view style="font-size: 32upx;margin-top: 32upx;color: #000000">微信号：{{weixin}}</view>
			<view @click="copyHref" style="width:200upx;margin-top: 32upx;font-size: 30upx;margin-left: 36%;color: #FFFFFF;background: #FD6416;padding: 4upx 20upx;border-radius: 24upx;">一键复制</view>
			
			<image @click="saveImg" mode="aspectFit" style="margin-top: 32upx" :src="image"></image>
			<view style="font-size: 28upx;color: #000000;margin-top: 32upx" v-if="isWeiXin">{{ isWeiXin ? '长按识别上方二维码' : '' }}</view>
			
			
			
			<view v-if="isWeiXin" style="font-size: 24upx;color: #000000;margin-top: 80upx" @click="rests">无法识别？</view> -->

 */
</style>
