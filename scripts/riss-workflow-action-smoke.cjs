const { chromium } = require('playwright');

const API_BASE_URL =
  process.env.RISS_SMOKE_API_BASE_URL || 'http://127.0.0.1:5555';
const WEB_BASE_URL =
  process.env.RISS_SMOKE_WEB_BASE_URL || 'http://127.0.0.1:5666';
const SMOKE_USERNAME = process.env.RISS_SMOKE_USERNAME || 'admin';
const SMOKE_PASSWORD = process.env.RISS_SMOKE_PASSWORD || '123456';
const SMOKE_APPROVER_USERNAME =
  process.env.RISS_SMOKE_APPROVER_USERNAME || 'testuser';
const SMOKE_APPROVER_PASSWORD =
  process.env.RISS_SMOKE_APPROVER_PASSWORD || '123456';
const SMOKE_TENANT_ID = Number(process.env.RISS_SMOKE_TENANT_ID || '1');
const SMOKE_FISCAL_YEAR = process.env.RISS_SMOKE_FISCAL_YEAR || '2026';
const TARGET_FILTER = `${process.env.RISS_SMOKE_TARGETS || ''}`
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${url} :: ${text}`);
  }
  if (payload?.code !== 0) {
    throw new Error(`API ${url} failed :: ${text}`);
  }
  return payload?.data;
}

function buildAuthHeaders(accessToken) {
  return {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'X-Fiscal-Year': SMOKE_FISCAL_YEAR,
    'X-Tenant-Id': `${SMOKE_TENANT_ID}`,
  };
}

function buildStorageValue(accessToken) {
  return JSON.stringify({
    accessToken,
    refreshToken: null,
    accessCodes: [],
    isLockScreen: false,
  });
}

async function login(username = SMOKE_USERNAME, password = SMOKE_PASSWORD) {
  const data = await requestJson(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      password,
      tenantId: SMOKE_TENANT_ID,
      fiscalYear: SMOKE_FISCAL_YEAR,
    }),
  });
  if (!data?.accessToken) {
    throw new Error('Login did not return accessToken');
  }
  return data.accessToken;
}

function nowSuffix() {
  return `${Date.now()}`.slice(-8);
}

function escapeRegExp(value) {
  return `${value}`.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}

function looseTextPattern(text) {
  return new RegExp(
    `${[...`${text}`].map((char) => escapeRegExp(char)).join(String.raw`\s*`)}`,
    'u',
  );
}

const scenarios = [
  {
    key: 'expense-claim',
    pagePath: '/sys/expense-claim',
    listKeyword: '报销单',
    queryFieldPlaceholder: '报销单号',
    recordText: (suffix) => `SMOKE-BX-${suffix}`,
    flowNoText: (suffix) => `SMOKE-BX-${suffix}`,
    createPayload: (suffix) => ({
      applicant: 'SmokeUser',
      claimAmount: 88.5,
      claimDate: `${SMOKE_FISCAL_YEAR}-03-01`,
      claimNo: `SMOKE-BX-${suffix}`,
      claimType: '日常报销',
      fillerName: 'SmokeUser',
      remark: 'workflow action smoke',
      status: '0',
    }),
    apiPath: '/api/expense-claim',
    statusSubmittedText: '已提交',
    statusWithdrawnText: '未提交',
  },
  {
    key: 'contract',
    pagePath: '/sys/contract',
    listKeyword: '合同台账',
    queryFieldPlaceholder: '合同编号',
    recordText: (suffix) => `SMOKE-HT-${suffix}`,
    flowNoText: (suffix) => `SMOKE-HT-${suffix}`,
    createPayload: (suffix) => ({
      contractAmount: 666.66,
      contractName: `Smoke合同${suffix}`,
      contractNo: `SMOKE-HT-${suffix}`,
      partyAUnit: '甲方单位',
      partyBUnit: '乙方单位',
      projectName: `Smoke项目${suffix}`,
      remark: 'workflow action smoke',
      signDate: `${SMOKE_FISCAL_YEAR}-03-01`,
      status: '0',
    }),
    apiPath: '/api/contract',
    statusSubmittedText: '已提交',
    statusWithdrawnText: '未提交',
  },
  {
    key: 'contract-receipt',
    pagePath: '/sys/contract-receipt',
    listKeyword: '合同收款',
    queryFieldPlaceholder: '收款单号',
    recordText: (suffix) => `SMOKE-SK-${suffix}`,
    flowNoText: (suffix) => `SMOKE-SK-${suffix}`,
    createPayload: (suffix) => ({
      contractAmount: 900,
      contractName: `Smoke收款合同${suffix}`,
      contractNo: `SMOKE-HT-${suffix}`,
      receiptAmount: 300,
      receiptDate: `${SMOKE_FISCAL_YEAR}-03-01`,
      receiptNo: `SMOKE-SK-${suffix}`,
      receiptUnit: 'Smoke单位',
      remark: 'workflow action smoke',
      status: '0',
    }),
    apiPath: '/api/contract-receipt',
    statusSubmittedText: '已提交',
    statusWithdrawnText: '未提交',
  },
  {
    key: 'procurement-apply',
    pagePath: '/sys/procurement-apply',
    listKeyword: '采购申报',
    queryFieldPlaceholder: '申报单号',
    recordText: (suffix) => `SMOKE-CG-${suffix}`,
    flowNoText: (suffix) => `SMOKE-CG-${suffix}`,
    createPayload: (suffix) => ({
      applyDate: `${SMOKE_FISCAL_YEAR}-03-01`,
      applyNo: `SMOKE-CG-${suffix}`,
      operatorName: 'SmokeUser',
      procureAmount: 520,
      procureMethod: '公开招标',
      procureType: '设备采购',
      projectName: `Smoke采购项目${suffix}`,
      remark: 'workflow action smoke',
      status: '0',
      unitName: 'Smoke单位',
    }),
    apiPath: '/api/procurement-apply',
    statusSubmittedText: '流转中',
    statusWithdrawnText: '草稿',
  },
  {
    key: 'procurement-result',
    pagePath: '/sys/procurement-result',
    listKeyword: '采购结果',
    queryFieldPlaceholder: '申报单号',
    recordText: (suffix) => `SMOKE-CGJG-${suffix}`,
    flowNoText: (suffix) => `SMOKE-CGJG-${suffix}`,
    createPayload: (suffix) => ({
      applyNo: `SMOKE-CGJG-${suffix}`,
      creditCode: `91440000${suffix}`,
      inputStatus: '0',
      projectName: `Smoke采购结果项目${suffix}`,
      remark: 'workflow action smoke',
      status: '0',
      winBidAmount: 880,
      winBidSupplier: `Smoke供应商${suffix}`,
    }),
    apiPath: '/api/procurement-result',
    statusSubmittedText: '流转中',
    statusWithdrawnText: '草稿',
  },
  {
    key: 'research-project',
    pagePath: '/sys/research-project',
    listKeyword: '科研项目',
    queryFieldPlaceholder: '项目名称',
    recordText: (suffix) => `Smoke科研项目${suffix}`,
    flowNoText: (suffix) => `SMOKE-RP-${suffix}`,
    createPayload: (suffix) => ({
      applyYear: SMOKE_FISCAL_YEAR,
      projectCode: `SMOKE-RP-${suffix}`,
      projectManager: 'SmokeUser',
      projectName: `Smoke科研项目${suffix}`,
      projectSource: 'Smoke来源',
      projectStatus: '0',
      projectType: '科研课题',
      remark: 'workflow action smoke',
      status: '0',
      totalAmount: 1234,
    }),
    apiPath: '/api/research/project',
    statusSubmittedText: '已提交',
    statusWithdrawnText: '未提交',
  },
  {
    key: 'research-scope-adjust',
    pagePath: '/sys/research-scope-adjust',
    listKeyword: '范围调剂',
    queryFieldPlaceholder: '指标名称',
    recordText: (suffix) => `SMOKE-IND-${suffix}`,
    flowNoText: (_suffix, created) =>
      `research-scope-adjust-${created?.id ?? ''}`,
    createPayload: (suffix) => ({
      inAdjustAmount: 100,
      inScopeName: `调入范围${suffix}`,
      indicatorName: `SMOKE-IND-${suffix}`,
      outAdjustAmount: 100,
      outScopeName: `调出范围${suffix}`,
      remark: 'workflow action smoke',
      status: '0',
    }),
    apiPath: '/api/research/scope-adjust',
    statusSubmittedText: '已提交',
    statusWithdrawnText: '未提交',
  },
  {
    key: 'research-indicator',
    pagePath: '/sys/research-indicator',
    listKeyword: '科研指标',
    queryFieldPlaceholder: '指标名称',
    recordText: (suffix) => `Smoke科研指标${suffix}`,
    flowNoText: (suffix) => `SMOKE-ZB-${suffix}`,
    createPayload: (suffix) => ({
      availableAmount: 1000,
      deptName: 'Smoke部门',
      indicatorAmount: 1000,
      indicatorCode: `SMOKE-ZB-${suffix}`,
      indicatorName: `Smoke科研指标${suffix}`,
      projectName: `Smoke科研项目${suffix}`,
      remark: 'workflow action smoke',
      status: '0',
      usedAmount: 0,
    }),
    apiPath: '/api/research/indicator',
    statusSubmittedText: '流转中',
    statusWithdrawnText: '未提交',
  },
  {
    key: 'bid-notice',
    pagePath: '/sys/bid-notice',
    listKeyword: '招标公告',
    queryFieldPlaceholder: '公告标题',
    recordText: (suffix) => `Smoke公告${suffix}`,
    flowNoText: (_suffix, created) => `bid-notice-${created?.id ?? ''}`,
    createPayload: (suffix) => ({
      bidDeadline: `${SMOKE_FISCAL_YEAR}-03-28`,
      noticeContent: 'workflow action smoke',
      noticeTitle: `Smoke公告${suffix}`,
      projectName: `Smoke招标项目${suffix}`,
      publishDate: `${SMOKE_FISCAL_YEAR}-03-01`,
      remark: 'workflow action smoke',
      status: '0',
    }),
    apiPath: '/api/bid-notice',
    statusSubmittedText: '已提交',
    statusWithdrawnText: '未提交',
  },
];

async function createRecord(accessToken, scenario, suffix) {
  return requestJson(`${API_BASE_URL}${scenario.apiPath}`, {
    method: 'POST',
    headers: buildAuthHeaders(accessToken),
    body: JSON.stringify(scenario.createPayload(suffix)),
  });
}

async function cleanupRecord(accessToken, scenario, id) {
  await requestJson(`${API_BASE_URL}${scenario.apiPath}/${id}`, {
    method: 'DELETE',
    headers: buildAuthHeaders(accessToken),
  });
}

async function fetchHistory(accessToken, scenario, id) {
  return requestJson(`${API_BASE_URL}${scenario.apiPath}/${id}/history`, {
    method: 'GET',
    headers: buildAuthHeaders(accessToken),
  });
}

function assertHistoryActions(history, requiredActions, scenarioKey) {
  const actions = Array.isArray(history)
    ? history
        .map((item) => `${item?.approvalAction || ''}`.trim())
        .filter(Boolean)
    : [];
  for (const action of requiredActions) {
    if (!actions.includes(action)) {
      throw new Error(
        `Scenario ${scenarioKey} history does not include action "${action}". Actual actions: ${actions.join(', ')}`,
      );
    }
  }
}

async function waitForMessage(page, expectedText) {
  const message = page.locator('.ant-message-notice:visible').last();
  try {
    await message.waitFor({ state: 'visible', timeout: 3000 });
    await page.waitForFunction(
      (text) => document.body.innerText.includes(text),
      expectedText,
      { timeout: 3000 },
    );
  } catch {
    await page.waitForTimeout(800);
  }
}

async function fillVisibleInputByPlaceholder(page, placeholder, value) {
  const input = page
    .locator(`input[placeholder="${placeholder}"]:visible`)
    .first();
  await input.waitFor({ state: 'visible', timeout: 15_000 });
  await input.fill(value);
}

async function clickVisibleButton(scope, label) {
  const button = scope
    .locator('button:visible')
    .filter({ hasText: looseTextPattern(label) })
    .first();
  await button.waitFor({ state: 'visible', timeout: 15_000 });
  await button.scrollIntoViewIfNeeded();
  await button.click();
}

function getVisibleModal(scope) {
  return scope.locator('.ant-modal-wrap:visible').last();
}

async function findRow(page, rowText) {
  const row = page
    .locator('.ant-table-tbody tr')
    .filter({ hasText: rowText })
    .first();
  await row.waitFor({ state: 'visible', timeout: 15_000 });
  return row;
}

async function verifyWorkbenchWithdraw(page, flowNoText) {
  await page.goto(`${WEB_BASE_URL}/sys/approval/my-submit`, {
    waitUntil: 'networkidle',
  });
  await page.waitForFunction(
    () => document.body.innerText.includes('我的提交'),
    undefined,
    { timeout: 15_000 },
  );

  await fillVisibleInputByPlaceholder(page, '流程编号', flowNoText);
  await clickVisibleButton(page, '查询');

  const row = await findRow(page, flowNoText);
  await clickVisibleButton(row, '撤销');
  const modal = getVisibleModal(page);
  await modal.waitFor({ state: 'visible', timeout: 10_000 });
  await clickVisibleButton(modal, '确定');
  await waitForMessage(page, '成功');

  try {
    await page.waitForFunction(
      ({ text, status }) => {
        const body = document.body.innerText;
        return body.includes(text) && body.includes(status);
      },
      { text: flowNoText, status: '已撤回' },
      { timeout: 8000 },
    );
  } catch {
    await page.waitForTimeout(800);
  }
}

async function verifyWorkbenchApprove(page, flowNoText) {
  await page.goto(`${WEB_BASE_URL}/sys/approval/my-todo`, {
    waitUntil: 'networkidle',
  });
  await page.waitForFunction(
    () => document.body.innerText.includes('我的审批'),
    undefined,
    { timeout: 15_000 },
  );

  await fillVisibleInputByPlaceholder(page, '流程编号', flowNoText);
  await clickVisibleButton(page, '查询');

  const row = await findRow(page, flowNoText);
  await clickVisibleButton(row, '审核');
  const modal = getVisibleModal(page);
  await modal.waitFor({ state: 'visible', timeout: 10_000 });
  await clickVisibleButton(modal, '确定');
  await waitForMessage(page, '成功');
}

async function verifyWorkbenchPresence(page, path, headingText, flowNoText) {
  await page.goto(`${WEB_BASE_URL}${path}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(
    (heading) => document.body.innerText.includes(heading),
    headingText,
    { timeout: 15_000 },
  );

  await fillVisibleInputByPlaceholder(page, '流程编号', flowNoText);
  await clickVisibleButton(page, '查询');
  await findRow(page, flowNoText);
}

