import * as AuthAPI from '../api/auth';

const TOKEN_KEY = "token";

export const login = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  if (localStorage.getItem(TOKEN_KEY)) {
    return localStorage.getItem(TOKEN_KEY);
  }

  return "";
};

export const logout = () => {
  AuthAPI.logout(getToken()).then((res)=>{
    console.log(res)
  })
  localStorage.removeItem("image_url")
  localStorage.removeItem("role")
  localStorage.removeItem("userName")
  localStorage.removeItem("userId")
  localStorage.removeItem("token")
};

export const isLogin = () => {
  if (localStorage.getItem(TOKEN_KEY)) {
    return true;
  }

  return false;
};

export const getRole = () => {
  return localStorage.getItem("role")
};