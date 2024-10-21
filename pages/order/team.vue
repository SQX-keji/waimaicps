<template>
	<view class="content">
		<view class="navbar" v-if="setting==2">
			<view v-for="(item, index) in tabListz" :key="index" class="nav-item" :class="{current: tabFromIndexs === item.totalElementts}"
			 @click="getMoney(item.totalElementts)">
				{{item.text}}
			</view>
		</view>
		<view class="navbar">
			<view v-for="(item, index) in tabList" :key="index" class="nav-item" :class="{current: tabFromIndex === index}"
			 @click="tabClicks(index)">
				{{item.text}}
			</view>
		</view>
		<view class="navbar">
			<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{current: tabCurrentIndex === index}"
			 @click="tabClick(index)">
				{{item.text}}({{item.totalElements}})
			</view>
		</view>
		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view class="list-scroll-content" lower-threshold @scrolltolower="loadMore" scroll-y>
					<!-- 空白页 -->
					<empty v-if="tabItem.loaded === true && tabItem.orderList.length === 0" des="暂无数据"></empty>
					<!-- 订单列表 -->


					<view v-for="(item,index) in tabItem.orderList" :key="index" class="order-item" @click="toGoodsInfo(item.item_id,item.item_title)">
						<view class="i-top b-b">
							<text class="time" style="font-size: 14px;color: grey">{{item.tk_paid_time}}付款</text>
							<text class="state" :style="{color: item.stateTipColor}">{{item.stateTip}}</text>
						</view>
						<view class="goods-box-single">
							<image class="goods-img" v-if="item.fromInfo!='jd'" :src='item.image'></image>
							<view class="right">
								<text class="title clamp"><text style="color: #FD6416;" v-if="item.flow_source&&item.flow_source=='自主推广'">【比价订单】</text>{{item.item_title}}</text>
								<text class="attr-box" v-if="item.seller_shop_title">店铺名称 {{item.seller_shop_title}}</text>
								<text class="price">实付款 ￥{{item.alipay_total_price}}</text>
								<text class="attr-box" v-if="item.userName">代理名称 {{item.userName?item.userName:'未知'}}</text>
								<text class="attr-box" v-if="item.isGif==0">代理提成 ￥{{item.pub_share_pre_fee_user}}</text>
								<text v-if='item.isGif==1||item.isGif==2' class="price" style="color: #FD6416;font-weight: bold">
									代理提成 {{item.alipay_total_price>5?'减免5元':'免单'}}
								</text>
							</view>
						</view>
						<view class="price-box">
							<text>{{item.tk_status===3?'预估收入':''}}{{item.tk_status===12?'预估收入':''}}{{item.tk_status===13?'已失效':''}}</text>

							<text v-if="tabFromIndexs==1" class="price" style="color: #FD6416;font-weight: bold">
								{{item.tk_status!==13?item.invitationMoney:'--'}}
							</text>
							<text v-if="tabFromIndexs==2" class="price" style="color: #FD6416;font-weight: bold">
								{{item.tk_status!==13?item.invitationMoneys:'--'}}
							</text>
						</view>

					</view>

					<uni-load-more :status="tabItem.loadingType"></uni-load-more>

				</scroll-view>
			</swiper-item>
		</swiper>
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
				setting: 1,
				// tabFromIndexs: 1,
				tabListz: [{
					state: 'zs',
					text: '直属',
					totalElementts: 1
				}, {
					state: 'fzs',
					text: '非直属',
					totalElementts: 2
				}],
				tabFromIndex: 0,
				tabFromIndexs: 1,
				tabCurrentIndex: 0,
				fromInfo: 'elm',
				scrollTop: false,
				tabList: [{
					state: 'elm',
					text: '饿了么',
					totalElements: 0
				},{
					state: 'mt',
					text: '美团',
					totalElements: 0
				}],
				navList: [{
						state: -1,
						text: '全部',
						page: 0,
						loadingType: 'more',
						totalElements: 0,
						orderList: []
					}, {
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
			this.getSetting();
			this.loadData();
			this.getMoney(1)
			this.loadDatas(0);
			this.loadDatas(1);
			this.loadDatas(2);
			this.loadDatas(3);

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
			loadDatas(tabCurrentIndex) {
				//这里是将订单挂载到tab列表下
				let navItem = this.navList[tabCurrentIndex];
				let state = navItem.state;
				let page = navItem.page;
				let relation_id = this.$queue.getData("relation_id");
				if (relation_id) {
					this.$Request.getT("/order/team/page/" + page + "/size/10/status/" + state + "/from/" + this.fromInfo +
							"/relation/" + relation_id + '/' + this.tabFromIndexs)
						.then(res => {
							if (res.status === 0) {
								navItem.totalElements = res.data.totalElements;
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
					this.$Request.getT("/order/team/page/" + page + "/size/10/status/" + state + "/from/" + this.fromInfo +
							"/relation/" + relation_id + '/' + this.tabFromIndexs)
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
			getMoney(zhishu) {
				console.log('zhishu', zhishu)
				this.tabFromIndexs = zhishu;
				this.navList = [{
						state: -1,
						text: '全部',
						page: 0,
						loadingType: 'more',
						totalElements: 0,
						orderList: []
					}, {
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
				]
				this.loadData('tabChange');
				this.loadDatas(0);
				this.loadDatas(1);
				this.loadDatas(2);
				this.loadDatas(3);

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
							state: -1,
							text: '全部',
							page: 0,
							loadingType: 'more',
							totalElements: 0,
							orderList: []
						}, {
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
				this.loadDatas(0);
				this.loadDatas(1);
				this.loadDatas(2);
				this.loadDatas(3);
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

	.uni-swiper-item {
		height: auto;
	}

	.order-item {
		display: flex;
		flex-direction: column;
		padding-left: 15px;
		background: #fff;
		margin-top: 8px;
		padding: 0 30upx;

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
				color: #FD6416;
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
					height: 60upx;
					overflow: hidden;
					text-overflow: ellipsis;
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					line-height: 1;

					overflow: hidden;
					display: -webkit-box; //将元素设为盒子伸缩模型显示
					-webkit-box-orient: vertical; //伸缩方向设为垂直方向
					-webkit-line-clamp: 2; //超出3行隐藏，并显示省略号
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
				color: #FD6416;

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

	@-webkit-keyframes load {
		0% {
			opacity: 1
		}

		100% {
			opacity: .2
		}
	}
</style>
