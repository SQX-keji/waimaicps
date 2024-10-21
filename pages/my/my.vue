<template>
	<view class="index">
		<!-- 余额显示 -->
		<view class="wrap">
			<text>账户余额</text>
			<view class="sec">
				<view class="pri">
					<text>{{moneys}}</text>
					<view @click="tx">去提现</view>
				</view>
				<view @click="showTitle(1)">本月预估总收益 {{nowMonth}}</view>
			</view>
			<view class="thir">

				<view style="width: 33%;" @click="showTitle(2)">
					<text>累计收益</text>
					<text>{{sumOrderMoney}}</text>
				</view>
				<view style="width: 33%;" @click="showTitle(3)">
					<text>今日团队收益</text>
					<text>{{teamDayTotalMoney}}</text>
				</view>

				<view style="width: 33%;" @click="showTitle(4)">
					<text>本月个人收益</text>
					<text>{{monthYuGu}}</text>
				</view>
			</view>

			<view class="thir" style="margin-top: 32upx;">
				<view style="width: 33%;" @click="showTitle(5)">
					<text>本月团队收益</text>
					<text>{{teamTotalMoney}}</text>
				</view>
				<view style="width: 33%;" @click="showTitle(6)">
					<text>上月结算收益</text>
					<text>{{lastjiesuan}}</text>
				</view>
				<view style="width: 33%;" @click="showTitle(7)">
					<text>上月付款收益</text>
					<text>{{lastMoneyAll}}</text>
				</view>
			</view>
		</view>
		<!-- 时间分割 -->
		<view class="nav">
			<view @click="chooseNav" data-num="1">
				<text :class="[current=='1'?'red':'' ]">今日</text>
				<view :class="[current=='1'?'active':'unactive' ]"></view>
			</view>
			<view @click="chooseNav" data-num="2">
				<text :class="[current=='2'?'red':'' ]">昨日</text>
				<view :class="[current=='2'?'active':'unactive']"></view>
			</view>
			<view @click="chooseNav" data-num="3">
				<text :class="[current=='3'?'red':'' ]">本月</text>
				<view :class="[current=='3'?'active':'unactive']"></view>
			</view>
			<view @click="chooseNav" data-num="4">
				<text :class="[current=='4'?'red':'' ]">上月</text>
				<view :class="[current=='4'?'active':'unactive']"></view>
			</view>
		</view>

		<view class="item">
			<view class="tit">我的收益</view>
			<view class="note">
				<text style="width: 33%;text-align: center;">购买渠道</text>
				<text style="width: 33%;text-align: center;">付款笔数</text>
				<text style="width: 33%;text-align: center;">预估佣金(元)</text>
			</view>
			
			<view v-if="orderInfo.myOrder" class="note notes" v-for="(item,index) in orderInfo.myOrder" :key="index">
				<text style="width: 33%;text-align: center;" v-if="item.fromInfo=='tb'">淘宝</text>
				<text style="width: 33%;text-align: center;" v-if="item.fromInfo=='jd'">京东</text>
				<text style="width: 33%;text-align: center;" v-if="item.fromInfo=='pdd'">拼多多</text>
				<text style="width: 33%;text-align: center;" v-if="item.fromInfo=='mt'">美团</text>
				<text style="width: 33%;text-align: center;" v-if="item.fromInfo=='elm'">饿了么</text>
				<text style="width: 33%;text-align: center;">{{item.counts}}</text>
				<text style="width: 33%;text-align: center;">{{item.money | formatPrice}}</text>
			</view>
		</view>
		<view class="item">
			<view class="tit">团队收益</view>
			<view class="note">
				<text style="width: 33%;text-align: center;">购买渠道</text>
				<text style="width: 33%;text-align: center;">付款笔数</text>
				<text style="width: 33%;text-align: center;">预估佣金(元)</text>
			</view>
			<view v-if="orderInfo.teamOrder" class="note notes" v-for="(item,index) in orderInfo.teamOrder"
				:key="index">
				<text style="width: 33%;text-align: center;" v-if="item.fromInfo=='tb'">淘宝</text>
				<text style="width: 33%;text-align: center;" v-if="item.fromInfo=='jd'">京东</text>
				<text style="width: 33%;text-align: center;" v-if="item.fromInfo=='pdd'">拼多多</text>
				<text style="width: 33%;text-align: center;" v-if="item.fromInfo=='mt'">美团</text>
				<text style="width: 33%;text-align: center;" v-if="item.fromInfo=='elm'">饿了么</text>
				<text style="width: 33%;text-align: center;">{{item.counts}}</text>
				<text style="width: 33%;text-align: center;">{{item.money | formatPrice}}</text>
			</view>
		</view>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				arr: [1, 2],
				current: '1',
				moneys: 0,
				orderNum: 0,
				monthYuGu: 0,
				jiesuan: 0,
				moneyAll: 0,
				nowMonth: 0,
				teamTotalMoney: 0,
				teamDayTotalMoney: 0,
				personDayTotalMoney: 0,
				orderInfo: {},
				lastjiesuan: 0,
				sumOrderMoney: 0,
				lastMoneyAll: 0,
				totalMoney: 0,
				list: [{
					name: '淘宝',
					num: '12',
					add: '+23.00'
				}, {
					name: '京东',
					num: '12',
					add: '+23.00'
				}, {
					name: '拼多多',
					num: '12',
					add: '+23.00'
				}]
			}
		},
		filters: {
			formatPrice(data) {
				if (typeof(data) === "number") {
					return parseFloat(data).toFixed(2);
				}
				return 0.00;
			}
		},
		onLoad() {
			let userId = this.$queue.getData('userId');
			this.$Request.getT('/cash/money/' + userId).then(res => {
				if (res.status === 0 && res.data) {
					// this.moneys = parseFloat(res.data).toFixed(2);
					this.$Request.getT('/userMoney/selectUserMoney?userId=' + userId).then(ress => {
						if (ress.status === 0) {
							ress.data.money = ress.data.money ? ress.data.money : 0;
							this.moneys = parseFloat(parseFloat(res.data) + parseFloat(ress.data.money)).toFixed(2);
						}
						uni.hideLoading();
					});
				} else {
					this.moneys = '0';
				}
			});
			this.getMoney();
			this.getOrderDetails(1)
		},
		methods: {
			getOrderDetails(item) {
				let relation_id = this.$queue.getData('relation_id');
				this.$Request.getT('/order/selectOrderCount?relationId=' + relation_id + '&day=' + item).then(res => {
					if (res.status === 0 && res.data) {
						this.orderInfo = res.data;
					}
				});
			},
			showTitle(item) {
				if (item == 1) {
					uni.showModal({
						showCancel: false,
						confirmColor: '#FD6416',
						title: '累计收益说明',
						content: '累计所有已结算订单的收益'
					});
				} else if (item == 2) {
					uni.showModal({
						showCancel: false,
						confirmColor: '#FD6416',
						title: '今日付款订单说明',
						content: '今日个人推广产生的订单数量'
					});
				} else if (item == 3) {
					uni.showModal({
						showCancel: false,
						confirmColor: '#FD6416',
						title: '今日团队收益说明',
						content: '今日团队和个人【确认收货】和【已付款】订单的佣金收入！下月25号结算'
					});
				} else if (item == 4) {
					uni.showModal({
						showCancel: false,
						confirmColor: '#FD6416',
						title: '本月个人收益说明',
						content: '本月个人【确认收货】和【已付款】订单的佣金收入！下月25号结算'
					});
				} else if (item == 5) {
					uni.showModal({
						showCancel: false,
						confirmColor: '#FD6416',
						title: '本月团队收益说明',
						content: '本月团队和个人【确认收货】和【已付款】订单的佣金收入！下月25号结算'
					});
				} else if (item == 6) {
					uni.showModal({
						showCancel: false,
						confirmColor: '#FD6416',
						title: '上月结算收益说明',
						content: '上月团队和个人【确认收货】订单的佣金收入！本月25号结算'
					});
				} else if (item == 7) {
					uni.showModal({
						showCancel: false,
						confirmColor: '#FD6416',
						title: '上月付款收益说明',
						content: '上月团队和个人【已付款】还未【确认收货】的订单的佣金收入！下月25号结算'
					});
				}

			},
			//获取付款收入查询
			getMoney() {
				let that = this;
				let token = this.$queue.getData('token');
				let relation_id = this.$queue.getData('relation_id');
				if (token && relation_id && relation_id !== 'undefined') {
					//团队本月付款收入
					var date = new Date();
					var year = date.getFullYear();
					var month = date.getMonth() + 1;
					var day = date.getDate();
					if (month < 10) {
						month = '0' + month;
					}
					if (day < 10) {
						day = '0' + day;
					}
					var month1 = date.getMonth();
					var nowDate = year + '-' + month;
					if (month1 < 10) {
						month1 = '0' + month1;
					}
					var lastDate = year + '-' + month1;

					var nowDataDate = year + '-' + month + '-' + day;

					//本月团队已经付款
					this.$Request.getT('/statistics/TeamOrderTotalByRelation?relation=' + relation_id +
						'&tk_status=12&time=' +
						nowDate).then(res => {
						if (res.status === 0) {
							let teamTotalMoney = 0;
							if (res.data) {
								teamTotalMoney = parseFloat(res.data).toFixed(2);
							}
							//本月团队已经结算收益
							this.$Request.getT('/statistics/TeamOrderTotalByRelation?relation=' + relation_id +
								'&tk_status=3&time=' +
								nowDate).then(res => {
								if (res.status === 0 && res.data) {
									this.teamTotalMoney = (parseFloat(res.data) + parseFloat(
											teamTotalMoney))
										.toFixed(2);
								} else {
									this.teamTotalMoney = teamTotalMoney;
								}
								//本月预估收益
								this.nowMonth = (parseFloat(this.teamTotalMoney) + parseFloat(this
										.monthYuGu))
									.toFixed(2);
								uni.hideLoading();
							});
						} else {
							this.teamTotalMoney = '0';
						}
						//本月预估收益
						this.nowMonth = (parseFloat(this.teamTotalMoney) + parseFloat(this.monthYuGu))
							.toFixed(2);
						uni.hideLoading();
					});


					//今日团队已经付款
					this.$Request.getT('/statistics/TeamOrderTotalByRelation?relation=' + relation_id +
						'&tk_status=12&time=' +
						nowDataDate).then(res => {
						if (res.status === 0) {
							let teamDayTotalMoney = 0;
							if (res.data) {
								teamDayTotalMoney = parseFloat(res.data).toFixed(2);
							}
							//本月团队已经结算收益
							this.$Request.getT('/statistics/TeamOrderTotalByRelation?relation=' + relation_id +
								'&tk_status=3&time=' +
								nowDataDate).then(res => {
								if (res.status === 0 && res.data) {
									this.teamDayTotalMoney = (parseFloat(res.data) + parseFloat(
											teamDayTotalMoney))
										.toFixed(2);
								} else {
									this.teamDayTotalMoney = teamDayTotalMoney;
								}

								uni.hideLoading();
							});
						} else {
							this.teamDayTotalMoney = '0';
						}

						uni.hideLoading();
					});




					//预估本月付款收入查询
					this.$Request.getT('/order/count?relation_id=' + relation_id + '&tk_status=12').then(res => {
						if (res.status === 0) {

							let dataMoney = 0;
							if (res.data) {
								this.moneyAll = parseFloat(res.data).toFixed(2);
								dataMoney = parseFloat(res.data).toFixed(2);
							}
							//预估本月结算查询
							this.$Request.getT('/order/count?relation_id=' + relation_id + '&tk_status=3').then(
								res => {
									if (res.status === 0 && res.data) {
										this.monthYuGu = (parseFloat(res.data) + parseFloat(dataMoney)).toFixed(2);
									} else {
										this.monthYuGu = dataMoney;
									}
									//本月预估收益
									this.nowMonth = (parseFloat(this.teamTotalMoney) + parseFloat(this
											.monthYuGu))
										.toFixed(2);
								});
						} else {
							this.monthYuGu = '0';
							that.moneyAll = '0';
						}
						//本月预估收益
						this.nowMonth = (parseFloat(this.teamTotalMoney) + parseFloat(this.monthYuGu))
							.toFixed(2);
					});


					//预估本月个人结算查询
					this.$Request.getT('/order/count?relation_id=' + relation_id + '&tk_status=3').then(res => {
						if (res.status === 0 && res.data) {
							that.jiesuan = parseFloat(res.data).toFixed(2);
						} else {
							that.jiesuan = '0';
						}
					});

					//累计到账收益
					this.$Request.getT('/order/sumOrderMoney?relationId=' + relation_id).then(res => {
						if (res.status === 0 && res.data) {
							that.sumOrderMoney = parseFloat(res.data).toFixed(2);
						} else {
							that.sumOrderMoney = '0';
						}
					});


					//预估上月结算查询
					this.$Request.getT('/order/last/count?relation_id=' + relation_id + '&tk_status=3').then(res => {
						if (res.status === 0 && res.data) {
							that.lastjiesuan = parseFloat(res.data).toFixed(2);
						} else {
							that.lastjiesuan = '0';
						}
						this.$Request.getT('/statistics/TeamOrderTotalByRelation?relation=' + relation_id +
							'&tk_status=3&time=' +
							lastDate).then(res => {
							if (res.status === 0 && res.data) {
								this.lastjiesuan = (parseFloat(res.data) + parseFloat(this.lastjiesuan))
									.toFixed(2);
							} else {
								this.lastjiesuan = this.lastjiesuan;
							}

							uni.hideLoading();
						});
					});


					//预估上月付款查询
					this.$Request.getT('/order/last/count?relation_id=' + relation_id + '&tk_status=12').then(res => {
						if (res.status === 0 && res.data) {
							that.lastMoneyAll = parseFloat(res.data).toFixed(2);
						} else {
							that.lastMoneyAll = '0';
						}
						this.$Request.getT('/statistics/TeamOrderTotalByRelation?relation=' + relation_id +
							'&tk_status=12&time=' +
							lastDate).then(res => {
							if (res.status === 0 && res.data) {
								this.lastMoneyAll = (parseFloat(res.data) + parseFloat(this.lastMoneyAll))
									.toFixed(2);
							} else {
								this.lastMoneyAll = this.lastMoneyAll;
							}

							uni.hideLoading();
						});
					});


					//今日付款订单数
					this.$Request.getT('/order/paidCount/' + relation_id).then(res => {
						if (res.status === 0 && res.data) {
							that.orderNum = res.data;
						} else {
							that.orderNum = '0';
						}
					});

					//本月预估收益
					this.nowMonth = (parseFloat(this.teamTotalMoney) + parseFloat(this.monthYuGu))
						.toFixed(2);
				} else {
					that.teamTotalMoney = '0';
					that.orderNum = '0';
					that.moneyAll = '0';
					that.lastjiesuan = '0';
					that.lastMoneyAll = '0';
					that.orderMonthNum = '0';
					that.jiesuan = '0';
				}
			},
			chooseNav(e) {
				console.log(e.currentTarget.dataset.num)
				this.current = e.currentTarget.dataset.num;
				this.getOrderDetails(e.currentTarget.dataset.num)
			},
			tx() {
				uni.navigateTo({
					url: '/pages/member/cashDetail'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.index {
		background: #EDF1F7;
	}

	.wrap {
		color: #ffffff;
		padding: 0 40upx 50upx;
		;
		// width: 750upx;
		// height: 320upx;
		padding-top: 40upx;
		background: #FD6416;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
	}

	.pri {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 22upx;

	}

	.pri>text {

		font-size: 48upx;
		font-family: DINPro;
		font-weight: bold;
		color: #FFFFFF;
		line-height: 32upx;
		margin-right: 320upx;
	}

	.pri>view {
		width: 160upx;
		height: 58upx;
		background: #FFFFFF;
		border-radius: 29upx;
		font-size: 24upx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #FF1E43;
		line-height: 58upx;
		text-align: center;

	}

	.sec {
		margin-top: 40upx;
		margin-bottom: 61upx;
	}

	.thir {
		display: flex;
		width: 100%;
		justify-content: flex-start;
		align-items: center;
	}

	.thir>view {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;

	}

	.thir>view>text:nth-child(1) {
		margin-bottom: 17upx;
	}



	.nav {
		display: flex;
		padding-top: 28upx;
		background: #ffffff;

		font-size: 32upx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #666666;
		padding-bottom: 14upx;

		view {
			flex: 1;
			text-align: center;
			display: flex;
			flex-direction: column;
			justify-content: flex-start;

		}

		.active {
			background: #FD6416;
			width: 36upx;
			height: 6upx;
			margin: 0 auto;
			// margin-top: 10upx;
			border-bottom: 6upx solid #FD6416;
			position: relative;
			top: 12upx;
		}

		.unactive {
			width: 36upx;
			height: 6upx;
			border-radius: 4upx;
			margin: 0 auto;
			// margin-top: 10upx;
			// border-bottom: 4upx solid 
		}

		// }
	}

	.item {
		background: #ffffff;
		margin-top: 20upx;
		padding: 40upx 40upx 4upx;

		.tit {
			padding-bottom: 19upx;
			border-bottom: 1px solid #E6E6E6;
			margin-bottom: 20upx;

			font-size: 32upx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #333333;
		}

		.note {
			display: flex;
			justify-content: space-around;

			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #999999;
			margin-bottom: 42upx;

			text {
				text-align: left;
				position: relative;
				left: -48upx;

			}
		}

		.notes {
			font-size: 38upx;
			font-family: DINPro;
			font-weight: 500;
			color: #333333;

		}
	}

	.red {
		color: #FD6416;
	}
</style>
