<template>
	<view class="index-content" style="background: white;">
		<view class="top-bckground">
			<!-- banner板块 -->
			<view>
				<!-- <view class="home-bg" style="height: 300upx;"></view> -->
				<view class="swiper">
					<swiper class="swiper-container" :autoplay="true" :interval="4000" :circular="true"
						:indicator-dots="true" indicator-active-color="#FD6416" indicator-color="#cccccc"
						style="height: 240upx;padding: 18upx 16upx 8upx 16upx">
						<block v-for="(item, index3) in banners" :key="index3">
							<swiper-item class="swiper-wrapper" @tap="toGoodsInfo(item.url)">
								<image lazy-load='true' fade-show='true' :src="item.image_url"
									style="width: 100%;height: 220upx;border-radius: 32upx;" mode="scaleToFill">
								</image>
							</swiper-item>
						</block>
					</swiper>
				</view>
				<!-- banner结束 -->
				<!--首页菜单开始-->

				<!-- 分类轮播 -->
				<view class="category" v-if="navlist.length>0 &&xcxSJ==='否'">
					<view class="box">
						<swiper class="swiper" duration="300" :style="{ height: categoryHeight }"
							@change="categoryChange">
							<swiper-item v-for="(nav, index5) in navlist" :key="index5">
								<view class="category-list">
									<view class="icon" v-for="(item,ind) in nav" :key="ind"
										@tap="toNavList(item.url, item.title)">
										<image mode="widthFix" :src="item.image_url"
											style="width: 90upx;height: 90upx;border-radius: 100rpx;"></image>
										<view>{{ item.title }}</view>
									</view>
								</view>
							</swiper-item>
						</swiper>
						<view class="dots">
							<view v-for="(page, pageindex) in navlist" :key="pageindex"
								:class="{ active: pageindex == currentPageindex }"></view>
						</view>
					</view>
				</view>


				<!--首页公告开始-->
				<swiper v-if="messageList.length > 0" :autoplay="true" :vertical="true" :interval="4000"
					:circular="true" :indicator-dots="false"
					style="height: 60upx;margin-left: 32upx;margin-right: 32upx;line-height: 60upx;background: #FFF0F1;border-radius: 32upx;">
					<block v-for="(item1, index10) in messageList" :key="index10">
						<swiper-item @click="goWebView(item1)">
							<view style="display: flex;">
								<image src="../../static/img/gonggao.png"
									style="width: 140upx;height: 38upx;margin:12upx 16upx;"></image>
								<view>{{ item1.title }}</view>
							</view>
						</swiper-item>
					</block>
				</swiper>

				<view class=" margin-top-sm" v-if="xcxSJ==='否'">
					<view class="padding-lr-sm padding-top-sm" v-for="(item, index) in discountList" :key='index'
						@click="gochegnxu(item)">
						<image :src="item.image_url" mode="widthFix" style="width: 100%;"></image>
					</view>
				</view>

				<view class="margin-top-sm" v-if="isPDD==='是'">
					<view class="category1" v-if="category[0].categorybanner.length > 0">
						<view class="list">
							<view class="box" v-for="(item, i) in category[0].categorybanner" :key="item.son_name"
								@tap="changeTab(item.son_name)">
								<image lazy-load='true' fade-show='true' :src="item.imgurl"></image>
								<view class="text">{{ item.son_name }}</view>
							</view>
						</view>
					</view>
				</view>

				<view v-if="isPDD=='是'" class="padding-tb-sm text-center text-lg text-bold"
					style="color: rgba(0,0,0,.7);">精选好物</view>
				<view class=" margin-top-sm" v-if="isPDD=='是'">
					<view class="flex justify-around flex-wrap " v-if="shopList.length > 0">
						<orange-goods-card-home style="width: 49%;" v-for="(item, index) in shopList"
							logo="../../static/img/pinduoduo.png" :tkmoney="item.tkmoney" :tkmoneys="item.tkmoneys"
							:itemid="item.goodsId" :isEnable="isEnable" :is-invitation="isInvitation"
							:itempic="item.goodsThumbnailUrl" :itemtitle="item.goodsName"
							:itemprice="'¥' + item.itemprice" :itemsale="'已售 ' + item.salesTip"
							:itemendprice="item.itemendprice" :couponmoney="item.couponDiscount * 0.01">
						</orange-goods-card-home>
					</view>
				</view>

			</view>
		</view>
		<view class="scroll_top" @tap="topScrollTap" v-bind:class="[scrollTop != 0 ? 'active' : '', '']"
			style="bottom: 56px;"><text class="iconfont icon-shangla"></text></view>
	</view>

