import { get, blobGet } from '../utils/ajax';
export const queryToken = (params: any) =>
  get('https://apigateway.gaodun.com/luffy/api/v1/wechatDev/accessToken', params);
export const queryWechatLists = (params: any) =>
  get('https://apigateway.gaodun.com/luffy/api/v1/wechat/lists', params);
export const queryLatestAuditstatus = (params: any) =>
  get('https://api.weixin.qq.com/wxa/get_latest_auditstatus', params);
export const queryQrcode = (params: any) =>
  blobGet('https://api.weixin.qq.com/wxa/get_qrcode', params);
export const queryUndocodeaudit = (params: any) =>
    get('https://api.weixin.qq.com/wxa/undocodeaudit', params);

