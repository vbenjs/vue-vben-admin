/**
 * mock service middleware, modified from umijs
 */
const { existsSync } = require('fs');
const { join } = require('path');
const bodyParser = require('body-parser');
const glob = require('glob');
const assert = require('assert');
const chokidar = require('chokidar');
const pathToRegexp = require('path-to-regexp');
const chalk = require('chalk');

const VALID_METHODS = ['get', 'post', 'put', 'patch', 'delete'];
const BODY_PARSED_METHODS = ['post', 'put', 'patch'];

/**
 * mockPath: mock目录地址
 * configPath: mock导入文件配置,如果没有则会遍历mockPath地址进行获取
 * ignoreFiles: 遍历地址时候忽略的文件
 * ignoreStartsWith: 遍历地址的时候忽略以什么开头的文件
 *  handleWrap 包装返回结果函数
 */
module.exports = function createMockMiddleware({
  mockPath = 'mock',
  configPath = 'mock.config.js',
  ignoreFiles = [],
  ignoreStartsWith = '_',
  handleWrap = null,
} = {}) {
  const cwd = process.cwd();
  const absMockPath = join(cwd, mockPath);
  const absConfigPath = join(cwd, configPath);

  require('@babel/register');
  let mockData = getConfig();

  watch();

  function watch() {
    if (process.env.WATCH_FILES === 'none') return;
    const watcher = chokidar.watch([absConfigPath, absMockPath], {
      ignoreInitial: true,
    });
    watcher.on('all', (event, file) => {
      console.log(chalk.green(`mock file ${event}.`));
      // console.log(chalk.green(`mock file ${event}, reload mock data${file}`));
      // console.log(`file: ${file}`);
      mockData = getConfig();
    });
  }

  function getConfig() {
    cleanRequireCache();
    let ret = null;
    if (existsSync(absConfigPath)) {
      // console.log(chalk.blue(`load mock data from ${absConfigPath}`));
      ret = require(absConfigPath);
    } else {
      // 如果没有mock文件夹,则读取配置文件内所有文件
      const mockFiles = glob
        .sync('**/*.js', {
          cwd: absMockPath,
          ignore: ignoreFiles,
        })
        .filter((mf) => !mf.startsWith(ignoreStartsWith));
      //   including files ${JSON.stringify(
      //     mockFiles
      //   )}
      // console.log(chalk.blue(`load mock data from ${absMockPath}`));
      try {
        ret = mockFiles.reduce((memo, mockFile) => {
          const mod = require(join(absMockPath, mockFile));
          memo = {
            ...memo,
            ...mod.default,
          };
          return memo;
        }, {});
      } catch (error) {
        ret = {};
        console.log(`${chalk.red('mock reload error!')}`);
      }
    }

    return normalizeConfig(ret);
  }
  function randomFrom(lowerValue, upperValue) {
    return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);
  }
  function parseKey(key) {
    const len = key.length - key.replace(/\s/g, '').length;
    let method = 'get';
    let path = key;
    let timeout = 0;
    if (len > 0) {
      const splitEd = key.split(' ');
      method = splitEd[0].toLowerCase();
      path = splitEd[1];
      if (len === 2) {
        timeout = splitEd[2];
      }
    }

    assert(
      VALID_METHODS.includes(method),
      `Invalid method ${method} for path ${path}, please check your mock files.`
    );
    return {
      method,
      path,
      timeout,
    };
  }

  function createHandler(method, path, handler, timeout) {
    return function (req, res, next) {
      if (BODY_PARSED_METHODS.includes(method)) {
        bodyParser.json({ limit: '5mb', strict: false })(req, res, () => {
          bodyParser.urlencoded({ limit: '5mb', extended: true })(req, res, () => {
            sendData(req);
          });
        });
      } else {
        sendData();
      }

      async function sendData(iReq) {
        try {
          if (timeout) {
            await sleep(timeout);
          }
          if (typeof handler === 'function') {
            const { body = {}, query = {} } = iReq || req || {};
            res.json(
              handler({
                body,
                method,
                query,
              })
            );
          } else {
            res.json(handler);
          }
        } catch (error) {
          console.log(
            chalk.red('mock handle error: 处理您的函数时候出现了错误,请检查你的mock函数!')
          );
          res.json({});
        }
      }
    };
  }
  function sleep(time) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }
  function normalizeConfig(config) {
    return Object.keys(config).reduce((memo, key) => {
      const handler = config[key];
      const type = typeof handler;
      assert(
        type === 'function' || type === 'object',
        `mock value of ${key} should be function or object, but got ${type}`
      );
      let { method, path, timeout } = parseKey(key);
      if (timeout && timeout.indexOf('-')) {
        let [a, b] = timeout.split('-');
        if (a > b) {
          [b, a] = [a, b];
        }
        timeout = randomFrom(~~a, ~~b);
      }
      const keys = [];
      const re = pathToRegexp(path, keys);
      memo.push({
        method,
        path,
        re,
        keys,
        handler: createHandler(method, path, handler, timeout),
      });
      return memo;
    }, []);
  }

  function cleanRequireCache() {
    Object.keys(require.cache).forEach((file) => {
      if (file === absConfigPath || file.indexOf(absMockPath) > -1) {
        delete require.cache[file];
      }
    });
  }

  /**
   * 请求是否匹配
   * @param {*} req
   */
  function matchMock(req) {
    const { path: exceptPath } = req;
    const exceptMethod = req.method.toLowerCase();
    for (const mock of mockData) {
      const { method, re, keys } = mock;
      if (method === exceptMethod) {
        const match = re.exec(req.path);
        if (match) {
          const params = {};

          for (let i = 1; i < match.length; i = i + 1) {
            const key = keys[i - 1];
            const prop = key.name;
            const val = decodeParam(match[i]);

            if (val !== undefined || !hasOwnProperty.call(params, prop)) {
              params[prop] = val;
            }
          }
          req.params = params;
          return mock;
        }
      }
    }

    function decodeParam(val) {
      if (typeof val !== 'string' || val.length === 0) {
        return val;
      }

      try {
        return decodeURIComponent(val);
      } catch (err) {
        if (err instanceof URIError) {
          err.message = `Failed to decode param ' ${val} '`;
          err.status = err.statusCode = 400;
        }

        throw err;
      }
    }

    return mockData.filter(({ method, re }) => {
      return method === exceptMethod && re.test(exceptPath);
    })[0];
  }

  return (req, res, next) => {
    const match = matchMock(req);
    if (match) {
      console.log(
        `${chalk.yellow('mock matched:')} ${chalk.green.bold(
          match.method.toUpperCase()
        )} ${chalk.blue.bold(match.path)}`
      );
      const wrapIsFunc = typeof handleWrap === 'function';
      const result = match.handler(req, res, next);
      return wrapIsFunc ? wrapIsFunc(result) : result;
    } else {
      return next();
    }
  };
};
