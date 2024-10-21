<template>
	<view class="index">
		<view
			style="position: absolute;width: 100%;height: 480upx;background-image:url('https://game.shengqianxiong.com.cn/img/20210518/cca74e49472d462f81a304f47f97371b.png');background-size:cover;">
		</view>
		<!-- #ifdef H5 -->
		<view class="back" @click="back"></view>

		<!-- #endif -->
		<!-- #ifndef H5 -->
		<view class="back mark" @click="back"></view>
		<!-- #endif -->
		<view style="color: #FFFFFF;position: relative;padding-left: 32upx;padding-top: 140upx;margin-bottom:40upx;">
			<view style="font-size: 32upx;">当前积分（个）</view>
			<view style="display: flex;">
				<view style="padding-top: 30upx;font-size: 60upx;font-weight: bold;width: 70%;margin-bottom:20upx;">
					{{ total ? total : 0 }}
				</view>
			</view>
			<view @click="goMoney" class="dh">积分兑换</view>
		</view>
		
		<!-- <view class="xinrenhongbao">
			<image @click="goHongbao" src="https://api.shengqianxiong.com.cn/img/20201121/dcdb1ae5d17646ab9c0fa33007fb45be.png"
			 style="width: 160upx;height: 160upx;position: fixed;bottom: 160upx;right: 32upx;z-index: 99;"></image>
		
		</view> -->
		
		<view
			style="border-radius:12px;border:1px solid rgba(238,238,238,1);position: relative;background: #FFFFFF;margin: 0 0 24upx 0;">
			<view style="text-align: left;margin-top: 32upx">

				<text class="jfmx">积分明细</text>

			</view>
			<view v-if="contents.length==0"
				style="margin-top: 300upx;color: #999999;text-align: center;margin-bottom: 400upx;">暂无积分</view>
			<view v-for="(item, index) in contents" :key="index"
				style="padding: 32upx;border-bottom: 1upx solid #F0F0F0;font-size: 32upx;color: #666666;">
				<view style="display: flex;">
					<view style="width: 500upx;overflow: hidden;text-overflow: ellipsis;white-space:nowrap;font-size:28upx;
font-weight: bold;">{{item.des}}</view>

					<view class="bj_wrap">
						<view class="jifen_number" v-if="item.content!='积分兑换'">+ {{ item.number }}</view>
						<view class="jifen_number" v-if="item.content=='积分兑换'">- {{ item.number }}</view>
						<image class="jb" src="../../static/my/jb.png"></image>
					</view>

				</view>
				<view style="margin-top: 4upx;color: #999999;font-size: 28upx;">{{ item.createAt }}</view>
			</view>

			<!-- 悬浮上拉 -->
			<view class="scroll_top" @tap="topScrollTap" v-bind:class="[scrollTop ? 'active' : '','']"
				style="bottom: 56px;">
				<text class="iconfont icon-shangla"></text>
			</view>

			<!-- 加载更多提示 -->
			<view class="s-col is-col-24" v-if="contents.length > 0">
				<load-more :loadingType="loadingType" :contentText="contentText"></load-more>
			</view>
			<!-- 加载更多提示 -->
			<empty v-if="contents.length === 0" des="暂无数据" show="false"></empty>

		</view>


	</view>
</template>
<script>
	/**
 * 	// "app-plus": {
				// 	"scrollIndicator": "none",
				// 	"bounce": "none",
				// 	"titleNView": true,
				// 	"backgroundColor":"#EDF1F7"
				// }
 */
	export default {
		data() {
			return {
				contents: [],
				modalName: '',
				isLogin: false,
				percent: 0,
				total: 0,
				page: 0,
				size: 10,
				loadingType: 0,
				type: '',
				title: '',
				scrollTop: false,
				contentText: {
					contentdown: '上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了'
				}
			};
		},
		onShow() {
			let userId = this.$queue.getData('userId');
			if (userId) {
				this.getUserInfo(userId);
				this.getToatal(userId);
			}
		},
		methods: {
			goHongbao() {
				uni.navigateTo({
					url: "/pages/member/choujiang"
				})
			},
			back() {
				uni.navigateBack();
			},
			hideModal() {
				this.modalName = ''
			},
			showModals() {
				this.modalName = 'RadioModal'
			},
			goMoney() {
				uni.navigateTo({
					url: '/pages/member/chongzhi'
				})
			},
			goBack() {
				uni.navigateBack({

				})
			},
			changeLogin() {
				this.isLogin = true;
				this.percent = 100;
			},
			//获取用户信息
			getUserInfo(userId) {
				this.$Request.getT('/user/' + userId).then(res => {
					if (res.status === 0) {
						if (res.data.orderJifen) {
							this.total = parseFloat(res.data.orderJifen).toFixed(0);
						}

					} else {
						this.$queue.logout();
						uni.showModal({
							title: '用户信息提示',
							content: '本地用户信息失效需要重新授权登录',
							showCancel: false,
							success: e => {
								//#ifdef H5
								if (e.confirm) {
									window.location.reload();
								} else {
									window.location.reload();
								}
								//#endif
								//#ifndef H5
								this.navTo('/pages/public/login');
								//#endif
							}
						});
					}
				});
			},
			getToatal(userId) {
				this.loadingType = 1;
				uni.showLoading({
					title: '加载中...',
				});
				this.$Request.postT('/user/getUserJifenList/' + userId + '/' + this.page + '/' + this.size).then(res => {
					if (res.status === 0) {
						if (this.page === 0 || res.status) {
							this.contents = [];
						}
						res.data.content.forEach(d => {
							this.contents.push(d);
						});
						if (res.data.content.length === this.size) {
							this.loadingType = 0;
						} else {
							this.loadingType = 3;
						}
					} else {
						this.loadingType = 2;
					}
					uni.hideLoading();
				});
			},
			goPage(url) {
				uni.navigateTo({
					url: url
				});
			},
			topScrollTap: function() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
			}
		},
		onPageScroll: function(e) {
			this.scrollTop = e.scrollTop > 200;
		},
		onReachBottom: function() {
			this.page = this.page + 1;
			let userId = this.$queue.getData('userId');
			if (userId) {
				this.getUserInfo(userId);
				this.getToatal(userId);
			}
		}
	};
