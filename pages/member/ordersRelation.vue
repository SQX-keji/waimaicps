<template>
	<view style="text-align: left">
		<view v-for="(item, index) in list" :key="index" class="item">
			<view>
				<view style="color: #000000;font-size: 28upx;">
					<view style="margin-bottom: 8upx;text-align: right;">
						<text style="margin-bottom: 8upx;color: #FD6416" v-if="item.status==1"> 未到账</text>
						<text style="margin-bottom: 8upx;color: #0e80d2" v-if="item.status==2"> 已到账</text>
					</view>
					<view style="margin-bottom: 8upx"> 类型： 自营商城分销</view>
					<view style="margin-bottom: 8upx"> 内容： {{item.detail}}</view>
					<view style="margin-bottom: 8upx"> 时间： {{item.createAt}}</view>
					<view style="margin-bottom: 8upx;text-align: right;">
						<!-- 提现金额： -->
						<text v-if="item.status==2" style="color: #FD6416;font-size: 32upx;font-weight: 600">￥ {{item.commissionPrice}}</text>
						<text v-if="item.status==1" style="color: #FD6416;font-size: 32upx;font-weight: 600">￥ {{item.commissionPrice}}</text>
					</view>
				</view>

			</view>
		</view>
		<view v-if="list.length===0" style="text-align: center;margin-top: 60px">暂无记录</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
			}
		},
		onLoad: function(e) {
			this.$queue.showLoading("加载中...");
			this.getMoney();
		},

		methods: {
			getMoney() {
				let that = this;
				let token = this.$queue.getData("token");
				let userId = this.$queue.getData("userId");
				if (token) {
					//可以提现金额查询预估收入查询
					this.$Request.getT("/ordersRelation/list?page=0&size=10&status=0&moneyFrom=0&userId=" + userId).then(res => {
						if (res.status === 0 && res.data) {
							res.data.content.forEach(d => {
								that.list.push(d);
							});
						}
						uni.hideLoading();
					});
				}

			},
		},

	}
</script>

<style lang='scss'>
	@import "../../static/css/index.css";

	page {
		background: #FFFFFF;
	}

	.item {
		background: white;
		padding: 32rpx;
		margin: 32rpx;
		font-size: 28rpx;
		box-shadow: 7px 9px 34px rgba(0, 0, 0, 0.1);
		border-radius: 16upx;
	}
</style>
