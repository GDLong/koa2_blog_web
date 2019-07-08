import { queryArticleList,queryRule, removeRule, addRule, updateRule,insertArticle,updateArticle,removeArticle } from '@/services/api';

export default {
  namespace: 'article',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    //分页查询文章
    *fetchList({payload}, { call, put }) {
      const response = yield call(queryArticleList,payload);
      yield put({
        type: 'save',
        payload: response//Array.isArray(response) ? response : [],
      });
      if (callback) callback(response);
    },

    // 新增文章
    *fetchInsert({payload, callback }, { call, put }) {
      const response = yield call(insertArticle,payload);
      if (callback) callback(response);
    },
    // 编辑文章
    *fetchUpdate({payload, callback }, { call, put }) {
      const response = yield call(updateArticle,payload);
      if (callback) callback(response);
    },
    // 删除文章
    *fetchRemove({ payload, callback }, { call, put }) {
      const response = yield call(removeArticle, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
