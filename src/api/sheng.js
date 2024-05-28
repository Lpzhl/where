// src/api/shgeng.js

import axios from 'axios';

const API_URL = 'http://localhost:8089/shengq';

export const shengq = (applicantId, formData) => {
    return axios.post(`${API_URL}/big`, {
        id:'',
        applicantid: applicantId,
        contactphone: formData.contactPhone,
        identitycardnumber: formData.identityCardNumber,
        applicationimage: formData.applicationImage,
        name:formData.name
    });
};

export const getApplications = () => {
    // 替换为实际的 HTTP 请求
    return axios.get(`${API_URL}/merchantapplications`);
};

export const updateApplicationStatus = (applicationId, status) => {
    // 替换为实际的 HTTP 请求
    return axios.put(`${API_URL}/merchantapplications/${applicationId}/status`, { status });
};