</script>

<style scoped>
	@import '../../static/css/index.css';

	.index {}

	.back {

		width: 35upx;
		height: 35upx;
		border-top: 6upx solid #ffffff;
		border-left: 6upx solid #ffffff;
		transform: rotate(-45deg);
		/* background: red; */
		position: relative;
		margin-left: 29upx;

		top: 38upx;

		z-index: 999;
		/* margin-top: 38upx; */
	}

	.back.mark {
		top: var(--status-bar-height);
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

	.jfmx {
		font-size: 32upx;
		margin-left: 30upx;

		font-size: 38upx;
		font-family: PingFang SC;
		font-weight: 800;
		color: #333333;
		line-height: 32upx;
	}

	.jifenguize {
		width: 180upx;
		height: 60upx;
		background: rgba(255, 255, 255, 1);
		border-radius: 30upx 0px 0px 30upx;
		opacity: 0.3;
	}

	.dh {
		width: 160upx;
		height: 60upx;
		background: #FFCE5E;
		border-radius: 40upx;
		line-height: 60upx;
		text-align: center;
		/* margin-top: 41upx; */
	}

	.jb {
		width: 30upx;
		height: 30upx;
	}

	.bj_wrap {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 150upx;
		height: 50upx;
		padding: 0 4upx;

		background: linear-gradient(90deg, #000000 0%, #FF5A57 0%, #FF1D19 100%);
		border-radius: 25upx;
		color: #ffffff;
	}

	.news_title {
		font-weight: bold;
		color: #E67817;
		margin-right: 16px;
		margin-left: 16px;
		width: 6px;
	}

	.back_img {
		position: relative;
		width: 24upx;
		height: 32upx;

	}

	.jifen_active {
		background: #f0f0f0;
		padding: 6upx 16upx;
		height: 50upx;
		border-radius: 8upx;
		margin-top: 40upx;
		color: #999999;
	}

	.jifen_noactive {
		background: #0055b8;
		padding: 6upx 16upx;
		height: 50upx;
		border-radius: 8upx;
		margin-top: 40upx;
		color: #ffffff;
	}

	.jifen_login {
		display: flex;
		margin-left: 32upx;
		margin-right: 32upx;
		border-bottom: 1upx solid #f1f1f1;
		padding-bottom: 32upx;
	}

	.jifen_number {
		color: #ffffff;
		margin-left: 8upx;
	}

	.total_jifen {
		width: 40%;
		text-align: right;
		font-size: 14px;
		color: grey;
	}

	.jifen_title {
		width: 60%;
		font-size: 32upx;
	}

	.jifen {
		display: flex;
		margin: 8px 16px 8px 16px;
		border-bottom: 1upx solid #f1f1f1;
		padding-bottom: 20upx;
		padding-top: 8upx;
	}

	.top_yuan {
		margin-left: 37%;
		border-radius: 200px;
		width: 200upx;
		height: 200upx;
		border: 4upx dotted #f1f1f1;
	}

	.title {
		text-align: center;
		color: #ffffff;
		font-size: 26px;
		/* background-position: center; */
		/* background-image: url(../../../static/jifenimg.png); */
		/* background: #0055b8; */
		/* border-bottom-left-radius: 180px;
		border-bottom-right-radius: 180px; */
		height: 250upx;
	}

	.news_title {
		font-weight: bold;
		color: #f9221d;
		margin-right: 16px;
		margin-left: 16px;
		width: 6px;
	}

	.news_content {
		display: flex;
		text-align: left;
		padding: 8px 16px 8px 16px;
		background: #ffffff;
		margin-top: 1px;
	}

	.news_content_text {
		margin-top: 8px;
		width: 200px;
		overflow: hidden;
		font-size: 16px;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>
