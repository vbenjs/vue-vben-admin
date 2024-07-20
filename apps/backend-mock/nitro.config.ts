import errorHandler from './error';

export default defineNitroConfig({
  devErrorHandler: errorHandler,
  errorHandler: '~/error',
});
