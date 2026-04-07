export function buildTargetSummary(target, result) {
  return {
    ...target,
    ...result,
    failed:
      !result.hasAllTexts ||
      result.redirectedToLogin ||
      result.pageErrors.length > 0 ||
      result.consoleErrors.length > 0 ||
      result.requestFailures.length > 0 ||
      result.responseErrors.length > 0,
  };
}

export function isRelevantNetworkUrl(url, apiBaseUrl, webBaseUrl) {
  return url.startsWith(apiBaseUrl) || url.startsWith(webBaseUrl);
}

export async function inspectTarget(page, target, options) {
  const pageErrors = [];
  const consoleErrors = [];
  const requestFailures = [];
  const responseErrors = [];

  const handlePageError = (error) => pageErrors.push(error.message);
  const handleConsole = (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  };
  const handleRequestFailed = (request) => {
    if (
      isRelevantNetworkUrl(
        request.url(),
        options.apiBaseUrl,
        options.webBaseUrl,
      )
    ) {
      requestFailures.push(
        `${request.method()} ${request.url()} :: ${request.failure()?.errorText}`,
      );
    }
  };
  const handleResponse = (response) => {
    if (
      response.status() >= 400 &&
      isRelevantNetworkUrl(
        response.url(),
        options.apiBaseUrl,
        options.webBaseUrl,
      )
    ) {
      responseErrors.push(`${response.status()} ${response.url()}`);
    }
  };

  page.on('pageerror', handlePageError);
  page.on('console', handleConsole);
  page.on('requestfailed', handleRequestFailed);
  page.on('response', handleResponse);

  try {
    await page.goto(`${options.webBaseUrl}${target.path}`, {
      waitUntil: 'networkidle',
    });
    await page.waitForTimeout(1200);

    const bodyText = await page.locator('body').innerText();
    const title = await page.title();
    const redirectedToLogin =
      bodyText.includes('欢迎回来') || bodyText.includes('请输入您的账户信息');
    const missingTexts = target.requiredTexts.filter(
      (text) => !bodyText.includes(text),
    );

    return buildTargetSummary(target, {
      consoleErrors: [...consoleErrors],
      hasAllTexts: missingTexts.length === 0,
      missingTexts,
      pageErrors: [...pageErrors],
      redirectedToLogin,
      requestFailures: [...requestFailures],
      responseErrors: [...responseErrors],
      title,
    });
  } finally {
    page.off('pageerror', handlePageError);
    page.off('console', handleConsole);
    page.off('requestfailed', handleRequestFailed);
    page.off('response', handleResponse);
  }
}

export async function inspectTargets(context, targets, inspectPage) {
  const results = [];

  for (const target of targets) {
    const page = await context.newPage();
    try {
      results.push(await inspectPage(page, target));
    } finally {
      await page.close();
    }
  }

  return results;
}
