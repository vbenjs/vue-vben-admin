import { bootstrap, useApp } from './app';

if (import.meta.env.PROD) bootstrap();

export default useApp();
