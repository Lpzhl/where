import { defineStore } from 'pinia'
import { ref } from 'vue'

// 用户模块  token setToken removeToken

export const useUserStore = defineStore(
  'big-user',
  () => {
    const token = ref('')
    const userId = ref('0')
    const email = ref('')
    const name = ref('')
    const pic = ref('')

    const setToken = (newValue) => {
      token.value = newValue
    }

    const removeToken = () => {
      token.value = ''
    }

    const updateUserInfo = (newUserInfo) => {
      if (newUserInfo.userId !== undefined) {
        userId.value = newUserInfo.userId
      }
      if (newUserInfo.email !== undefined) {
        email.value = newUserInfo.email
      }
      if (newUserInfo.name !== undefined) {
        name.value = newUserInfo.name
      }
      if (newUserInfo.pic !== undefined) {
        pic.value = newUserInfo.pic
      }
    }

    return {
      token,
      userId,
      email,
      name,
      pic,
      setToken,
      removeToken,
      updateUserInfo
    }
  },
  {
    persist: true
  }
)
