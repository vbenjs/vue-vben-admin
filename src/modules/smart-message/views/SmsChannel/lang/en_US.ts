/**
 * 短信通道表 国际化信息
 */
export default {
  trans: true,
  key: 'smart.sms.channel',
  data: {
    title: {
      channelCode: 'Channel code',
      channelName: 'Channel name',
      channelType: 'Channel type',
      isDefault: 'Default',
      channelProperties: 'Properties',
    },
    validate: {
      channelCode: 'Please enter channel code',
      channelName: 'Please enter channel name',
      channelType: 'Please select channel type',
    },
    rules: {},
    search: {
      channelCode: 'Please enter channel code',
      channelName: 'Please enter channel name',
      channelType: 'Please select channel type',
    },
    button: {
      setDefault: 'Set default',
    },
    message: {
      setDefault:
        'There can only be one default channel. Are you sure you want to set it as the default?',
      setDefaultSuccess: 'Set default successfully',
    },
  },
};
