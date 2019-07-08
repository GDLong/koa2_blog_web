import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    body: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

// export async function fakeAccountLogin(params) {
//   return request('/api/login/account', {
//     method: 'POST',
//     body: params,
//   });
// }

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}

// ==============================================================博客管理后端API=============================================================================================

/*
** 用户部分
** 登录：fakeAccountLogin
** 获取用户信息：queryUserInfo
*/
export async function fakeAccountLogin(params) {
  return request('http://localhost:3000/user/login', {
    method: 'POST',
    body: params,
  });
}
export async function queryUserInfo(params) {
  return request('http://localhost:3000/user/userInfo', {
    method: 'POST',
    body: params,
  });
}
/*
** 评论部分
** replyList：评论列表
** postComment：用户评论
 */
export async function replyList(params) {
  return request('http://localhost:3000/reply/list', {
    method: 'POST',
    body: params,
  });
}
export async function postComment(params) {
  return request('http://localhost:3000/reply/comment', {
    method: 'POST',
    body: params,
  });
}

/*
** 文章管理
** 查询文章：queryArticle
** 分页查询文章列表：queryArticleList
** 新增文章：insertArticle
** 编辑文章：updateArticle
** 删除文章：removeArticle
 */
export async function queryArticle(params) {
  return request(`http://localhost:3000/article/query/${params}`);
}
export async function queryArticleList(params) {
  return request(`http://localhost:3000/article/list?${stringify(params)}`);
}

export async function insertArticle(params) {
  return request('http://localhost:3000/article/insert', {
    method: 'POST',
    body: params,
  });
}
export async function updateArticle(params) {
  return request('http://localhost:3000/article/update', {
    method: 'POST',
    body: params,
  });
}
export async function removeArticle(params) {
  return request('http://localhost:3000/article/delete', {
    method: 'POST',
    body: params,
  });
}
