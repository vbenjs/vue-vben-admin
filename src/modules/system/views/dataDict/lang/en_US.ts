export default {
  trans: true,
  key: 'system.views',
  data: {
    dictGroup: {
      title: {
        dictCode: 'Dict code',
        dictName: 'Dict name',
      },
      validate: {
        dictCode: 'Please enter dict code',
        dictName: 'Please enter dict name',
      },
    },
    dictItem: {
      title: {
        dictCode: 'Dict code',
        dictItemCode: 'Dict item code',
        dictItemName: 'Dict item name',
      },
      validate: {
        dictCode: 'Please enter dict code',
        dictItemCode: 'Please enter dict item code',
        dictItemName: 'Please enter dict item name',
      },
      rules: {
        dictItemCode_NOT_EMPTY: 'Dict item code cannot be empty',
        dictItemName_NOT_EMPTY: 'Dict item name cannot be empty',
      },
      message: {
        dictCodeNull: 'Please select a dict first',
      },
    },
  },
};