</template>

<script>
	import simpleModal from '@/components/simple-pro/customModal.vue';
	import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue';

	export default {
		components: {
			simpleModal,
			tkiQrcode
		},
		onPageScroll: function(e) {
			this.scrollTop = e.scrollTop > 200;
		},
		data() {
			return {
				category: [{
					name: '美食',
					search: '零食',
					positon: 11,
					loadingType: 0,
					page: 0,
					orderList: [],
					categorybanner: [{
							son_name: '干果',
							imgurl: 'http://img.haodanku.com/31695fbcfec8af7274b493698d5c1f5a-600'
						},
						{
							son_name: '干货',
							imgurl: 'http://img.haodanku.com/40693f1b39155f40843b4023d938a812-600'
						},
						{
							son_name: '速食',
							imgurl: 'http://img.haodanku.com/78ca01c1baddaed135f179cbf495d780-600'
						},
						{
							son_name: '零食',
							imgurl: 'http://img.haodanku.com/3bba49572000849457705fb6e7b25756-600'
						},
						{
							son_name: '饮料',
							imgurl: 'http://img.haodanku.com/e9ced92e2c3c5a9125bde206632923f8-600'
						},
						{
							son_name: '酒水',
							imgurl: 'http://img.haodanku.com/6b2095fa96eb10aef4cc968253a77e62-600'
						},
						{
							son_name: '土鸡蛋',
							imgurl: 'http://img.haodanku.com/011b54caa88d4ebf172312ad228e234c-600'
						},
						{
							son_name: '大米',
							imgurl: 'http://img.haodanku.com/be27573ccf52be1f42238f29167516da-600'
						},
						{
							son_name: '大闸蟹',
							imgurl: 'http://img.haodanku.com/ee9e645ee82d6ef1bad1a9c676122375-600'
						},
						{
							son_name: '新鲜水果',
							imgurl: 'http://img.haodanku.com/2ae6a731a71e6021383e808db628915d-600'
						}
					]
				}],
				keywords: '美食',
				xcxSJ: '1',
				currentPageindex: 0,
				categoryHeight: '300rpx',
				modalName: '',
				topH: 1000,
				logo: '../../static/img/mao.png',
				TabCur: 0,
				scrollLeft: 0,
				messageList: [],
				imageUrl: '../../static/img/common/logo.jpg',
				showEmpty: false,
				banner: [{
					id: '1'
				}],
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				banners: [{
					"id": 1,
					"createAt": "2020-11-28 22:42:01",
					"image_url": "https://tk.gomyorder.cn/img/20201128/f3d469c5370e4c2c830e807202b1ccf6.png",
					"url": "/pages/index/mian",
					"state": "true"
				}],
				haowuList: [],
				navlist: [],
				navlists: [],
				juhuasuanlist: [],
				couponlist: [],
				dataList: [],
				page: 1,
				min_id: 1,
				wanghong: false,
				min_ids: 1,
				min_ida: 1,
				erweima: '',
				cat_id: 0,
				navlist3: [],
				gender: 0,
				loadingType: 0,
				index: 0,
				show_share: false,
				genderKey: 'gender',
				copyTklStatus: '',
				isInvitation: 0,
				isEnable: "否",
				relation_id: '',
				shopList: [],
				contentText: {
					contentdown: '上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了'
				},
				releationId: 0,
				pageSize: 1,
				tuiguang: '',
				url: '',
				discountList: [], //优惠券数据列表
				isPDD: '否'
			};
		},
		onPullDownRefresh() {
			this.loadBanner();
			this.loadMenuList();
			this.loadMessage();
		},
		onLoad: function(e) {
			if (e.invitation) {
				this.$queue.setData('relation', e.invitation);
			}
			let a = this.$queue.getData("isEnable")
			if (a) {
				this.isEnable = a;
			}
			this.$queue.setData('gradeIndex', 0);
			let gender = this.$queue.getData(this.genderKey);
			if (gender) {
				if (gender === 1) {
					this.gender = gender;
				}
				if (gender === 2) {
					this.gender = gender;
				}
			}

			this.$Request.getT('/common/type/105').then(res => {
				if (res.status == 0) {
					if (res.data && res.data.value) {
						this.xcxSJ = res.data.value;
					}
				}
			});
			this.$Request.getT('/common/type/232').then(res => {
				if (res.status == 0) {
					if (res.data && res.data.value) {
						this.isPDD = res.data.value;
					}
				}
			});
			this.getShopList(this.keywords);
			this.getDiscount()
			this.loadBanner();
			this.loadMenuList();
			this.loadMessage();


			let relation_id = this.$queue.getData('relation_id');
			this.$Request.getT('/common/type/4').then(res => {
				if (res.status == 0) {
					if (res.data && res.data.value) {
						this.releationId = relation_id ? relation_id : res.data.value;

					}
				}
			});

		},
		onReachBottom() {
			this.pageSize = this.pageSize + 1
			this.getShopList(this.keywords);
		},
		onShow() {
			if (this.navlist.length == 0) {
				this.loadBanner();
				this.loadMenuList();
				this.loadMessage();
				this.getDiscount()
			}
			this.getUserInfo();
		},

		methods: {
			changeTab(keywords) {
				this.shopList = [];
			    this.$queue.showLoading('加载中...')
				this.getShopList(keywords);
			},
			/**
			 * 快速置顶
			 */
			topScrollTap: function() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
			},
			getShopList(keywords) {
				this.keywords = keywords
				let pddpid = this.$queue.getData('pinduoduopid')
				this.$Request.getP('/pdd/list/keyword/6/page/' + this.pageSize + '/pageSize/20?keyword=' + keywords +
						"&pid=" + pddpid)
					.then(res => {
						if (res.goodsSearchResponse) {
							// this.shopList = [];
							res.goodsSearchResponse.goodsList.forEach(d => {

								d.itemendprice = ((d.minGroupPrice - d.couponDiscount) * 0.01).toFixed(2);
								d.itemprice = (d.minGroupPrice * 0.01).toFixed(2);
								this.shopList.push(d);
							});
						}
						uni.hideLoading();

						uni.stopPullDownRefresh(); // 停止刷新
					});
			},
			// 获取首页优惠券
			getDiscount: function() {
				this.$Request.getT('/banner/user/list/4').then(res => {
					if (res.status === 0) {
						if (res.data.length > 0) {
							this.discountList = res.data;
						}
					}
				});
			},
			// 点击优惠券跳转小程序
			gochegnxu(e) {
				if (e.classify == 1) { //美团
					this.$Request.getT('/common/type/127').then(res => {
						if (res.status == 0) {
							if (res.data && res.data.value) {
								this.tuiguang = res.data.value;
								this.$Request.get('/order/getMtUrl?relationId=' + this.releationId +
									'&activityId=' + this.tuiguang).then(res => {
									if (res.status == 0) {
										this.url = res.data;
										uni.navigateToMiniProgram({
											appId: e.url,
											path: this.url,
											fail(res) {
												console.error(res)
											}
										})
									}
								});
							}
						}
					});
				} else if (e.classify == 2) { //饿了么
					this.$Request.getT('/common/type/128').then(res => {
						if (res.status == 0) {
							if (res.data && res.data.value) {
								this.tuiguang = res.data.value;
								this.$Request.get('/order/getElmUrl?relationId=' + this.releationId +
									'&activityId=' + this.tuiguang).then(res => {
									if (res.status == 0) {
										let wxPath = JSON.parse(res.data).tbk_activity_info_get_response
											.data.wx_miniprogram_path
										uni.navigateToMiniProgram({
											appId: 'wxece3a9a4c82f58c9',
											path: wxPath,
											fail(res) {
												console.error(res)
											}
										})
									}
								});
							}
						}
					});
				}
			},

			//更新分类指示器
			categoryChange(event) {
				this.currentPageindex = event.detail.current;
			},

			/**
				首页轮播
			 */
			loadBanner: function() {
				this.$Request.getT('/banner/user/list').then(res => {
					if (res.status === 0) {
						if (res.data.length > 0) {
							this.banners = res.data;
						}
					}
				});
			},



			// 传进数组和指定个数，进行拆分
			chunk: function(array, size) {
				//获取数组的长度，如果你传入的不是数组，那么获取到的就是undefined
				const length = array.length
				//判断不是数组，或者size没有设置，size小于1，就返回空数组
				if (!length || !size || size < 1) {
					return []
				}
				//核心部分
				let index = 0 //用来表示切割元素的范围start
				let resIndex = 0 //用来递增表示输出数组的下标

				//根据length和size算出输出数组的长度，并且创建它。
				let result = new Array(Math.ceil(length / size))
				//进行循环
				while (index < length) {
					//循环过程中设置result[0]和result[1]的值。该值根据array.slice切割得到。
					result[resIndex++] = array.slice(index, (index += size))
				}
				//输出新数组
				return result
			},
			loadMenuList: function() {
				this.$Request.getT('/activity/state/1').then(res => {
					if (res.status === 0) {
						if (res.data.length > 0) {
							var datanew = this.chunk(res.data, 10)
							this.navlist = datanew;
							console.log('navlist的数据', datanew)
							if (res.data.length > 5) {
								this.categoryHeight = "300rpx"
							} else {
								this.categoryHeight = "150rpx"
							}
						} else {
							var datanew = this.chunk(this.navlists, 10)
							this.navlist = datanew;
						}
					}
				});
			},

			// 获取用户信息
			getUserInfo() {
				let userId = this.$queue.getData('userId');
				if (userId) {
					this.$Request.getT('/user/' + userId).then(res => {
						if (res.status === 0 && res.data) {
							this.$queue.setData('image_url', res.data.image_url);
							this.$queue.setData('mobile', res.data.phone);
							this.isInvitation = res.data.isInvitation;
							this.topH = 1050;
							if (res.data.relationId) {
								this.relation_id = res.data.relationId;
								this.topH = 850;

							} else {
								this.topH = 1050;
							}
							this.$queue.setData('isInvitation', res.data.isInvitation);
							this.$queue.setData('relation', res.data.invitation);
							this.$queue.setData('grade', res.data.grade);
							this.$queue.setData('nickName', res.data.nickName);
							this.$queue.setData('relation_id', res.data.relationId);
							this.$queue.setData('gender', parseInt(res.data.gender));
						}
					});
				}
			},
			/**
			 * 加载公告
			 */
			loadMessage() {
				this.$Request.getT('/message/page/1/0/5').then(res => {
					if (res.status === 0) {
						this.messageList = res.data.content;
					}
				});
			},

			// 公告跳转
			goWebView(item) {
				if (item.type == 'url') {
					//#ifndef H5
					uni.navigateTo({
						url: '/pages/member/ping?url=' + item.url
					});
					//#endif
					//#ifdef H5
					window.location.href = item.url;
					//#endif
				}
			},

			//分类跳转小程序
			toNavList: function(url, title) {
				console.log(url, title)
				uni.navigateTo({
					url: url + '?title=' + title
				});
			},
			// 轮播图跳转小程序
			toGoodsInfo: function(url) {
				if (url.indexOf('/pages/') !== -1) {
					uni.navigateTo({
						url
					});
				} else {
					//#ifndef H5
					uni.navigateTo({
						url: '/pages/member/webview?url=' + url
					});
					//#endif
					//#ifdef H5
					window.location.href = url;
					//#endif
				}
			},



		},
	};
