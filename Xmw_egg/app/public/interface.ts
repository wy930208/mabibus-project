/*
 * @Description: 参数类型注解，全局统一
 * @Version: 2.0
 * @Author: Cyan
 * @Date: 2022-09-09 14:37:20
 * @LastEditors: Cyan
 * @LastEditTime: 2022-10-10 10:01:35
 */


export type Data<S = any> = {
    [T in keyof S]: S[T]
}

export type resResultModel<S = any> = {
    resCode: number,
    resData: Data<S>,
    resMsg: string
}