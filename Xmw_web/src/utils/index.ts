/*
 * @Description: 全局公共方法
 * @Version: 2.0
 * @Author: Cyan
 * @Date: 2022-09-07 16:12:53
 * @LastEditors: Cyan
 * @LastEditTime: 2022-12-13 14:29:20
 */
import { history } from '@umijs/max';
import type { ProColumns } from '@ant-design/pro-components';
import { stringify } from 'querystring';
import type { ResponseModel } from '@/global/interface';
import CryptoJS from 'crypto-js'; // AES/DES加密
import { isNumber, get } from 'lodash';
import routerConfig from '@/utils/routerConfig' // 路由配置

// 保存在 localstorage 的 key
export const CACHE_KEY = 'APP_LOCAL_CACHE_KEY';

const CRYPTO_KEY = CryptoJS.enc.Utf8.parse('ABCDEF0123456789'); //十六位十六进制数作为密钥
const CRYPTO_IV = CryptoJS.enc.Utf8.parse('ABCDEF0123456789'); //十六位十六进制数作为密钥偏移量
/**
 * @description: AES/DES加密
 * @param {string} password
 * @return {*}
 * @author: Cyan
 */
export const encryptionAesPsd = (password: string): string => {
  const encrypted = CryptoJS.AES.encrypt(password, CRYPTO_KEY, {
    iv: CRYPTO_IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString(); //返回的是base64格式的密文
};

/**
 * @description: AES/DES解密
 * @param {string} password
 * @return {*}
 * @author: Cyan
 */
export const decryptionAesPsd = (password: string): string => {
  const decrypted = CryptoJS.AES.decrypt(password, CRYPTO_KEY, {
    iv: CRYPTO_IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8); //返回的是解密后的字符串
};

/**
 * @description: 计算表格滚动长度
 * @return {*}
 * @author: Cyan
 */
export const columnScrollX = (columns: ProColumns[]): number =>
  columns.reduce((acc, item) => {
    return acc + (item.width && isNumber(item.width) ? item.width : 0);
  }, 0);

/**
 * @description: 统一获取接口中的data
 * @return {*}
 * @author: Cyan
 */
export function formatResult<T>(response: ResponseModel<T>): T {
  return get(response, 'data');
}

/**
 * @description: 退出登录返回到登录页
 * @return {*}
 * @author: Cyan
 */
export const logoutToLogin = (): void => {
  const { search, pathname } = window.location;
  const urlParams = new URL(window.location.href).searchParams;
  /** 此方法会跳转到 redirect 参数所在的位置 */
  const redirect = urlParams.get('redirect');
  // 重定向地址
  if (window.location.pathname !== routerConfig.LOGIN && !redirect) {
    history.replace({
      pathname: routerConfig.LOGIN,
      search: stringify({
        redirect: pathname + search,
      }),
    });
  }
}

/**
 * @description: 获取菜单权限集合，用于做菜单鉴权
 * @param {API} routeTree
 * @return {*}
 * @author: Cyan
 */
export const collectionRouteName = (routeTree: API.MENUMANAGEMENT[] | undefined): string[] => {
  if (!routeTree) return []
  const result: string[] = []
  function loopMenu(treeNode: API.MENUMANAGEMENT[]) {
    treeNode.forEach(route => {
      if (route.name) {
        result.push(route.name)
      }
      if (route.routes) {
        loopMenu(route.routes)
      }
    })
  }
  loopMenu(routeTree)
  return result
}

/**
 * @description: 延迟提交，优化用户体验
 * @param {number} time
 * @return {*}
 * @author: Cyan
 */
export const waitTime = (time: number = 100): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

/**
 * @description: 获取当前时间
 * @return {*}
 * @author: Cyan
 */
export const timeFix = (): string => {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '夜深了'
}

/**
 * @description: 随机欢迎语
 * @return {*}
 * @author: Cyan
 */
export const welcomeWords = (): string => {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 LOL', '我猜你可能累了', '认真工作吧']
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}
