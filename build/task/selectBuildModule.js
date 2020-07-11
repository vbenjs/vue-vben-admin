const { inquirerPrompt } = require('../utils');

const { getMpaTitles } = require('../getEnvConfig');
async function selectBuildModule(msg = '') {
  const pages = getMpaTitles();
  const keys = Object.keys(pages);
  const prompt = inquirerPrompt({
    type: 'list',
    message: msg,
    name: 'type',
    choices: [
      {
        name: 'All modules',
        value: keys.join(','),
      },
      ...keys.map((key) => {
        return {
          name: pages[key] || '',
          value: key,
        };
      }),
    ],
  });
  const { type } = await prompt;
  return type;
}
module.exports = {
  selectBuildModule,
};
