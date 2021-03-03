import { getCiList } from "../api/ci";
export default {
	namespaced: true,
	state: {
		ciList: [],
		pagination: {
			pageSize: 5,
			pageNo: 1,
			total: 0
		}
	},
	getters: {
		getPagination(state) {
			const { pageSize, pageNo } = state.pagination;
			return {
				pageSize,
				pageNo
			}
		}
	},
	mutations: {
		updateCiList(state, res) {
			if (res.hasOwnProperty('data')) {
				state.ciList = JSON.parse(JSON.stringify(res.data));
			}
			if  (res.hasOwnProperty('pagination')) {
				state.pagination = JSON.parse(JSON.stringify(res.pagination));
			}
		},
		updatePagination(state, data) {
			if (data.hasOwnProperty('pageSize')) state.pagination.pageSize = data.pageSize;
			if (data.hasOwnProperty('current')) state.pagination.pageNo = data.current;
		}
	},
	actions: {
		getList(context, data) {
			console.log(data)
			getCiList(data).then(res => {
				console.log(res)
				context.commit('updateCiList', res);
			});
		}
	}
};
  