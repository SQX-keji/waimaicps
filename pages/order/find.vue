<template>
	<view class="content">
		<view class="search-pop">
			<view class="main-title">
				<view class="search-tab">
					<view class="search">
						<view class="search_wrap">
							<icon type="search" size="20"/>
							<input type="number" :value="keywords" placeholder="输入订单号搜索" class="search_area" @input="searchInput" @confirm="submitSearch" />
						</view>
					</view>
				</view>
				<view class="find" @tap="submitSearch">查询</view>
			</view>
		</view>
		<view class="pic">
			<text>如何获取订单编号</text>
			<view class="img">
				<image src="../../static/my/left.png"></image>
				<image src="../../static/my/right.png"></image>
			</view>
			<view class="txt">
					<text>1.在淘宝我的页面点击查看全部订单</text>
					<text>2.复制订单编号在上方搜索查询</text>
			</view>
		</view>
		<!-- 空白页 -->
		<!-- <empty v-if="navList[0].loaded === true && navList[0].orderList.length === 0" des="暂无数据"></empty> -->
		<!-- 订单列表 -->
		<view v-if="orderData" class="order-item">
			<view class="i-top b-b">
				<text class="time" style="font-size: 14px;color: grey">{{orderData.tk_paid_time}}付款</text>
				<!-- <text class="state" :style="{color: orderData.stateTipColor}">{{orderData.stateTip}}</text> -->
			</view>
			<view class="goods-box-single">
				<image class="goods-img" :src='"http:"+orderData.item_img'></image>
				<view class="right">
					<text class="title clamp">{{orderData.item_title}}</text>
					<text class="attr-box" v-if="orderData.seller_shop_title">店铺名称 {{orderData.seller_shop_title}}</text>
					<text class="price">实付款 ￥{{orderData.alipay_total_price}}</text>
					<!-- <text class="attr-box">团长提成 ￥{{orderData.invitationMoney}}</text> -->
				</view>
			</view>
			<view class="price-box">
				<text v-if='orderData.isGif==0'>{{orderData.tk_status===3?'结算预估收入':''}}{{orderData.tk_status===12?'付款预估收入':''}}{{orderData.tk_status===13?'已失效':''}}</text>
				<text v-if='orderData.isGif==1||orderData.isGif==2' class="price" style="color: #FD6416;font-weight: bold">
					{{orderData.alipay_total_price>5?'减免5元':'免单'}}
				</text>
				<text v-if='orderData.isGif==0' class="price" style="color: #FD6416;font-weight: bold">
					{{orderData.tk_status!==13?orderData.pub_share_pre_fee_user:'--'}}
				</text>
				<text v-if="orderData.tk_status!=13" style="color: #FD6416;font-weight: bold;margin-left: 16upx;" @click="bindingOrder()">立即找回</text>
			</view>

		</view>


	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";

	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				keywords: '',
				tabFromIndex: 0,
				tabCurrentIndex: 0,
				orderData: "",
				fromInfo: 'tb',
				scrollTop: false,
				tabList: [{
					state: 'tb',
					text: '淘宝',
					totalElements: 0
				}, {
					state: 'pdd',
					text: '拼多多',
					totalElements: 0
				}, {
					state: 'jd',
					text: '京东',
					totalElements: 0
				}],
				navList: [{
						state: 0,
						text: '全部',
						loadingType: 'more',
						page: 0,
						totalElements: 0,
						orderList: []
					},
					{
						state: 12,
						text: '已付款',
						page: 0,
						loadingType: 'more',
						totalElements: 0,
						orderList: []
					},
					{
						state: 3,
						text: '已结算',
						page: 0,
						loadingType: 'more',
						totalElements: 0,
						orderList: []
					},
					{
						state: 13,
						text: '已失效',
						page: 0,
						totalElements: 0,
						loadingType: 'more',
						orderList: []
					}
				],
			};
		},
		onPageScroll: function(e) {
			this.scrollTop = e.scrollTop > 200;
		},
		onLoad(options) {
			/**
			 * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
			 * 替换onLoad下代码即可
			 */
			this.tabCurrentIndex = 0;
			// this.loadData()

		},
		methods: {
			submitSearch() {
				if (!this.keywords) {
					this.$queue.showToast("请输入订单号");
					return;
				}
				let relation_id = this.$queue.getData("relation_id");
				if (relation_id) {
					this.$Request.getT("/order/selectOrder?orderNo=" + this.keywords)
						.then(res => {
							if (res.status === 0) {
								if (res.data) {
									this.orderData = res.data;
								} else {
									this.$queue.showToast('未找到此订单信息');
								}
							} else if (res.status === -102) {
								this.$queue.showToast(res.msg);
								this.$queue.logout();
								uni.navigateTo({
									url: '/pages/public/login'
								})
							} else {
								this.$queue.showToast(res.msg);
							}
						});
				} else {
					this.$queue.showToast("您还不是会员无权操作");
				}
			},
			bindingOrder() {
				let relation_id = this.$queue.getData("relation_id");
				if (relation_id) {
					this.$Request.getT("/order/bindingOrder?orderNo=" + this.orderData.trade_id + "&relation_id=" + relation_id)
						.then(res => {
							if (res.status === 0) {
								this.$queue.showToast("订单绑定成功请在我的订单查看");
							} else if (res.status === -102) {
								this.$queue.showToast(res.msg);
								this.$queue.logout();
								uni.navigateTo({
									url: '/pages/public/login'
								})
							} else {
								this.$queue.showToast(res.msg);
							}
						});
				} else {
					this.$queue.showToast("您还不是会员无权操作");
				}
			},
			searchInput: function(e) {
				this.keywords = e.detail.value;
			},
			clearInput() {
				this.keywords = '';
			},
			goFind() {
				uni.navigateTo({
					url: '/pages/order/find'
				})
			},
			loadMore() {
				let index = this.tabCurrentIndex;
				this.navList[index].page = this.navList[index].page + 1;
				this.loadData();
			},
			topScrollTap: function() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
			},
			toGoodsInfo: function(itemid, item_title) {
				if (this.tabFromIndex == 0) {
					if (this.$queue.getData("relation_id")) {
						uni.navigateTo({
							url: "/pages/detail/goodsinfo?itemid=" + itemid + "&relation_id=" + this.$queue.getData("relation_id"),
						})
					} else {
						uni.navigateTo({
							url: "/pages/detail/goodsinfo?itemid=" + itemid + "&relation_id=" + this.$queue.getInvitation(),
						})
					}

				}
				if (this.tabFromIndex == 1) {
					if (this.$queue.getData("relation_id")) {
						uni.navigateTo({
							url: "/pages/detail/pdd?itemid=" + itemid + "&relation_id=" + this.$queue.getData("relation_id"),
						})
					} else {
						uni.navigateTo({
							url: "/pages/detail/pdd?itemid=" + itemid + "&relation_id=" + this.$queue.getInvitation(),
						})
					}
				}
				if (this.tabFromIndex == 2) {
					if (this.$queue.getData("relation_id")) {
						uni.navigateTo({
							url: "/pages/detail/jd?itemid=" + itemid + "&relation_id=" + this.$queue.getData("relation_id"),
						})
					} else {
						uni.navigateTo({
							url: "/pages/detail/jd?itemid=" + itemid + "&relation_id=" + this.$queue.getInvitation(),
						})
					}
				}
			},
			//获取订单列表
			loadData(source) {
				//这里是将订单挂载到tab列表下
				let index = this.tabCurrentIndex;
				let navItem = this.navList[index];
				let state = navItem.state;
				let page = navItem.page;
				if (source === 'tabChange' && navItem.loaded === true) {
					//tab切换只有第一次需要加载数据
					return;
				}
				if (navItem.loadingType === 'loading') {
					//防止重复加载
					return;
				}
				if (navItem.loadingType === 'noMore') {
					return;
				}
				navItem.loadingType = 'loading';
				let relation_id = this.$queue.getData("relation_id");
				if (relation_id) {
					this.$Request.getT("/order/page/" + page + "/size/10/status/" + state + "/from/" + this.fromInfo + "/relation/" +
							relation_id)
						.then(res => {
							if (res.status === 0) {
								let list = res.data.content;
								let orderList = list.filter(item => {
									//添加不同状态下订单的表现形式
									item = Object.assign(item, this.orderStateExp(item.tk_status));
									return item
								});
								orderList.forEach(item => {
									item.image = "http:" + item.item_img;
									navItem.orderList.push(item);
								});
								navItem.totalElements = res.data.totalElements;
								if (res.data.totalElements === navItem.orderList.length) {
									//判断是否还有数据， 有改为 more， 没有改为noMore
									navItem.loadingType = 'noMore';
								} else {
									//判断是否还有数据， 有改为 more， 没有改为noMore
									navItem.loadingType = 'more';
								}
								this.$set(navItem, 'loaded', true);
							} else if (res.status === -102) {
								this.$queue.showToast(res.msg);
								this.$queue.logout();
								uni.navigateTo({
									url: '/pages/public/login'
								})
							} else {
								this.$queue.showToast(res.msg);
							}
						});
				} else {
					navItem.loadingType = 'noMore';
					this.$set(navItem, 'loaded', true);
				}


			},

			//swiper 切换
			changeTab(e) {
				this.tabCurrentIndex = e.target.current;
				this.loadData('tabChange');
			},
			//顶部tab点击
			tabClick(index) {
				this.tabCurrentIndex = index;
			},
			//顶部渠道点击
			tabClicks(index) {
				this.tabFromIndex = index;
				this.fromInfo = this.tabList[index].state
				this.navList = [{
							state: 0,
							text: '全部',
							loadingType: 'more',
							totalElements: 0,
							page: 0,
							orderList: []
						},
						{
							state: 12,
							text: '已付款',
							page: 0,
							totalElements: 0,
							loadingType: 'more',
							orderList: []
						},
						{
							state: 3,
							text: '已结算',
							page: 0,
							totalElements: 0,
							loadingType: 'more',
							orderList: []
						},
						{
							state: 13,
							text: '已失效',
							page: 0,
							totalElements: 0,
							loadingType: 'more',
							orderList: []
						}
					],
					this.loadData();
			},

			//订单状态文字和颜色
			orderStateExp(state) {
				let stateTip = '',
					stateTipColor = '#FD6416';
				switch (+state) {
					case 12:
						stateTip = '已付款';
						break;
					case 14:
						stateTip = '已收货';
						break;
					case 3:
						stateTip = '已结算';
						break;
					case 4:
						stateTip = '维权退款';
						break;
					case 13:
						stateTip = '已失效';
						stateTipColor = '#909399';
						break;

						//更多自定义
				}
				return {
					stateTip,
					stateTipColor
				};
			}
		},
	}