async function runScenario(submitterPage, approverPage, accessToken, scenario) {
  let currentStep = 'initialize';
  const suffix = nowSuffix();
  const rowText = scenario.recordText(suffix);
  currentStep = 'create record';
  const created = await createRecord(accessToken, scenario, suffix);
  const recordId = created?.id;
  const flowNoText = scenario.flowNoText
    ? scenario.flowNoText(suffix, created)
    : rowText;
  if (!recordId) {
    throw new Error(`Scenario ${scenario.key} did not return record id`);
  }

  try {
    currentStep = 'open business page';
    await submitterPage.goto(`${WEB_BASE_URL}${scenario.pagePath}`, {
      waitUntil: 'networkidle',
    });
    currentStep = 'wait business heading';
    await submitterPage.waitForFunction(
      (keyword) => document.body.innerText.includes(keyword),
      scenario.listKeyword,
      { timeout: 15_000 },
    );

    currentStep = 'filter business row';
    await fillVisibleInputByPlaceholder(
      submitterPage,
      scenario.queryFieldPlaceholder,
      rowText,
    );
    await clickVisibleButton(submitterPage, '查询');

    currentStep = 'find business row';
    const row = await findRow(submitterPage, rowText);
    currentStep = 'submit business flow';
    await clickVisibleButton(row, '送审');
    await waitForMessage(submitterPage, '成功');

    currentStep = 'verify submit history api';
    const submitHistory = await fetchHistory(accessToken, scenario, recordId);
    assertHistoryActions(submitHistory, ['submit'], scenario.key);

    currentStep = 'verify business status submitted';
    await submitterPage.waitForFunction(
      ({ text, status }) => {
        const body = document.body.innerText;
        return body.includes(text) && body.includes(status);
      },
      { text: rowText, status: scenario.statusSubmittedText },
      { timeout: 15_000 },
    );

    currentStep = 'open business history modal';
    const submittedRow = await findRow(submitterPage, rowText);
    await clickVisibleButton(submittedRow, '历史');
    const modal = getVisibleModal(submitterPage);
    await modal.waitFor({ state: 'visible', timeout: 10_000 });
    await modal
      .locator('.ant-table-tbody tr')
      .first()
      .waitFor({ state: 'visible', timeout: 10_000 });
    await modal.locator('.ant-modal-close').click();

    currentStep = 'verify approval my-submit presence';
    await verifyWorkbenchPresence(
      submitterPage,
      '/sys/approval/my-submit',
      '我的提交',
      flowNoText,
    );
    currentStep = 'verify form my-submit presence';
    await verifyWorkbenchPresence(
      submitterPage,
      '/sys/form/my-submit',
      '我的提交',
      flowNoText,
    );
    currentStep = 'verify form todo presence';
    await verifyWorkbenchPresence(
      approverPage,
      '/sys/form/todo',
      '待办流程',
      flowNoText,
    );
    currentStep = 'approve from approval my-todo';
    await verifyWorkbenchApprove(approverPage, flowNoText);

    currentStep = 'verify approve history api';
    const approvedHistory = await fetchHistory(accessToken, scenario, recordId);
    assertHistoryActions(approvedHistory, ['submit', 'approve'], scenario.key);

    currentStep = 'withdraw from approval my-submit';
    await verifyWorkbenchWithdraw(submitterPage, flowNoText);

    currentStep = 'verify final history api';
    const finalHistory = await fetchHistory(accessToken, scenario, recordId);
    assertHistoryActions(
      finalHistory,
      ['submit', 'approve', 'withdraw'],
      scenario.key,
    );

    currentStep = 'reopen business page';
    await submitterPage.goto(`${WEB_BASE_URL}${scenario.pagePath}`, {
      waitUntil: 'networkidle',
    });
    currentStep = 'filter final business row';
    await fillVisibleInputByPlaceholder(
      submitterPage,
      scenario.queryFieldPlaceholder,
      rowText,
    );
    await clickVisibleButton(submitterPage, '查询');

    currentStep = 'verify business status withdrawn';
    await submitterPage.waitForFunction(
      ({ text, status }) => {
        const body = document.body.innerText;
        return body.includes(text) && body.includes(status);
      },
      { text: rowText, status: scenario.statusWithdrawnText },
      { timeout: 15_000 },
    );

    return { key: scenario.key, rowText, success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : `${error}`;
    throw new Error(`[${currentStep}] ${message}`);
  } finally {
    await cleanupRecord(accessToken, scenario, recordId);
  }
}

(async () => {
  const selectedScenarios =
    TARGET_FILTER.length === 0
      ? scenarios
      : scenarios.filter((scenario) => TARGET_FILTER.includes(scenario.key));

  if (selectedScenarios.length === 0) {
    throw new Error(
      `No workflow action scenarios matched filter: ${TARGET_FILTER.join(', ')}`,
    );
  }

  const accessToken = await login();
  const approverAccessToken = await login(
    SMOKE_APPROVER_USERNAME,
    SMOKE_APPROVER_PASSWORD,
  );
  const browser = await chromium.launch({ headless: true });
  const submitterContext = await browser.newContext();
  await submitterContext.addInitScript(
    ([key, value]) => {
      window.localStorage.setItem(key, value);
    },
    ['vben-web-antd-5.6.0-dev-core-access', buildStorageValue(accessToken)],
  );
  const approverContext = await browser.newContext();
  await approverContext.addInitScript(
    ([key, value]) => {
      window.localStorage.setItem(key, value);
    },
    [
      'vben-web-antd-5.6.0-dev-core-access',
      buildStorageValue(approverAccessToken),
    ],
  );

  const submitterPage = await submitterContext.newPage();
  const approverPage = await approverContext.newPage();
  const results = [];

  try {
    for (const scenario of selectedScenarios) {
      try {
        const result = await runScenario(
          submitterPage,
          approverPage,
          accessToken,
          scenario,
        );
        results.push(result);
        console.log(`SCENARIO=${result.key}`);
        console.log(`ROW=${result.rowText}`);
        console.log('SUCCESS=true');
        console.log('---');
      } catch (error) {
        results.push({
          key: scenario.key,
          success: false,
          error: error instanceof Error ? error.message : `${error}`,
        });
        console.log(`SCENARIO=${scenario.key}`);
        console.log(`SUCCESS=false`);
        console.log(
          `ERROR=${error instanceof Error ? error.message : `${error}`}`,
        );
        console.log('---');
      }
    }
  } finally {
    await browser.close();
  }

  const failed = results.filter((item) => !item.success);
  console.log(`SUMMARY_TOTAL=${results.length}`);
  console.log(`SUMMARY_FAILED=${failed.length}`);
  if (failed.length > 0) {
    console.log(
      `SUMMARY_FAILED_SCENARIOS=${failed.map((item) => item.key).join(' | ')}`,
    );
    process.exit(1);
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
