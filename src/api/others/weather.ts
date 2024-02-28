import axios from "axios";

const config = {
  key: "4d37af27440b4bc1bea0b711473dc575",
  city: "pinghu",
  adm: "jiaxing",
  location: "101210305",
};
export interface WeatcherNow {
  obsTime: string; //数据观测时间
  temp: string; //温度，默认单位：摄氏度
  feelsLike: string; //体感温度，默认单位：摄氏度
  icon: string; //天气状况和图标的代码，图标可通过天气状况和图标下载
  text: string; //天气状况的文字描述，包括阴晴雨雪等天气状态的描述
  wind360: string; //风向360角度
  windDir: string; //风向
  windScale: string; //风力等级
  windSpeed: string; //风速，公里/小时
  humidity: string; //相对湿度，百分比数值
  precip: string; //当前小时累计降水量，默认单位：毫米
  pressure: string; //大气压强，默认单位：百帕
  vis: string; //能见度，默认单位：公里
  cloud: string; //云量，百分比数值。可能为空
  dew: string; //露点温度。可能为空
}

export interface WeatcherDay {
  tempRange: string;
  text: string;
}
export interface Weatcher {
  weatcherNow: WeatcherNow;
  weatcherDay: WeatcherDay;
  ganmao: string;
}

export function getLocationId() {
  return new Promise<string>((resolve, reject) => {
    axios
      .get(
        `https://geoapi.qweather.com/v2/city/lookup?location=${config.city}&adm=${config.adm}&key=${config.key}`
      )
      .then((res) => {
        resolve(res.data?.location[0]?.id);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

export function getWeatherIndex(location: string) {
  return new Promise<string>((resolve, reject) => {
    axios
      .get(
        `https://devapi.qweather.com/v7/indices/1d?type=9&location=${location}&key=${config.key}`
      )
      .then((res) => {
        resolve(res.data?.daily[0]?.text);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

export function getWeatherDay(location: string) {
  return new Promise<WeatcherDay>((resolve, reject) => {
    axios
      .get(
        `https://devapi.qweather.com/v7/weather/3d?location=${location}&key=${config.key}`
      )
      .then((res) => {
        const { tempMax, tempMin, textDay, textNight } =
          res.data?.daily[0] || {};
        const text =
          textDay === textNight ? textNight : textDay + " 到 " + textNight;
        const tempRange = tempMin + "℃-" + tempMax + "℃";
        resolve({ tempRange, text });
      })
      .catch(function (error) {
        reject(error);
      });
  });
}
export function getWeatherNow(location: string) {
  return new Promise<WeatcherNow>((resolve, reject) => {
    axios
      .get(
        `https://devapi.qweather.com/v7/weather/now?location=${location}&key=${config.key}`
      )
      .then((res) => {
        resolve(res.data?.now);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

export async function getWeather(): Promise<Weatcher> {
  const location = config.location ?? (await getLocationId());
  const ganmao = await getWeatherIndex(location);
  const weatcherDay = await getWeatherDay(location);
  const weatcherNow = await getWeatherNow(location);
  return { weatcherNow, weatcherDay, ganmao };
}