</script>

<style lang="scss">
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
	.search_wrap{
		// width: 690upx;
		height: 78upx;
		border: 2upx solid #FD6416;
		border-radius: 15upx;
		margin: 20upx auto;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		icon{
			margin: 0 10upx 0 24upx;
			line-height: 0px;
		}
	}
	.find{
		width: 680upx;
		height: 88upx;
		background: #FD6416;
		border-radius: 10upx;
		line-height: 88upx;
		text-align: center;
		margin: 30upx auto 40upx;
		color: #fff;
	}
	.pic{
		background: #ffffff;
		padding: 0 27upx 0 27upx;
		margin-top: 30upx;
		.txt{
			text-align: center;
			display: flex;
			text{
				flex: 1;
				font-size: 20upx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #FF2824;
			line-height: 36upx;
			white-space: nowrap;
			overflow: hidden;
			text-emphasis: ellipsis;
			padding: 3upx;
			border: 2upx solid ;
			border-radius: 18upx;
			}
			&>text:nth-child(1){ 
				margin-right: 20upx;
			} 
		}
		text{
			margin-bottom: 40upx; 
			font-size: 32upx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #333333;
		}
		.img{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			margin-top: 40upx;
			margin-bottom: 43upx;
			image{
				width: 355upx;
				height: 300upx;
			}
		}
	}
	.navbar {
		display: flex;
		height: 40px;
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
				color: $base-color;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid $base-color;
				}
			}
		}
	}

	.uni-swiper-item {
		height: auto;
	}

	.order-item {
		display: flex;
		flex-direction: column;
		padding-left: 15px;
		background: #fff;
		margin-top: 8px;

		.i-top {
			display: flex;
			align-items: center;
			height: 40px;
			padding-right: 16px;
			font-size: $font-base;
			color: $font-color-dark;
			position: relative;

			.time {
				flex: 1;
			}

			.state {
				font-weight: 400;
				color: $base-color;
			}

			.del-btn {
				padding: 6px 0 6px 18px;
				font-size: $font-lg;
				color: $font-color-light;
				position: relative;

				&:after {
					content: '';
					width: 0;
					height: 16px;
					border-left: 1px solid $border-color-dark;
					position: absolute;
					left: 10px;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}


		/* 单条商品 */
		.goods-box-single {
			display: flex;
			padding: 10px 0;

			.goods-img {
				width: 60px;
				height: 60px;
			}

			.right {
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 0 15px 0 12px;
				overflow: hidden;

				.title {
					height: 32px;
					overflow: hidden;
					text-overflow: ellipsis;
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					line-height: 1;
				}

				.attr-box {
					font-size: $font-sm + 2upx;
					color: $font-color-light;
					padding: 5px 0px;
				}

				.price {
					font-size: $font-base + 2upx;
					color: $font-color-dark;

					&:before {
						font-size: $font-sm;
						margin: 0 1px 0 4px;
					}
				}
			}
		}

		.price-box {
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			padding: 10px 16px;
			font-size: $font-sm + 2upx;
			color: $font-color-light;

			.num {
				margin: 0 4px;
				color: $font-color-dark;
			}

			.price {
				font-size: $font-lg;
				color: $font-color-dark;

				&:before {
					content: '￥';
					font-size: $font-sm;
					margin: 0 1px 0 4px;
				}
			}
		}

		.action-box {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 50px;
			position: relative;
			padding-right: 16px;
		}

		.action-btn {
			width: 80px;
			height: 30px;
			margin: 0;
			margin-left: 12px;
			padding: 0;
			text-align: center;
			line-height: 30px;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			background: #fff;
			border-radius: 100px;

			&:after {
				border-radius: 100px;
			}

			&.recom {
				background: #fff9f9;
				color: $base-color;

				&:after {
					border-color: #f7bcc8;
				}
			}
		}
	}


	/* load-more */
	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 40px;
		align-items: center;
		justify-content: center
	}

	.uni-load-more__text {
		font-size: 14px;
		color: #999
	}

	.uni-load-more__img {
		height: 24px;
		width: 24px;
		margin-right: 10px
	}

	.uni-load-more__img>view {
		position: absolute
	}

	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: .2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite
	}

	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px
	}

	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0
	}

	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px
	}

	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0
	}

	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px
	}

	.load2 {
		transform: rotate(30deg)
	}

	.load3 {
		transform: rotate(60deg)
	}

	.load1 view:nth-child(1) {
		animation-delay: 0s
	}

	.load2 view:nth-child(1) {
		animation-delay: .13s
	}

	.load3 view:nth-child(1) {
		animation-delay: .26s
	}

	.load1 view:nth-child(2) {
		animation-delay: .39s
	}

	.load2 view:nth-child(2) {
		animation-delay: .52s
	}

	.load3 view:nth-child(2) {
		animation-delay: .65s
	}

	.load1 view:nth-child(3) {
		animation-delay: .78s
	}

	.load2 view:nth-child(3) {
		animation-delay: .91s
	}

	.load3 view:nth-child(3) {
		animation-delay: 1.04s
	}

	.load1 view:nth-child(4) {
		animation-delay: 1.17s
	}

	.load2 view:nth-child(4) {
		animation-delay: 1.3s
	}

	.load3 view:nth-child(4) {
		animation-delay: 1.43s
	}

	.main-title {
		// background: -webkit-linear-gradient(left, #FD6416 0, #FD6416 100%);
		// background: -o-linear-gradient(left, #FD6416 0, #FD6416 100%);
		// background: -ms-linear-gradient(left, #FD6416 0, #FD6416 100%);
		// background: -webkit-gradient(linear, right top, left top, color-stop(0, #FD6416), to(#FD6416));
		// background: -o-linear-gradient(right, #FD6416 0, #FD6416 100%);
		// background: linear-gradient(to left, #FD6416 0, #FD6416 100%);
		background: #fff;
		border-bottom-color: transparent;
		padding: 16upx 20upx;
		// position: fixed;
		// top: 0;
		left: 0;
		width: 100%;
		z-index: 120;
		display: block;
		box-sizing: border-box;
		margin-top: 20upx;
	}

	@-webkit-keyframes load {
		0% {
			opacity: 1
		}

		100% {
			opacity: .2
		}
	}
	.search-pop{
		margin-top: 20upx;
	}
	.search-pop .search-tab {
		margin: 10upx 0 20upx;
		color: #fff;
		font-size: 32upx;
		text-align: center;
		/* #ifdef APP-PLUS */
		padding-top: var(--status-bar-height);
		
		/* #endif */
	}

	.search-pop .search-tab .my-sub-src {
		margin: 0 auto 0 40upx;
		display: inline-block;
		color: #fff;
		line-height: 60upx;
		margin-bottom: 20upx !important;
	}

	.search-pop .search-tab .my-sub-src:nth-child(1) {
		margin-left: 0px !important;
	}

	.main-title .search-tab .cur {
		opacity: 1;
		border-bottom: 2upx solid #fff;
	}

	.main-title .search-tab .close-src {
		position: absolute;
		left: 40upx;
		display: block;
		float: left;
		color: #ffffff;
		margin-top: 10upx;
	}

	.main-title .search-tab .close-src .iconfont {
		font-size: 40upx;
	}

	.uni-input-input,
	.uni-input-placeholder {
		width: 93%;
	}

	.main-title .search {
		background-color: #fff;
		border-radius: 40upx;
		// width: 76%;
		// margin-left: 12%;
		position: relative;
		padding: 0 18upx;
		height: 64upx;
		line-height: 64upx;
		font-size: 26upx;
		margin-top: 20upx;
	}

	.search_submit {
		width: 25%;
		height: 64upx;
		background: #ffb925;
		color: #fff;
		float: right;
		margin-top: -64upx;
		position: relative;
		border-radius: 32upx;
		margin-right: -32upx;
		z-index: 30;
	}

	.clear {
		width: 70upx;
		background: white;
		color: crimson;
		position: absolute;
		z-index: 999;
		font-size: 32upx;
		/* height: 56upx; */
		margin-left: 86upx;
		margin-top: -64upx;
	}

	.main-title .search input {
		border: none;
		outline: 0;
		height: 64upx;
		font-size: 26upx;
		line-height: 60upx;
		background: #fff;
		color: #666;
		border-radius: 10upx;
		padding: 0 0 0 10upx;
		text-align: left;
	}

	.main-title .search input.search_area {
		background-color: transparent;
		position: relative;
		z-index: 99;
		width: 80%;
		color: #333;
		font-size: 24upx;
	}
</style>
