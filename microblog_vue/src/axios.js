// 前置拦截和后置拦截
import axios from 'axios'
import ElementUI from 'element-ui'
import router from './router'
import store from './store'

axios.defaults.baseURL = "http://localhost:8083"

// 前置拦截
axios.interceptors.request.use(config => {
    return config
})

// 后置拦截
axios.interceptors.response.use(response => {
    let res = response.data;
    if (res.code === 200) {
        return response
    } else {
        ElementUI.Message.error('错误请求', {duration: 2*1000})
        return Promise.reject(response.data.msg)

    }
},
    error => {
        console.log(error)
        if (error.response.data) {
            error.message = error.response.data.msg
        }

        if (error.response.status === 401) {
            ElementUI.Message.error(error.message, {duration: 2*1000})
            store.commit("REMOVE_INFO")
            router.push("/login")
        }
        // ElementUI.Message.error(error.message, {duration: 2*1000})
        return Promise.reject(error)

    }

)


