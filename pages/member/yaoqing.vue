<template>
	<view class="content">
		<view class="view1" style="box-shadow: rgba(183, 183, 183, 0.3) 1px 1px 10px 1px;border-radius: 20upx;margin-bottom: 20upx;">
			<view style="display: flex;">
				<view style="margin: 70upx 0 0 20upx;height: 100upx; width: 300upx; text-align: center;">
					<view style="font-size: 40upx;color: #333333;">{{ total }}</view>
					<view style="font-size: 28upx;color: #666666;margin-left: 20upx;">邀请好友（人）</view>
				</view>
				<view style="margin: 70upx 0 0 75upx;height: 100upx; width: 300upx;text-align: center;">
					<view style="font-size: 40upx;color: #333333;">{{ totalMoney }}</view>
					<view style="font-size: 28upx;color: #666666;">总收益</view>
				</view>
			</view>

			<button class="yaoqing_btn" @click="goYao">邀请好友</button>
		</view>


		<view class="navbar" v-if="setting==2">
			<view v-for="(item, index) in tabListz" :key="index" class="nav-item" :class="{current: tabFromIndex === item.totalElementts}"
			 @click="changeList(item.totalElementts)">
				{{item.text}}
			</view>
		</view>
		<view class="view2" style="box-shadow: rgba(183, 183, 183, 0.3) 1px 1px 10px 1px;border-radius: 20upx;margin-bottom: 50upx;">
			<view style="display: flex;flex-direction: row;padding: 20upx;">
				<view style="width: 20%;">排名</view>
				<view style="width: 50%;">昵称</view>
				<view style="width: 30%;text-align: center;">累计贡献</view>
			</view>
			<view style="display: flex;flex-direction: row;padding: 20upx;" v-for="(item, index) in list" :key="index">
				<view style="width: 20%;">
					<view style="font-size: 28upx; color: #000000; margin-left: 15upx;margin-top: 6upx;">{{ index + 1 }}</view>
				</view>
				<view style="width: 50%;display: flex;flex-direction: row;align-items: center;">
					<view style="font-size: 28upx; color: #333333; width: 65%;">{{ item.nickName }}</view>
				</view>
				<view style="width: 30%;text-align: center;">
					<view style="font-size: 32upx;color: #FF580B;" v-if="item.jifen != '0.00'">{{ item.jifen ? item.jifen + '元' : '0元' }}</view>
					<view style="font-size: 32upx;color: #FF580B;" v-else>{{ item.jifen ? item.jifen + '元' : '0元' }}</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				setting: 1,
				list: [],
				page: 0,
				limit: 0,
				pagesize: 10,
				tabFromIndex: 1,
				show: false,
				currentTab: 0,
				totalMoney: 0,
				total: 0,
				tabsnva: [{
					loadingType: ''
				}],
				tabListz: [{
					state: 'zs',
					text: '直属',
					totalElementts: 1
				}, {
					state: 'fzs',
					text: '非直属',
					totalElementts: 2
				}],
			};
		},
		onLoad() {
			uni.showLoading({
				title: '加载中...'
			});
			this.getSetting();
			this.getMoney(1);
		},
		onPullDownRefresh: function() {
			this.page = 0;
			this.limit = 0;
			this.list = [];
		},
		onReachBottom() {
			this.limit = this.limit + 1;
			this.getMoney(this.tabFromIndex)

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
			},
			goYao() {
				uni.navigateTo({
					url: '/pages/member/yao'
				});
			},
			changeList(zhishu) {
				this.limit = 0;
				this.list = [];
				this.getMoney(zhishu)
			},
			changeTab(e) {
				console.log('eeeeeeeee', e)
				this.currentTab = e.target.current;

				if (this.currentTab == 0) {
					this.getMoney(1)
				} else if (this.currentTab == 1) {
					this.getMoney(2)
				}

			},
			getMoney(zhishu) {

				uni.showLoading({
					title: '加载中...'
				});
				this.tabFromIndex = zhishu;
				let relationId = this.$queue.getData('relation_id');
				if (relationId) {
					this.$Request.getT('/order/team/total/relation/' + relationId).then(res => {
						if (res.status === 0 && res.data) {
							this.totalMoney = Math.round(res.data);
						}
					});
					this.$Request.getT('/user/team/users/' + relationId + '/' + zhishu + '/' + this.limit + '/' + this.pagesize).then(
						res => {
							if (res.status === 0 && res.data) {
								this.total = res.data.totalElements;

								res.data.content.forEach(item => {
                                    item.jifen=Math.round(item.jifen)
									this.list.push(item);
								});
								if (res.data.totalElements === this.list.length) {
									this.tabsnva.loadingType = 'noMore';
								} else {
									this.tabsnva.loadingType = 'more';

								}
							}
							setTimeout(function() {
								uni.hideLoading();
								this.show = true;
							}, 1000);
							uni.hideLoading();
						});

				}
			},

		}
	};
</script>

<style lang="scss">
	@import '../../static/css/index.css';

	page,
	.content {
		background: $page-color-base;
		height: 100%;
	}

	.swiper-box {
		height: calc(100% - 40px);
	}

	.list-scroll-content {
		height: 100%;
	}

	.content2 {
		height: 100%;
	}

	.uni-swiper-item {
		height: auto;
	}

	.view1 {
		background-color: #ffffff;
		width: 93%;
		height: 300upx;
		margin-left: 26upx;
		border-radius: 20upx;
		margin-top: 20upx;
	}

	.view2 {
		background-color: #ffffff;
		width: 93%;
		// height: 100%;
		border-top-left-radius: 20upx;
		border-top-right-radius: 20upx;

		margin-left: 26upx;
		margin-top: 20upx;
	}

	.navbar {
		display: flex;
		height: 40px;
		margin: 0 28upx;
		border-radius: 20upx;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0, 0, 0, .06);
		position: relative;
		z-index: 10;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: $font-color-dark;
			position: relative;

			&.current {
				color: #FD6416;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid #FD6416;
				}
			}
		}
	}

	.yaoqing_btn {
		width: 80%;
		line-height: 80upx;
		margin-top: 30upx;
		height: 85upx;
		color: #FFFFFF;
		background: #FD6416;
		background-size: 100%;
	}
</style>
