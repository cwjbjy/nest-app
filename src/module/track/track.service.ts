import { Injectable } from '@nestjs/common';
import query from 'src/core/lib/mysql';

@Injectable()
export class TrackService {
  //数据埋点上报
  async track(params) {
    const values = params.map((item) => [
      item.userData.vs,
      item.device.browser,
      item.url,
      item.referrer,
      item.date,
      item.duration,
    ]);
    await query(
      'INSERT INTO TRACK (vsManage,deviceType,currentUrl,refererUrl,userTime,delayTime) VALUES ?',
      [values],
    );
    return;
  }

  //数据埋点上报（旧版）
  async trackweb(params) {
    const { browserType: deviceType, appName: vs } = params.baseInfo;
    const { url, referer, triggerTime: localTime, delay } = params.eventInfo[0];
    await query(
      'INSERT INTO VUEUSER (vsManage,deviceType,currentUrl,refererUrl,userTime,delayTime) VALUES (?,?,?,?,?,?);',
      [vs, deviceType, url, referer, localTime, delay],
    );
    return;
  }
}
