import { Crisp } from 'crisp-sdk-web';

export const initCrisp = () => {
  Crisp.configure(import.meta.env.VITE_GLOB_CRISP_WEBSITE_ID);
};

export const setCrispUserInfo = (userInfo: any) => {
  Crisp.setTokenId(userInfo.uuid);
  Crisp.session.reset();

  Crisp.session.setData({
    plan: userInfo.charge_name,
    shopify_domain: userInfo.myshopify_domain,
  });

  Crisp.user.setNickname(userInfo.realName);
  Crisp.user.setEmail(userInfo.email);
};

export const CrispOpenWithText = (obj: any) => {
  Crisp.chat.open();
  Crisp.message.send('text', obj);
};
