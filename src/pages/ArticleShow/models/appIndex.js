import { queryArticleList,queryUserInfo,queryArticle ,postComment,replyList} from '@/services/api';

export default {
  namespace: 'appIndex',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    article:{}
  },

  effects: {
    //分页查询文章
    *fetchList({payload,callback}, { call, put }) {
      const response = yield call(queryArticleList,payload);
      yield put({
        type: 'save',
        payload: response//Array.isArray(response) ? response : [],
      });
      if (callback) callback(response);
    },
    //查询文章
    *fetchArticle({payload,callback}, { call, put }) {
      const response = yield call(queryArticle,payload);
      yield put({
        type: 'saveArticle',
        payload: response
      });
      if (callback) callback(response);
    },
    //用户发表评论
    *fetchPostComment({payload,callback}, { call, put }) {
      const response = yield call(postComment,payload);
      if (callback) callback(response);
    },
    // 评论列表
    *fetchReply({payload,callback}, { call, put }) {
      const response = yield call(replyList,payload);
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
    saveArticle(state, action) {
      return {
        ...state,
        article: action.payload,
      };
    },
  },
};
