import { getCiList, createCi, updateCi, getCiDetail, deleteCi } from "../api/ci";
export default {
	namespaced: true,
	state: {
		ciList: [],
		pagination: {
			pageSize: 5,
			current: 1,
			total: 0
		},
		currentCiDetail: {},
		loading: false,
	},
	getters: {
		getPagination(state) {
			const { pageSize, current } = state.pagination;
			return {
				pageSize,
				pageNo: current
			}
		}
	},
	mutations: {
		updateCiList(state, data) {
			state.ciList = JSON.parse(JSON.stringify(data));
		},
		updatePagination(state, data) {
			if (data.hasOwnProperty('pageSize')) state.pagination.pageSize = data.pageSize;
			if (data.hasOwnProperty('current')) state.pagination.current = data.current;
			if (data.hasOwnProperty('total')) state.pagination.total = data.total;
		},
		updateCurrentCiDetail(state, data) {
			state.currentCiDetail = JSON.parse(JSON.stringify(data));
		},
		upadteLoading(state, loading) {
			state.loading = loading;
		}
	},
	actions: {
		getList({ commit }, data) {
			commit('upadteLoading', true);
			getCiList(data).then(res => {
				if (res.hasOwnProperty('data')) commit('updateCiList', res.data);
				if (res.hasOwnProperty('pagination')) commit('updatePagination', res.pagination);
				commit('upadteLoading', false);
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
				commit('updateCurrentCiDetail', res.data)
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
  