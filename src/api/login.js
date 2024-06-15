// src/api/login.js
import axios from 'axios';
import { useUserStore } from '../stores/userStore';
import {getToken} from "../utils/token-utils";

const API_URL = 'http://localhost:8088/user';
let token = null;



token = getToken()  //获取token
 // 登录
export const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.code === 200) {
        const userStore = useUserStore();
        userStore.setToken(response.data.data.token);
        userStore.setUser(response.data.data.user);
        // 将 token 保存到 localStorage
        localStorage.setItem('token', response.data.data.token);
        return response;
    } else {
        // 登录失败，
        return response;
    }
};

// 获取用户信息
export const getUserInfo = async (token) => {
    console.log('自动登录token：',token)
    // 发送获取用户信息的请求，注意传递token
    const response = await axios.get(`${API_URL}/getUserInfo`, {
        headers: {
            'token': `${token}`
        }
    });
    console.log('token登录的信息：',response)
    return response;
};

// 获取所有用户信息
export const getAllUsers = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/getRoleInfo`, { params: { userId: userId } });
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        return null;
    }
};


// 获取角色权限信息
export const getUserPermissions = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/permissions`, { params: { userId: userId } });
        return response.data;
    } catch (error) {
        console.error('获取角色权限失败:', error);
        return null;
    }
};




// 添加联系人
export const add = async (newContact, userId) => {
    return await axios.post(`${API_URL}/addContact?userId=${userId}`, newContact);
}





// 发送验证码逻辑
export const sendVerificationCode = async (email) => {
    try {
        // 在发送验证码成功后，后端生成Token并返回
        const response = await axios.post(`${API_URL}/sendVerificationCode?email=${email}`);
        token = response.data.data;
        console.log(response)
        console.log('token',token)
        if (response.data.code === 200) {
            // 验证码发送成功
            return response.data;
        } else {
            // 验证码发送失败，处理错误
            alert(response.data.message);
        }
    } catch (error) {
        // 处理请求过程中可能出现的网络或其他错误
        console.error('发送验证码时发生错误:', error);
        alert('验证码发送失败，请稍后再试。');
    }
};

/**
 * 验证验证码是否有效
 * @param username
 * @param email
 * @param password
 * @param verificationCode
 * @returns {Promise<any>}
 */

const verifyVerificationCode = async (code) => {
    try {
        const response = await axios.post(`${API_URL}/verifyCode?code=${code}&token=${token}`);

        if (response.data.code === 200) {
            // 验证码有效，可以继续注册
            return true;
        } else {
            // 验证码无效，无法继续注册
            return response;
        }
    } catch (error) {
        return false;
    }
};

// 注册逻辑
export const register = async (nickname, email, password,code) => {
    console.log('code',code)
    try {
        const isVerified = await verifyVerificationCode(code);

        console.log('isVerified',isVerified)
        if (isVerified) {
            const response = await axios.post(`${API_URL}/register`, {
                nickname,
                email,
                password,
                code,
            });

            if (response.data.code === 200) {
                // 注册成功
                return response.data;
            } else {
                // 注册失败，处理错误
                return response;
            }
        } else {
            // 验证失败，不执行注册操作
            return ;
        }
    } catch (error) {
        // 处理请求过程中可能出现的网络或其他错误
        console.error('注册时发生错误:', error);
    }
};


// 重置密码逻辑
export const resetPassword = async (email, newPassword, verificationCode) => {
    try {
        const isVerified = await verifyVerificationCode(verificationCode);

        if (isVerified) {
            const response = await axios.post(`${API_URL}/resetPassword`, {
                email,
                newPassword,
                verificationCode,
            });

            if (response.data.code === 200) {
                // 密码重置成功
                return response.data;
            } else {
                // 密码重置失败，处理错误
                return response;
            }
        } else {
            // 验证失败，不执行密码重置操作
            return;
        }
    } catch (error) {
        // 处理请求过程中可能出现的网络或其他错误
        console.error('重置密码时发生错误:', error);
    }
};


