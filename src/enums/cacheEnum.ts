import { useSetting } from '@/hooks/core/useSetting';
import { getEnv } from '@/utils/envUtil';

const { globSetting } = useSetting();

const shortNameName = `${globSetting.shortName}__${getEnv()}__`.toUpperCase();

// token key
export const TOKEN_KEY = `${shortNameName}TOKEN`;

// 用户信息key
export const USER_INFO_KEY = `${shortNameName}USER__INFO__`;

// 用户是否登陆
export const USER_IS_LOGIN_KEY = `${shortNameName}USER__IS__LOGIN__KEY__`;

// 角色信息
export const ROLES_KEY = `${shortNameName}ROLES__KEY__`;

// project config key
export const PROJ_CFG_KEY = `${shortNameName}PROJ__CFG__KEY__`;

// lock info
export const LOCK_INFO_KEY = `${shortNameName}LOCK__INFO__KEY__`;

// base global local key
export const BASE_LOCAL_CACHE_KEY = `${shortNameName}LOCAL__CACHE__KEY__`;
// base global session key
export const BASE_SESSION_CACHE_KEY = `${shortNameName}SESSION__CACHE__KEY__`;
