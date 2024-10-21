<template>
	<view class="cash">
		<view style="background-color: #FD6416;height: 400upx;border-bottom-right-radius: 40upx;border-bottom-left-radius: 40upx;">
			<view style="font-size: 32upx;color: #FFFFFF;padding-top: 100upx;">可提现总额</view>
			<view style="font-size: 40upx;color: #FFFFFF;padding-top: 20upx;">¥ {{mayMoney}}</view>

			<view style="width: 90%;height: max-content;margin-left: 40upx;background-color: #FFFFFF;box-shadow: rgba(183, 183, 183, 0.3) 0px 1px 10px;margin-top: 50upx;border-radius: 20upx;">
				<view style="display: flex;flex-direction: row;padding: 20upx;">
					<view style="font-size: 32upx;color: #333333;">提现金额 <text style="font-size: 28upx;color: #FD6416;" v-if="shouxufei">（注：提现手续费为{{shouxufei * 100}}%）</text>
					</view>
				</view>
				<view style="display: flex;flex-direction: row;padding: 20upx;">
					<view style="font-size: 40upx;color: #333333;">¥</view>
					<input type="number" v-model="money" placeholder="请输入金额" style="font-size: 40upx;color: #333333;text-align: left;margin-left: 10upx;width: 100%;" />
				</view>
				<view style="background: #E6E6E6;width: 100%;height: 1upx;"></view>

				<view style="display: flex;flex-direction: row;flex-wrap: wrap;">
					<view style="display: flex;flex-direction: row;" v-for="(item, index) in moneyList" :key="index">
						<view>
							<view style="padding: 20upx;" @click="getOut1(item.money)">
								<view style="padding-top: 40upx;width: 180upx; height: 120upx;background-color: #FFFFFF;border:1px solid #FD6416;border-radius: 10upx;">
									{{ item.money }}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view @click="getOut" style="margin: 32upx;font-size: 18px;background: #FD6416;color: white;border-radius: 10px;height: 40px;line-height: 40px">
				提现
			</view>

			<view style="display: flex;width: 100%;justify-content: center;">
				<view style="color: grey;padding-bottom: 30px;padding-top: 20upx;width: 33%;" @click="goZhifuBao">提现账号</view>
				<view style="color: grey;padding-bottom: 30px;padding-top: 20upx;width: 33%;" @click="goqianbao">钱包明细</view>
				<view style="color: grey;padding-bottom: 30px;padding-top: 20upx;width: 33%;" @click="gojilu">提现记录</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				money: '',
				zhifubao: '',
				mayMoney: '0',
				zhifubaoName: '',
				shouxufei: '',
				moneyList: [{
						money: '10'
					},
					{
						money: '20'
					},
					{
						money: '50'
					},
					{
						money: '100'
					},
					{
						money: '200'
					},
					{
						money: '500'
					}
				],
				value: 0,
				min: ''
			};
		},
		onShow: function(e) {
			this.getMoney();

			this.$Request.getT('/common/type/107').then(res => {
				if (res.status == 0) {
					if (res.data && res.data.value) {
						this.shouxufei = res.data.value;
					}
				}
			});
		},
		onNavigationBarButtonTap() {
			this.list();
		},
		methods: {
			gojilu() {
				uni.navigateTo({
					url: './cashList'
				});
			},
			goqianbao() {
				uni.navigateTo({
					url: './moneyList'
				});
			},
			list() {
				uni.navigateTo({
					url: '/pages/member/cashList'
				})
			},
			goZhifuBao() {
				uni.navigateTo({
					url: '/pages/member/zhifubao'
				});
			},
			getMoney() {
				let that = this;
				let token = this.$queue.getData('token');
				let userId = this.$queue.getData('userId');
				if (token) {
					//this.$queue.showLoading("加载中...");
					//可以提现金额查询预估收入查询
					this.$Request.getT("/cash/money/" + userId).then(res => {
						if (res.status === 0 && res.data) {
							// that.mayMoney = parseFloat(res.data).toFixed(2);
							// that.money = parseInt(res.data);
							
							that.$Request.getT('/userMoney/selectUserMoney?userId=' + userId).then(ress => {
								if (ress.status === 0) {
									ress.data.money = ress.data.money ? ress.data.money : 0;
									that.mayMoney = parseFloat(parseFloat(res.data) + parseFloat(ress.data.money)).toFixed(2);
								}
							});
						} else if (res.status === -102) {
							this.$queue.showToast(res.msg);
							this.$queue.logout();
							uni.navigateTo({
								url: '/pages/member/register'
							});
						} else {
							that.mayMoney = '0.00';
							// that.money = '0.00';
							//this.$queue.showToast(res.msg);
						}
					});
					this.$Request.getT("/cash/userinfo/" + userId).then(res => {
						if (res.status === 0 && res.data) {
							that.zhifubao = res.data.zhifubao;
							that.zhifubaoName = res.data.zhifubaoName;
						}
						uni.hideLoading();
					});
				}
			},
			//校验用户输入金额
			checkMobile(money) {
				return RegExp(/^1[34578]\d{9}$/).test(money);
			},
			getOut() {
				let that = this;
				let token = this.$queue.getData("token");
				let userId = this.$queue.getData("userId");
				let cashMoney = this.$queue.getData("cashMoney");
				if (token) {
					if (that.zhifubao && that.zhifubaoName) {
						if (!/^\d+$/.test(this.money)) {
							uni.showToast({
								icon: 'none',
								title: '请输入正确金额，不能包含中文，英文，特殊字符和小数'
							});
							return;
						}
						if (parseFloat(this.mayMoney).toFixed(1) >= parseFloat(this.money)) {
							if (parseFloat(this.money).toFixed(1) >= parseFloat(cashMoney)) {
								if (this.shouxufei > 0) {
									let shouxufei = parseFloat(this.money * this.shouxufei).toFixed(2);
									uni.showModal({
										title: "提现申请提示",
										content: '请仔细确认收款人信息\n\n收款人姓名:' + that.zhifubaoName + '\n\n提现金额:' + this.money + '元\n\n提现手续费：' + shouxufei +
											'\n\n收款人账号：' + that.zhifubao + '',
										success: (e) => {
											if (e.confirm) {
												this.$queue.showLoading("提现中...");
												this.$Request.getT('/cash/v1/out/' + userId + '/' + this.money).then(res => {
													if (res.status === 0 && res.data) {
														that.$queue.showToast("提现申请成功，预计三个工作日到账");
														that.getMoney();
													}else{
														that.$queue.showToast(res.msg);
													}
													uni.hideLoading();
												});
											}
										}
									});
								} else {
									uni.showModal({
										title: "提现申请提示",
										content: '请仔细确认收款人信息\n\n收款人姓名:' + that.zhifubaoName + '\n\n提现金额:' + this.money + '元\n\n收款人账号：' + that.zhifubao +
											'',
										success: (e) => {
											if (e.confirm) {
												this.$queue.showLoading("提现中...");
												this.$Request.getT('/cash/v1/out/' + userId + '/' + this.money).then(res => {
													if (res.status === 0 && res.data) {
														that.$queue.showToast("提现申请成功，预计三个工作日到账");
														that.getMoney();
													}else{
														that.$queue.showToast(res.msg);
													}
													uni.hideLoading();
												});
											}
										}
									});
								}

							} else {
								this.$queue.showToast("提现金额必须大于或等于" + cashMoney + "元才可提现");
							}
						} else {
							this.$queue.showToast("您的余额不足");
						}
					} else {
						uni.navigateTo({
							url: "/pages/member/zhifubao"
						})
					}
				} else {
					uni.navigateTo({
						url: '/pages/member/register'
					});
				}
			},
			getOut1(money) {
				let that = this;
				let token = this.$queue.getData('token');
				let userId = this.$queue.getData('userId');
				if (token) {
					if (that.zhifubao && that.zhifubaoName) {
						if (parseFloat(this.mayMoney).toFixed(1) >= parseFloat(money)) {
							if (parseFloat(money).toFixed(1) >= 10) {
								if (this.shouxufei > 0) {
									let shouxufei = parseFloat(money * this.shouxufei).toFixed(2);
									uni.showModal({
										title: '提现申请提示',
										content: '请仔细确认收款人信息\n\n收款人姓名:' + that.zhifubaoName + '\n\n提现金额:' + money + '元\n\n提现手续费：' + shouxufei +
											'\n\n收款人账号：' + that.zhifubao + '',
										success: e => {
											if (e.confirm) {
												this.$queue.showLoading('提现中...');
												this.$Request.getT('/cash/v1/out/' + userId + '/' + money).then(res => {
													if (res.status === 0) {
														that.$queue.showToast('提现申请成功，预计三个工作日到账');
														that.getMoney();
													} else {
														uni.showModal({
															title: '温馨提示',
															content: res.msg,
															showCancel: false,
															cancelText: '取消',
															confirmText: '确认'
														});
													}
													uni.hideLoading();
												});
											}
										}
									});
								} else {
									uni.showModal({
										title: '提现申请提示',
										content: '请仔细确认收款人信息\n\n收款人姓名:' + that.zhifubaoName + '\n\n提现金额:' + money + '元\n\n收款人账号：' + that.zhifubao +
											'',
										success: e => {
											if (e.confirm) {
												this.$queue.showLoading('提现中...');
												this.$Request.getT('/cash/v1/out/' + userId + '/' + money).then(res => {
													if (res.status === 0) {
														that.$queue.showToast('提现申请成功，预计三个工作日到账');
														that.getMoney();
													} else {
														uni.showModal({
															title: '温馨提示',
															content: res.msg,
															showCancel: false,
															cancelText: '取消',
															confirmText: '确认'
														});
													}
													uni.hideLoading();
												});
											}
										}
									});
								}
							} else {
								this.$queue.showToast('提现金额必须大于或等于10元才可提现');
							}
						} else {
							this.$queue.showToast("您的余额不足");
						}
					} else {
						uni.navigateTo({
							url: '/pages/member/zhifubao'
						});
					}
				} else {
					uni.navigateTo({
						url: '/pages/public/login'
					});
				}
			}
		}
	};
</script>

<style lang="less">
	@import '../../static/css/index.css';

	.view2-view-text {
		font-size: 14px;
		color: #000000;
		margin-left: 20upx;
		width: 80%;
	}

	.view2-view-image-right {
		width: 18upx;
		height: 30upx;
		margin-left: 50upx;
	}

	.cash {
		text-align: center;
		background: white;
		height: 100%;
		position: absolute;
		width: 100%;

		.cash-top {
			padding: 32upx 32upx 50upx 32upx;
			/* border-bottom: 1px solid gainsboro; */
			background: #FD6416;
		}

		.leiji {
			font-size: 14px;
			color: #ffffff;
			margin-bottom: 10px;
		}
	}
</style>
