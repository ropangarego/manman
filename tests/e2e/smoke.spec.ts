import { expect, test, type Page } from '@playwright/test';

const text = {
  authTitle: /Welcome back|Selamat datang kembali/i,
  email: /Email/i,
  password: /Password/i,
  signIn: /Sign in|Masuk/i,
  home: /Home|Beranda/i,
  settings: /Settings|Pengaturan/i,
  startStudy: /Start Study|Mulai Belajar/i,
  startSession: /^Start$|^Mulai$/i,
  practiceThis: /Practice this|Latih ini/i,
  next: /Next|Lanjut/i,
  resetLearningProgress: /Reset learning progress|Reset progres belajar/i,
  reset: /^Reset$/i,
  logout: /Logout|Keluar/i,
  todaySession: /Today'?s Session|Sesi hari ini/i,
  studySession: /Study session|Sesi belajar/i,
};

function credentialsPresent() {
  return Boolean(process.env.MANMAN_E2E_EMAIL && process.env.MANMAN_E2E_PASSWORD);
}

async function login(page: Page) {
  await page.goto('/');
  await page.getByLabel(text.email).fill(process.env.MANMAN_E2E_EMAIL ?? '');
  await page.locator('input[autocomplete="current-password"]').fill(process.env.MANMAN_E2E_PASSWORD ?? '');
  await page.getByRole('button', { name: text.signIn }).click();
  await expect(page.getByRole('button', { name: text.startStudy })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole('button', { name: text.home })).toBeVisible();
}

async function navigateTo(page: Page, label: RegExp) {
  await page.getByRole('button', { name: label }).first().click();
}

async function currentWordsLearned(page: Page) {
  const wordCard = page.locator('.stats-row .stat-card').nth(2);
  await expect(wordCard).toBeVisible();
  const value = await wordCard.locator('b').innerText();
  return Number.parseInt(value, 10);
}

async function completeFirstLearningItem(page: Page) {
  await page.getByRole('button', { name: text.startStudy }).click();
  await expect(page.getByText(text.studySession)).toBeVisible();
  await page.getByRole('button', { name: text.startSession }).click();
  await expect(page.getByRole('button', { name: text.practiceThis })).toBeVisible();
  const correctAnswer = (await page.locator('.hanzi-focus .muted').first().innerText()).trim();
  await page.getByRole('button', { name: text.practiceThis }).click();
  await page.getByRole('button', { name: new RegExp(`^${escapeRegExp(correctAnswer)}$`) }).click();
  await page.getByRole('button', { name: text.next }).click();
}

async function openSettings(page: Page) {
  await navigateTo(page, text.settings);
  await expect(page.getByText(text.resetLearningProgress)).toBeVisible();
}

async function resetLearningProgress(page: Page) {
  await openSettings(page);
  await page.getByRole('button', { name: text.resetLearningProgress }).first().click();
  await page.getByRole('button', { name: text.reset }).last().click();
  await page.waitForTimeout(1_500);
}

async function logout(page: Page) {
  await openSettings(page);
  await page.getByRole('button', { name: text.logout }).first().click();
  await page.getByRole('button', { name: text.logout }).last().click();
  await expect(page.getByText(text.authTitle)).toBeVisible({ timeout: 20_000 });
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

test('shows the signed-out auth state', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText(text.authTitle)).toBeVisible();
  await expect(page.getByLabel(text.email)).toBeVisible();
  await expect(page.locator('input[autocomplete="current-password"]')).toBeVisible();
  await expect(page.getByRole('button', { name: text.signIn })).toBeVisible();
});

test('persists learner progress across refresh and relogin, then reset stays reset', async ({ page }) => {
  test.skip(!credentialsPresent(), 'QA credentials are required for the signed-in smoke flow.');

  await login(page);
  await resetLearningProgress(page);
  await navigateTo(page, text.home);
  expect(await currentWordsLearned(page)).toBe(0);

  await completeFirstLearningItem(page);
  await navigateTo(page, text.home);
  expect(await currentWordsLearned(page)).toBe(1);

  await page.reload();
  await expect(page.getByRole('button', { name: text.startStudy })).toBeVisible({ timeout: 20_000 });
  expect(await currentWordsLearned(page)).toBe(1);

  await logout(page);
  await login(page);
  expect(await currentWordsLearned(page)).toBe(1);

  await resetLearningProgress(page);
  await navigateTo(page, text.home);
  expect(await currentWordsLearned(page)).toBe(0);

  await page.reload();
  await expect(page.getByRole('button', { name: text.startStudy })).toBeVisible({ timeout: 20_000 });
  expect(await currentWordsLearned(page)).toBe(0);

  await logout(page);
  await login(page);
  expect(await currentWordsLearned(page)).toBe(0);
});
