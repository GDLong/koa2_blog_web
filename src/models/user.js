import { query as queryUsers, queryCurrent} from '@/services/user';
import {queryUserInfo } from '@/services/api';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    userInfo:{}
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    //查询用户信息
    *fetchUserInfo({payload,callback}, { call, put }) {
      const response = yield call(queryUserInfo,payload);
      yield put({
        type: 'saveUserInfo',
        payload: response,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    saveUserInfo(state, action) {
      return {
        ...state,
        userInfo: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
