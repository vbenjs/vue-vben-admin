import store from '/@/store';

import { VuexModule, getModule, Module, Mutation, Action } from 'vuex-module-decorators';

import { LOCALE_KEY } from '/@/enums/cacheEnum';

import { hotModuleUnregisterModule } from '/@/utils/helper/vuexHelper';
import { LocaleSetting, LocaleType } from '/#/config';
import { createLocalStorage } from '/@/utils/cache';
import { localeSetting } from '/@/settings/localeSetting';

const ls = createLocalStorage();

const lsSetting = (ls.get(LOCALE_KEY) || localeSetting) as LocaleSetting;

const NAME = 'app-locale';
hotModuleUnregisterModule(NAME);
@Module({ dynamic: true, namespaced: true, store, name: NAME })
class Locale extends VuexModule {
  private info: LocaleSetting = lsSetting;

  get getShowPicker(): boolean {
    return !!this.info?.showPicker;
  }

  get getLocale(): LocaleType {
    return this.info?.locale;
  }

  @Mutation
  setLocaleInfo(info: Partial<LocaleSetting>): void {
    this.info = { ...this.info, ...info };
    ls.set(LOCALE_KEY, this.info);
  }

  @Action
  initLocale(): void {
    this.setLocaleInfo({
      ...localeSetting,
      ...this.info,
    });
  }
}
export const localeStore = getModule<Locale>(Locale);
