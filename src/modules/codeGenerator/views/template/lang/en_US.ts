export default {
  generator: {
    views: {
      template: {
        label: {
          templateType: {
            templateCode: 'Code template',
            templateDbDict: 'DB dict template',
          },
        },
        title: {
          userGroup: 'User group',
          templateGroup: 'Template group',
          seq: 'Seq',
        },
        table: {
          name: 'Name',
          templateType: 'Template Type',
          language: 'Language',
          remark: 'Remark',
          filenameSuffix: 'Filename Suffix',
        },
        notice: {
          onlyDeleteMy: 'Only self created templates can be deleted',
          choseGroup: 'Please select a template group first',
        },
        validate: {
          templateType: 'Please enter template type',
          name: 'Please enter name',
          remark: 'Please enter remark',
          seq: 'Please enter seq',
          templateGroup: 'Please enter template group',
        },
      },
    },
  },
};
