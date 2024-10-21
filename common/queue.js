/**
 * 
 * @author maxd
 * @date 2019.8.1
 */
module.exports = {
	//微信的appId
	getWxAppid() {
		return 'wxb793be4e9400d6f2'
	},
	//淘宝的appid
	getTaoBaoAppid() {
		return uni.getStorageSync("taobaoAppid")
	},
	//淘宝的Secret
	getTaoBaoSecret() {
		return uni.getStorageSync("taobaoSecret")
	},
	//淘宝h5授权地址
	getTaoBaoRedirect() {
		return uni.getStorageSync("taobaoUrl")
	},
	//好单库接口淘宝名 必须英文的 tb_name
	getTaoBaoName() {
		return uni.getStorageSync("taobaoName")
	},
	//淘宝设置的PID
	getTaoBaoPid() {
		return uni.getStorageSync("taobaoPid")
	},
	//好单库Key
	getTaoBaoKey() {
		return uni.getStorageSync("haodankuKey")
	},
	//全局邀请码
	getInvitation() {
		return uni.getStorageSync("publicRelation")
	},
	//获取拼多多商城地址
	getPingDuoDuo() {
		return uni.getStorageSync("pinduoduo")
	},
	//获取拼多多默认地址
	getPingDuoDuoPid() {
		return uni.getStorageSync("pinduoduopid")
	},
	//京东默认pid
	getJDPid() {
		return uni.getStorageSync("jingdongpid")
	},
	//获取APP下载地址
	getAppDownUrl() {
		return uni.getStorageSync("appurl")
	},
	//全局域名 部分html中需要单独替换 需要修改config中的网络请求域名
	publicYuMing() {
		return 'https://wm.xianmxkj.com'
	},
	publicYuMingTao() {
		return 'https://wm.xianmxkj.com/tao'
	},
	maxMoney() {
		return uni.getStorageSync("maxMoney") ? uni.getStorageSync("maxMoney") : '0.7'
	},
	minMoney() {
		return uni.getStorageSync("minMoney") ? uni.getStorageSync("minMoney") : '0.3'
	},
	invitaionNum() {
		return uni.getStorageSync("invitaionNum")
	},
	teamMoney() {
		return uni.getStorageSync("teamMoney")
	},
	cashMoney() {
		return uni.getStorageSync("cashMoney") ? uni.getStorageSync("cashMoney") : '10'
	},
	threeMoney() {
		return uni.getStorageSync("threeMoney")
	},
	logout() {
		this.remove("token");
		this.remove("userId");
		this.remove("mobile");
		this.remove("openid");
		this.remove("nickName");
		this.remove("relation");
		this.remove("image_url");
		this.remove("relation_id");
	},
	loginClear() {
		this.remove("token");
		this.remove("userId");
		this.remove("mobile");
		this.remove("nickName");
		this.remove("image_url");
		this.remove("relation_id");
	},
	showLoading(title) {
		uni.showLoading({
			title: title
		});
	},
	showToast(title) {
		uni.showToast({
			title: title,
			mask: false,
			duration: 2000,
			icon: "none"
		});
	},
	getSearchKeys: function(key) {

		let list = uni.getStorageSync("searchKeys");
		let keys = key.replace(/\s*/g, "")
		return list.indexOf(keys);
	},
	setJson: function(key, value) {
		let jsonString = JSON.stringify(value);
		try {
			uni.setStorageSync(key, jsonString);
		} catch (e) {
			// error
		}
	},
	setData: function(key, value) {
		try {
			uni.setStorageSync(key, value);
		} catch (e) {
			// error
		}
	},
	getData: function(key) {
		try {
			const value = uni.getStorageSync(key);
			if (value) {
				return value;
			}
		} catch (e) {
			// error
		}

	},
	getJson: function(key) {
		try {
			const value = uni.getStorageSync(key);
			if (value) {
				return JSON.parse(value);
			}
		} catch (e) {
			// error
		}

	},
	clear: function() {
		uni.clearStorage();
	},
	get: function(key) { //获取队列里面全部的数据
		let data = this.getJson(key);
		if (data instanceof Array) {
			return data;
		}
		return [];
	},
	insert: function(param) { //队列插入数据
		param.capacityNum = param.capacityNum || 100; //队列容量 默认队列中超过100条数据，自动删除尾部
		let data = this.getJson(param.key);
		if (data instanceof Array) {
			if (data.length > param.capacityNum) {
				let total = data.length - param.capacityNum;
				for (let i = 0; i < total; i++) {
					data.pop();
				}
			}
			data.unshift(param.value);
		} else {
			data = [];
			data.push(param.value);
		}
		this.setJson(param.key, data);
	},
	removeItem: function(key, itemIds) { //提供itemIds数组 批量删除队列中的某项数据
		let data = this.getJson(key);
		if (data instanceof Array) {
			for (let i = 0; i < itemIds.length; i++) {
				for (let p = 0; p < data.length; p++) {
					if (itemIds[i] === data[p].itemid) {
						data.splice(p, 1);
						break;
					}
				}
			}
			this.setJson(key, data);
		}
	},
	removeItemId: function(key, itemIds) { //提供itemIds数组 批量删除队列中的某项数据
		let data = this.getJson(key);
		if (data instanceof Array) {
			for (let i = 0; i < itemIds.length; i++) {
				for (let p = 0; p < data.length; p++) {
					if (itemIds[i] === data[p].id) {
						data.splice(p, 1);
						break;
					}
				}
			}
			this.setJson(key, data);
		}
	},
	isExist: function(key, itemId) { //检测某条数据在队列中是否存在
		let data = this.getJson(key);
		if (data instanceof Array) {
			for (let p = 0; p < data.length; p++) {
				if (itemId === data[p].itemid) {
					return true;
				}
			}
		}
		return false;
	},
	isExistPdd: function(key, itemId) { //检测某条数据在队列中是否存在
		let data = this.getJson(key);
		if (data instanceof Array) {
			for (let p = 0; p < data.length; p++) {
				if (itemId === data[p].goodsId) {
					return true;
				}
			}
		}
		return false;
	},
	isExistJd: function(key, itemId) { //检测某条数据在队列中是否存在
		let data = this.getJson(key);
		if (data instanceof Array) {
			for (let p = 0; p < data.length; p++) {
				if (itemId === data[p].skuId) {
					return true;
				}
			}
		}
		return false;
	},
	isExistZy: function(key, itemId) { //检测某条数据在队列中是否存在
		let data = this.getJson(key);
		if (data instanceof Array) {
			for (let p = 0; p < data.length; p++) {
				if (itemId === data[p].id) {
					return true;
				}
			}
		}
		return false;
	},
	remove: function(key) { //删除某条队列
		try {
			uni.removeStorageSync(key);
			//localStorage.removeItem(key)
		} catch (e) {
			// error
		}
	},
	getCount: function(key) { //获取队列中全部数据数量

		let data = this.getJson(key);
		if (data instanceof Array) {
			return data.length;
		}
		return 0;
	},
	// 文字换行
	drawtext: function(text, maxWidth) {
		let textArr = text.split("");
		let len = textArr.length;
		// 上个节点
		let previousNode = 0;
		// 记录节点宽度
		let nodeWidth = 0;
		// 文本换行数组
		let rowText = [];
		// 如果是字母，侧保存长度
		let letterWidth = 0;
		// 汉字宽度
		let chineseWidth = 21;
		// otherFont宽度
		let otherWidth = 10.5;
		for (let i = 0; i < len; i++) {
			if (/[\u4e00-\u9fa5]|[\uFE30-\uFFA0]/g.test(textArr[i])) {
				if (letterWidth > 0) {
					if (nodeWidth + chineseWidth + letterWidth * otherWidth > maxWidth) {
						rowText.push({
							type: "text",
							content: text.substring(previousNode, i)
						});
						previousNode = i;
						nodeWidth = chineseWidth;
						letterWidth = 0;
					} else {
						nodeWidth += chineseWidth + letterWidth * otherWidth;
						letterWidth = 0;
					}
				} else {
					if (nodeWidth + chineseWidth > maxWidth) {
						rowText.push({
							type: "text",
							content: text.substring(previousNode, i)
						});
						previousNode = i;
						nodeWidth = chineseWidth;
					} else {
						nodeWidth += chineseWidth;
					}
				}
			} else {
				if (/\n/g.test(textArr[i])) {
					rowText.push({
						type: "break",
						content: text.substring(previousNode, i)
					});
					previousNode = i + 1;
					nodeWidth = 0;
					letterWidth = 0;
				} else if (textArr[i] == "\\" && textArr[i + 1] == "n") {
					rowText.push({
						type: "break",
						content: text.substring(previousNode, i)
					});
					previousNode = i + 2;
					nodeWidth = 0;
					letterWidth = 0;
				} else if (/[a-zA-Z0-9]/g.test(textArr[i])) {
					letterWidth += 1;
					if (nodeWidth + letterWidth * otherWidth > maxWidth) {
						rowText.push({
							type: "text",
							content: text.substring(previousNode, i + 1 - letterWidth)
						});
						previousNode = i + 1 - letterWidth;
						nodeWidth = letterWidth * otherWidth;
						letterWidth = 0;
					}
				} else {
					if (nodeWidth + otherWidth > maxWidth) {
						rowText.push({
							type: "text",
							content: text.substring(previousNode, i)
						});
						previousNode = i;
						nodeWidth = otherWidth;
					} else {
						nodeWidth += otherWidth;
					}
				}
			}
		}
		if (previousNode < len) {
			rowText.push({
				type: "text",
				content: text.substring(previousNode, len)
			});
		}
		return rowText;
	},
};
