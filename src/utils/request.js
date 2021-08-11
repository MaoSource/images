import { Notify } from 'vant'
import axios from 'axios'
import fingerprint from '@/utils/fingerprint'
// import Cookies from "js-cookie";

// 请求超时时间，10s
const requestTimeOut = 20 * 1000

const success = 200

// 系统全局请求对象
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: requestTimeOut,
  responseType: 'json',
  validateStatus (status) {
    return status === success
  }
})

service.interceptors.request.use(
  async config => {
    // 模拟token
    // 让每个请求携带token-- token为自定义key 请根据实际情况自行修改
    if (localStorage.getItem('username')) {
      config.headers.token = localStorage.getItem('username')
    } else {
      await fingerprint().then(r => {
        config.headers.token = r
      })
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  config => {
    return config
  },
  error => {
    if (axios.isCancel(error)) {
      console.log('Cancelled uploading by user.')
      return Promise.reject(error)
    }
    if (error.response) {
      const errorMessage =
        error.response.data === null
          ? '系统内部异常，请联系网站管理员'
          : error.response.data.message
      switch (error.response.status) {
        case 404:
          Notify({ type: 'danger', message: '很抱歉，资源未找到' })
          break
        case 403:
          Notify({ type: 'danger', message: '很抱歉，您暂无该操作权限' })
          break
        case 401:
          Notify({ type: 'danger', message: '很抱歉，认证已失效，请重新登录' })
          break
        default:
          Notify({ type: 'danger', message: errorMessage })
          break
      }
    }
    return Promise.reject(error)
  }
)

const request = {
  post (url, params) {
    return service.post(url, params, {
      transformRequest: [
        params => {
          return tansParams(params)
        }
      ],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },
  postCookie (url, params) {
    // let cookie = Cookies.get("MUSIC_U");
    const strCookie = document.cookie
    return service.post(url, params, {
      transformRequest: [
        params => {
          return tansParams(params)
        }
      ],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Get-Cookies': strCookie
      }
    })
  },
  putFile (url, params) {
    return service.put(url, params)
  },
  uploads (formData, uploadProgress, cancelToken) {
    return service({
      baseURL: '/img',
      timeout: 86400000, // 24 hours
      data: formData, // form data
      onUploadProgress: uploadProgress,
      cancelToken: cancelToken,
      method: 'put'
    })
  },
  put (url, params) {
    return service.put(url, params, {
      transformRequest: [
        params => {
          return tansParams(params)
        }
      ],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },
  get (url, params) {
    let _params
    if (Object.is(params, undefined)) {
      _params = ''
    } else {
      _params = '?'
      for (const key in params) {
        // eslint-disable-next-line no-prototype-builtins
        if (params.hasOwnProperty(key) && params[key] !== null) {
          _params += `${key}=${params[key]}&`
        }
      }
    }
    return service.get(`${url}${_params}`)
  },
  delete (url, params) {
    let _params
    if (Object.is(params, undefined)) {
      _params = ''
    } else {
      _params = '?'
      for (const key in params) {
        // eslint-disable-next-line no-prototype-builtins
        if (params.hasOwnProperty(key) && params[key] !== null) {
          _params += `${key}=${params[key]}&`
        }
      }
    }
    return service.delete(`${url}${_params}`)
  },
  upload (url, params) {
    return service.post(url, params, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

function tansParams (params) {
  let result = ''
  Object.keys(params).forEach(key => {
    if (!Object.is(params[key], undefined) && !Object.is(params[key], null)) {
      result +=
        encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&'
    }
  })
  return result
}

export default request
