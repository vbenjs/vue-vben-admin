import { setupServer } from 'msw/node';
import { rest } from 'msw';

if (typeof window !== 'undefined') {
  global.window.resizeTo = (width, height) => {
    global.window.innerWidth = width || global.window.innerWidth;
    global.window.innerHeight = height || global.window.innerHeight;
    global.window.dispatchEvent(new Event('resize'));
  };
  global.window.scrollTo = () => {};
  if (!window.matchMedia) {
    Object.defineProperty(global.window, 'matchMedia', {
      value: vi.fn((query) => ({
        matches: query.includes('max-width'),
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    });
  }
}

const loginSuccessObj = {
  code: 0,
  result: {
    roles: [{ roleName: 'Super Admin', value: 'super' }],
    userId: '1',
    username: 'vben',
    token: 'fakeToken1',
    realName: 'Vben Admin',
    desc: 'manager',
  },
  message: 'ok',
  type: 'success',
};

const loginFailedRes = {
  code: -1,
  result: null,
  message: 'Incorrect account or password！',
  type: 'error',
};

export const SPECIFIED_HOME_PATH = '/dashboard/analysis';

const userInfoRes = {
  code: 0,
  result: {
    userId: '1',
    username: 'vben',
    realName: 'Vben Admin',
    avatar: 'https://q1.qlogo.cn/g?b=qq&nk=190848757&s=640',
    desc: 'manager',
    password: '123456',
    token: 'fakeToken1',
    homePath: SPECIFIED_HOME_PATH,
    roles: [{ roleName: 'Super Admin', value: 'super' }],
  },
  message: 'ok',
  type: 'success',
};

const handlers = [
  rest.post('/basic-api/login', (req, res, ctx) => {
    const body: Record<string, any> = req.body as Record<string, any>;
    if (body.username !== 'vben' && body.password !== '123456') {
      return res(ctx.status(200), ctx.json(loginFailedRes));
    } else {
      return res(ctx.status(200), ctx.json(loginSuccessObj));
    }
  }),
  rest.get('/basic-api/getUserInfo', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(userInfoRes));
  }),
];
const server = setupServer(...handlers);
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
