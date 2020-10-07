import { Slots } from 'vue';
import TableTitle from './TableTitle.vue';
import { getSlot } from '/@/utils/helper/tsxHelper';
export default (title: any, titleHelpMessage: string | string[], slots: Slots) => {
  return (
    <>
      {getSlot(slots, 'tableTitle') ||
        (title && <TableTitle helpMessage={titleHelpMessage} title={title} />) || (
          <span>&nbsp;</span>
        )}
      {slots.toolbar && <div class="basic-table-toolbar">{getSlot(slots, 'toolbar')}</div>}
    </>
  );
};
