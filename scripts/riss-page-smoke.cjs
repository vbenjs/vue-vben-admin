const { chromium } = require('playwright');

const API_BASE_URL =
  process.env.RISS_SMOKE_API_BASE_URL || 'http://127.0.0.1:5555';
const WEB_BASE_URL =
  process.env.RISS_SMOKE_WEB_BASE_URL || 'http://127.0.0.1:5666';
const SMOKE_USERNAME = process.env.RISS_SMOKE_USERNAME || 'admin';
const SMOKE_PASSWORD = process.env.RISS_SMOKE_PASSWORD || '123456';
const SMOKE_TENANT_ID = Number(process.env.RISS_SMOKE_TENANT_ID || '1');
const SMOKE_FISCAL_YEAR = process.env.RISS_SMOKE_FISCAL_YEAR || '2026';
const TARGET_FILTER = `${process.env.RISS_SMOKE_TARGETS || ''}`
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

async function getJson(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  return { status: response.status, json: text ? JSON.parse(text) : null };
}

function normalizeStorageValue(accessToken) {
  return JSON.stringify({
    accessToken,
    refreshToken: null,
    accessCodes: [],
    isLockScreen: false,
  });
}

const targets = [
  { path: '/sys/user', requiredTexts: ['用户', '查询'] },
  { path: '/sys/role', requiredTexts: ['角色', '查询'] },
  { path: '/sys/menu', requiredTexts: ['菜单', '查询'] },
  { path: '/sys/tenant', requiredTexts: ['租户', '查询'] },
  { path: '/sys/approval/my-todo', requiredTexts: ['我的审批', '流程编号'] },
  { path: '/sys/approval/pending', requiredTexts: ['待审流程', '流程编号'] },
  { path: '/sys/form/todo', requiredTexts: ['待办流程', '流程编号'] },
  { path: '/sys/form/done', requiredTexts: ['已办流程', '流程编号'] },
  { path: '/sys/expense-claim', requiredTexts: ['报销单', '流程状态'] },
  { path: '/sys/contract-receipt', requiredTexts: ['合同收款', '流程状态'] },
  { path: '/sys/research-project', requiredTexts: ['科研项目', '流程状态'] },
  { path: '/sys/research-indicator', requiredTexts: ['科研指标', '流程状态'] },
  {
    path: '/sys/research-scope-adjust',
    requiredTexts: ['范围调剂', '流程状态'],
  },
  { path: '/sys/contract', requiredTexts: ['合同台账', '流程状态'] },
  { path: '/sys/procurement-apply', requiredTexts: ['采购申报', '流程状态'] },
  { path: '/sys/procurement-result', requiredTexts: ['采购结果', '流程状态'] },
  { path: '/sys/bid-notice', requiredTexts: ['招标公告', '流程状态'] },
  { path: '/finance/reimbursement', requiredTexts: ['报销单查询', '单据号'] },
  { path: '/finance/payment', requiredTexts: ['支付单查询', '单据号'] },
  { path: '/finance/voucher', requiredTexts: ['凭证查询', '指标编码'] },
];

async function loginAndCreateContext() {
  const loginResp = await getJson(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: SMOKE_USERNAME,
      password: SMOKE_PASSWORD,
      tenantId: SMOKE_TENANT_ID,
      fiscalYear: SMOKE_FISCAL_YEAR,
    }),
  });

  const token = loginResp.json?.data?.accessToken;
  if (!token) {
    throw new Error(
      `No access token returned from ${API_BASE_URL}/api/auth/login`,
    );
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  await context.addInitScript(
    ([key, value]) => {
      window.localStorage.setItem(key, value);
    },
    ['vben-web-antd-5.6.0-dev-core-access', normalizeStorageValue(token)],
  );

  return { browser, context };
}

function printResult(result) {
  console.log(`PAGE=${result.path}`);
  console.log(`TITLE=${result.title}`);
  console.log(`HAS_ALL_TEXTS=${result.hasAllTexts}`);
  console.log(`REDIRECTED_TO_LOGIN=${result.redirectedToLogin}`);
  console.log(`PAGE_ERRORS=${result.pageErrors.length}`);
  console.log(`CONSOLE_ERRORS=${result.consoleErrors.length}`);
  console.log(`REQUEST_FAILURES=${result.requestFailures.length}`);
  console.log(`RESPONSE_ERRORS=${result.responseErrors.length}`);
  if (result.missingTexts.length > 0)
    console.log(`MISSING_TEXTS=${result.missingTexts.join(' | ')}`);
  if (result.pageErrors.length > 0)
    console.log(`PAGE_ERROR_DETAIL=${result.pageErrors.join(' | ')}`);
  if (result.consoleErrors.length > 0)
    console.log(`CONSOLE_ERROR_DETAIL=${result.consoleErrors.join(' | ')}`);
  if (result.requestFailures.length > 0)
    console.log(`REQUEST_FAILURE_DETAIL=${result.requestFailures.join(' | ')}`);
  if (result.responseErrors.length > 0)
    console.log(`RESPONSE_ERROR_DETAIL=${result.responseErrors.join(' | ')}`);
  console.log(`FAILED=${result.failed}`);
  console.log('---');
}

(async () => {
  const { inspectTarget, inspectTargets } = await import(
    './riss-page-smoke-lib.mjs'
  );
  const selectedTargets =
    TARGET_FILTER.length === 0
      ? targets
      : targets.filter((target) => TARGET_FILTER.includes(target.path));

  if (selectedTargets.length === 0) {
    throw new Error(
      `No smoke targets matched filter: ${TARGET_FILTER.join(', ')}`,
    );
  }

  const { browser, context } = await loginAndCreateContext();

  try {
    const results = await inspectTargets(context, selectedTargets, (page, target) =>
      inspectTarget(page, target, {
        apiBaseUrl: API_BASE_URL,
        webBaseUrl: WEB_BASE_URL,
      }),
    );

    for (const result of results) {
      printResult(result);
    }

    const failedResults = results.filter((item) => item.failed);
    console.log(`SUMMARY_TOTAL=${results.length}`);
    console.log(`SUMMARY_FAILED=${failedResults.length}`);
    if (failedResults.length > 0) {
      console.log(
        `SUMMARY_FAILED_PAGES=${failedResults.map((item) => item.path).join(' | ')}`,
      );
      process.exit(1);
    }
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