</script>

<style lang="scss">
	@import '../../static/css/index.css';

	.com1 {
		height: 110upx;
		width: 90rpx;
		margin-top: 34upx;
		display: block;
	}

	.font {
		color: #666666;
		font-size: 24upx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-top: 4rpx;
	}

	.dis {
		display: flex;
		justify-content: space-around;
	}

	.g_wrap {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		margin-bottom: 20rpx;

		.g_left {
			margin-right: 19rpx;

			image {
				width: 200rpx;
				height: 200rpx;
				display: block;
			}
		}

		.g_right {
			position: relative;

			.g_tit {
				display: block;
				width: 467rpx;
				height: 88rpx;
				margin-bottom: 26rpx;
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #333333;
				line-height: 48rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box; // 作为弹性伸缩盒子模型显示。
				-webkit-box-orient: vertical; // 设置伸缩盒子的子元素排列方式--从上到下垂直排列
				-webkit-line-clamp: 2;
			}

			.g_salse {
				width: 120rpx;
				height: 34rpx;
				text-align: center;
				background: url(../../static/img/nav/pic_bg.png);
				background-size: cover;
				line-height: 34rpx;
				margin-bottom: 20rpx;
				font-size: 28upx;
				color: #fff;
			}

			.txt {
				&>text:nth-child(1) {
					font-size: 24rpx;
					font-family: PingFang SC;
					// font-weight: bold;
					color: #FD6416;
					line-height: 32rpx;
				}

				&>text:nth-child(2) {
					font-size: 24rpx;
					font-family: PingFang SC;
					font-weight: bold;
					color: #FD6416;
					line-height: 32rpx;
				}

				&>text:nth-child(3) {
					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: bold;
					color: #FD6416;
					line-height: 32rpx;
				}

				&>text:nth-child(4) {
					margin-left: 9rpx;
					font-size: 24rpx;
					font-family: PingFang SC;
					font-weight: 500;
					text-decoration: line-through;
					color: #999999;
					line-height: 32rpx;
				}
			}

			.buy {
				position: absolute;
				right: 0;
				bottom: 0;
				width: 110rpx;
				height: 68rpx;
				background: #FD6416;
				border-radius: 10rpx;
				color: #ffffff;
				line-height: 68rpx;
				text-align: center;
			}
		}
	}

	.arrow_img {
		width: 78rpx;
		height: 23rpx;

	}


	.news_title {
		font-weight: bold;
		color: #FD6416;
		margin-right: 32upx;
		margin-left: 32upx;
		width: 12upx;
	}

	.xinrenhongbao image {
		animation: myfirst 1s infinite;
	}

	@keyframes myfirst {
		0% {
			transform: translate(0px, 0px);
		}

		50% {
			transform: translate(0px, -15px);
		}

		100% {
			transform: translate(0px, 0px);
		}
	}

	.box-float {
		width: 32%;
		float: left;
		position: relative;
		border-radius: 16upx;
		padding: 6upx;
	}

	.img-gender {
		border-radius: 60upx;
		/* #ifndef H5 */
		width: 60upx;
		height: 60upx;
		margin-top: 66upx
			/* #endif */
			/* #ifdef H5 */
			width: 60upx;
		height: 60upx;
		margin-top: 20upx
			/* #endif */


	}

	.top-background {
		background: -webkit-linear-gradient(left, #FD6416 0, #FF896F 100%);
		background: -o-linear-gradient(left, #FD6416 0, #FF896F 100%);
		background: -ms-linear-gradient(left, #FD6416 0, #FF896F 100%);
		background: -webkit-gradient(linear, right top, left top, color-stop(0, #FD6416), to(#FF896F));
		background: -o-linear-gradient(right, #FD6416 0, #FF896F 100%);
		background: linear-gradient(to left, #FD6416 0, #FF896F 100%);
	}

	.swiper-item img {
		display: block;
	}

	.title .fr {
		float: right;
		line-height: 50px;
		margin-right: 16px;
		font-size: 10px;
		color: #ccc;
	}

	/*#ifndef APP-PLUS*/
	.scroll_top_act {
		background: white;
		top: 45px;
		position: fixed;
	}

	/*#endif*/
	/*#ifdef APP-PLUS*/
	.scroll_top_act {
		background: white;
		top: 65px;
		position: fixed;
	}

	/*#endif*/

	.banner {
		border-radius: 10px;
		margin: 8px 8px 0 8px;
		overflow: hidden;
		display: flex;
	}

	.banner img {
		width: 100%;
	}

	.banner>.left {
		flex: 4;
		/* margin-right: 10upx; */
		border-right: 2px solid #f2f2f2;
		overflow: hidden;
	}

	.banner>.right {
		flex: 7;
	}

	.right .top {
		width: 100%;
		/* margin-bottom: 7upx; */
		/*border-bottom: 2px solid #f2f2f2;*/
		overflow: hidden;
	}

	.right .bottom {
		display: flex;
		width: 100%;
	}

	.right .bottom .bottom-left {
		flex: 6;
		/* margin-right: 5upx; */
		overflow: hidden;
		border-right: 1px solid #f2f2f2;
	}

	.right .bottom .bottom-right {
		flex: 6;
		/* margin-left: 5upx; */
		/* border-left: 1px solid #f2f2f2; */
		overflow: hidden;

	}

	.marquee-box {

		border-radius: 5px;
		overflow: hidden;
		position: relative;
		background: #fff;
		height: 26px;
		line-height: 26px;
	}

	.marquee-title {
		padding-left: 8px;
		padding-right: 8px;
		position: absolute;
		color: #ff5100;
		top: 0;
		left: 0;
		z-index: 3;
		background: #fff;
		font-size: 14px;
	}

	.marquee {
		padding: 6px 10px;
		color: #000;
		display: inline-block;
		white-space: nowrap;
		animation: 35s wordsLoop linear infinite normal;
		font-size: 14px;
	}

	@keyframes wordsLoop {
		0% {
			transform: translateX(350px);
			-webkit-transform: translateX(350px);
		}

		100% {
			transform: translateX(-100%);
			-webkit-transform: translateX(-100%);
		}
	}

	.selectTop {
		z-index: 100;
		padding-left: 16upx;
		padding-right: 16upx;
		position: fixed;
		top: 90upx;
		background: -webkit-linear-gradient(left, #FD6416 0, #FD6416 100%);
		background: -o-linear-gradient(left, #FD6416 0, #FD6416 100%);
		background: -ms-linear-gradient(left, #FD6416 0, #FD6416 100%);
		background: -webkit-gradient(linear, right top, left top, color-stop(0, #FD6416), to(#FD6416));
		background: -o-linear-gradient(right, #FD6416 0, #FD6416 100%);
		background: -webkit-linear-gradient(right, #FD6416 0, #FD6416 100%);
		background: linear-gradient(to left, #FD6416 0, #FD6416 100%);
	}

	.selectTop1 {
		z-index: 999;
		padding-left: 16upx;
		padding-right: 16upx;
		position: fixed;
		top: 130upx;
		background: -webkit-linear-gradient(left, #FD6416 0, #FD6416 100%);
		background: -o-linear-gradient(left, #FD6416 0, #FD6416 100%);
		background: -ms-linear-gradient(left, #FD6416 0, #FD6416 100%);
		background: -webkit-gradient(linear, right top, left top, color-stop(0, #FD6416), to(#FD6416));
		background: -o-linear-gradient(right, #FD6416 0, #FD6416 100%);
		background: -webkit-linear-gradient(right, #FD6416 0, #FD6416 100%);
		background: linear-gradient(to left, #FD6416 0, #FD6416 100%);
	}

	#shareit {
		-webkit-user-select: none;
		position: fixed;
		width: 100%;
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
		width: 80%;
		height: 420px;
		margin-top: 100px;
	}

	// 新加
	.nablist-1 {
		text-align: center;
		color: #333333;
		font-size: 28upx;
		font-weight: bold;
		padding-top: 16upx;
	}

	.nablist-1 image {
		margin: 0 auto;
	}

	.category {
		padding: 4upx;

		.list {
			margin-top: 20upx;
			width: 100%;
			display: flex;
			flex-wrap: wrap;

			.box {
				width: 20%;
				margin-bottom: 20upx;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-wrap: wrap;

				image {
					width: 60%;
					height: calc(71.44vw / 3 * 0.6);
				}

				.text {
					margin-top: 5upx;
					width: 100%;
					display: flex;
					justify-content: center;
					font-size: 26upx;
				}
			}
		}
	}

	.share_close {
		position: absolute;
		bottom: -0.5rem;
		left: 50%;
		margin-left: -0.3rem;
		width: 0.6rem;
		height: 0.6rem;
		background: url(http://img.haodanku.com/Fo2-nJ_43fsFStbAfqMUEcCFJnJ6);
		background-size: 100% 100%;
		cursor: pointer;
	}

	.home-bg {
		background: -webkit-linear-gradient(left, #FD6416 0, #FD6416 100%);
		background: -o-linear-gradient(left, #FD6416 0, #FD6416 100%);
		background: -ms-linear-gradient(left, #FD6416 0, #FD6416 100%);
		background: -webkit-gradient(linear, right top, left top, color-stop(0, #FD6416), to(#FD6416));
		background: -o-linear-gradient(right, #FD6416 0, #FD6416 100%);
		background: -webkit-linear-gradient(right, #FD6416 0, #FD6416 100%);
		background: linear-gradient(to left, #FD6416 0, #FD6416 100%);
		height: 350upx;
		border-bottom-right-radius: 32upx;
		border-bottom-left-radius: 32upx;

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

	.category1 {
		padding: 4upx;

		.list {
			margin-top: 20upx;
			width: 100%;
			display: flex;
			flex-wrap: wrap;

			.box {
				width: 20%;
				margin-bottom: 20upx;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-wrap: wrap;

				image {
					width: 60%;
					height: calc(71.44vw / 3 * 0.6);
				}

				.text {
					margin-top: 5upx;
					width: 100%;
					display: flex;
					justify-content: center;
					font-size: 26upx;
				}
			}
		}
	}

	.swiper-box {
		height: calc(100% - 40px);
	}



	.category {
		width: 100%;

		.box {
			width: 100%;
			border-radius: 20upx;
			background-color: #ffffff;

			.dots {
				display: flex;
				justify-content: center;
				height: 15upx;
				width: 100%;

				view {
					width: 30upx;
					height: 5upx;
					background-color: rgba(0, 0, 0, 0.2);

					&.active {
						background-color: #FD6416;
					}
				}
			}

			.swiper {
				width: 100%;
				padding: 10upx 0;

				.uni-swiper-dot {
					width: 20upx;
				}

				.category-list {
					width: 100%;
					height: auto;
					display: flex;
					justify-content: flex-start;
					padding: 10upx 0;
					flex-flow: wrap;

					.icon {
						width: 25%;
						display: flex;
						flex-flow: wrap;
						justify-content: center;
						font-size: 22upx;
						color: #666;
						margin-bottom: 20upx;
						position: relative;

						image {
							width: 70%;
							height: 13.3vw;
						}

						view {
							width: 100%;
							display: flex;
							justify-content: center;
						}

						.remen,
						.lijian {
							width: 60upx;
							height: 30upx;
							position: absolute;
							top: 0;
							right: 0;
						}
					}
				}
			}
		}
	}

	.sale {
		background: url(../../static/img/nav/salse.png);
		background-size: cover;
		font-size: 20upx;
		width: 320rpx;
		height: 32rpx;
		text-align: center;
		color: #fff;
		position: relative;
		left: -108rpx;
		top: 8rpx;
	}
</style>
