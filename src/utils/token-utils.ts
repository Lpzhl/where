//src/utils/token-utils.ts
const TokenKey = 'vue_admin_template_token'

//获取token
export function getToken() {
  return localStorage.getItem(TokenKey)
}

//设置token
export function setToken(token: string) {
  localStorage.setItem(TokenKey, token)
}

//移除token
export function removeToken() {
  localStorage.removeItem(TokenKey)
}
