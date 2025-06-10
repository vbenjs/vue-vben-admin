import { Crisp } from 'crisp-sdk-web';

export const initCrisp = () => {
  Crisp.configure(import.meta.env.VITE_GLOB_CRISP_WEBSITE_ID);
};

export const setCrispShopInfo = (shopInfo: any) => {
  Crisp.setTokenId(shopInfo.uuid);
  Crisp.session.reset();
  Crisp.session.setData({
    plan: shopInfo.charge_name,
    shopify_domain: shopInfo.myshopify_domain,
  });
  Crisp.user.setNickname(shopInfo.realName);
  Crisp.user.setEmail(shopInfo.email);
};

export const CrispOpenWithText = (obj: any) => {
  Crisp.chat.open();
  Crisp.message.send('text', obj);
};
