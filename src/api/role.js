import axios from 'axios';
import { useUserStore } from '../stores/userStore';

const API_URL = 'http://121.41.107.127:8088/role';

// 移除角色
export const removeUserRole = async (userId,roleId) =>{
    try {
        const response = await axios.post(`${API_URL}/removeRole`, null, { params: { userId, roleId } });
        return response.data
    }catch (e){
        console.log('解雇失败',e)
    }
}

// 任命角色
export const assigUserRole = async (userId,roleId) =>{
    try {
        const response = await axios.post(`${API_URL}/assignRole`, null, { params: { userId, roleId } });
        return response.data
    }catch (e){
        console.log('任命失败',e)
    }
}

// 获取除了管理员之外的所有职务
export const getRoles = async() =>{
    try {
        const response = await axios.get(`${API_URL}/getRolesExceptAdmin`);
        console.log('获取到的数据:', response.data);
        return response.data

    } catch (error) {
        console.error('获取失败:', error);
    }
}

// 获取所有用户信息
export const getAllUsers = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/getRoleInfo`, { params: { userId: userId } });
        console.log('获取到的用户信息',response)
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        return null;
    }
};

// 发送冻结用户的请求
export const freezeUser = async (userId) => {
    try {
        const response = await axios.post(`${API_URL}/freezeUser`, null, { params: { userId: userId } });
        console.log('用户冻结成功', response);
        return response.data;
    } catch (error) {
        console.error('用户冻结失败:', error);
        return null;
    }
};

// 发送解冻用户请求
export const unfreezeUser = async (userId) => {
    try {
        const response = await axios.post(`${API_URL}/unfreezeUser`, null, { params: { userId: userId } });
        console.log('用户解冻成功', response);
        return response.data;
    } catch (error) {
        console.error('用户解冻失败:', error);
        return null;
    }
};