import { withInstall } from '@/utils';
import cardList from './src/CardList.vue';
import MoreActionVue from './src/components/MoreAction.vue';

export const CardList = withInstall(cardList);
export const MoreAction = withInstall(MoreActionVue);
