import { getCiList, createCi, updateCi, getCiDetail, deleteCi } from "../api/ci";
export default {
	namespaced: true,
	state: {
		ciList: [],
		pagination: {
			pageSize: 5,
			pageNo: 1,
			total: 0
		},
		currentCiDetail: {}
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
		},
		updateCurrentCiDetail(state, data) {
			state.currentCiDetail = JSON.parse(JSON.stringify(data));
		}
	},
	actions: {
		getList(context, data) {
			getCiList(data).then(res => {
				context.commit('updateCiList', res);
			});
		},
		createCi({ dispatch }, data) {
			createCi(data).then(() => {
				dispatch('getList', {
					type: data.type,
					pagination: {
						pageSize: 5,
						pageNo: 1
					}
				});
			});
		},
		updateCi({ dispatch }, data) {
			updateCi(data).then(() => {
				dispatch('getList', {
					type: data.type,
					pagination: {
						pageSize: 5,
						pageNo: 1
					}
				});
			});
		},
		getCiDetail({ commit }, data){
			getCiDetail(data).then((res) => {
				commit('updateCurrentCiDetail', res)
			});
		},
		deleteCi({ dispatch }, data) {
			const { id, type } = data;
			deleteCi({ id }).then(() => {
				dispatch('getList', {
					type,
					pagination: {
						pageSize: 5,
						pageNo: 1
					}
				});
			});
		}
	}
};
  