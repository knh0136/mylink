import { expect, test } from "@playwright/test";

test("기본 프로필과 세 링크가 올바르게 표시된다", async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Kim Nam Ho' })).toBeVisible();
  await expect(page.getByLabel('KNH 이니셜')).toBeVisible();
  await expect(page.getByText('한양대학교 컴퓨터소프트웨어학부에 재학중인 김남호 입니다.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Instagram (새 탭에서 열기)', exact: true })).toHaveAttribute('href', 'https://www.instagram.com/mikrok0sm0s?exln=NXI1N3ZlbHhjYzI1');
  await expect(page.getByRole('link', { name: 'GitHub (새 탭에서 열기)', exact: true })).toHaveAttribute('target', '_blank');
  await expect(page.getByRole('link', { name: 'Naver Blog (새 탭에서 열기)', exact: true })).toHaveAttribute('rel', 'noopener noreferrer');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/profile-desktop.png', fullPage: true });
  expect(errors).toEqual([]);
});

test("링크 검증·추가·수정·취소·삭제와 새로고침 후 저장", async ({ page }) => {
  await page.goto('/mypage/');
  await page.getByRole('button', { name: '링크 추가', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: '추가하기', exact: true }).click();
  await expect(dialog.getByText('제목을 입력해 주세요.', { exact: true })).toBeVisible();
  await dialog.getByLabel('링크 제목').fill('테스트 링크');
  await dialog.getByLabel('링크 주소').fill('javascript:alert(1)');
  await dialog.getByRole('button', { name: '추가하기' }).click();
  await expect(dialog.getByText(/올바른 웹 주소/)).toBeVisible();
  await dialog.getByLabel('링크 주소').fill('example.com/notes');
  await dialog.getByRole('button', { name: '추가하기' }).click();
  await expect(dialog).not.toBeVisible();
  await page.reload();
  await expect(page.getByRole('link', { name: '테스트 링크 (새 탭에서 열기)' })).toHaveAttribute('href', 'https://example.com/notes');
  await page.getByRole('button', { name: '테스트 링크 수정' }).click();
  await dialog.getByLabel('링크 제목').fill('취소할 변경');
  await dialog.getByRole('button', { name: '취소', exact: true }).click();
  await expect(page.getByRole('button', { name: '테스트 링크 수정' })).toBeFocused();
  await page.getByRole('button', { name: '테스트 링크 수정' }).click();
  await dialog.getByLabel('링크 제목').fill('수정된 링크');
  await dialog.getByRole('button', { name: '저장하기' }).click();
  await page.getByRole('link', { name: '프로필 보기' }).click();
  await expect(page.getByRole('link', { name: '수정된 링크 (새 탭에서 열기)' })).toBeVisible();
  await page.getByRole('link', { name: '링크 관리' }).click();
  await page.getByRole('button', { name: '수정된 링크 삭제' }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: '취소' }).click();
  await expect(page.getByRole('button', { name: '수정된 링크 삭제' })).toBeVisible();
  await page.getByRole('button', { name: '수정된 링크 삭제' }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: '삭제하기' }).click();
  await page.reload();
  await expect(page.getByRole('link', { name: '수정된 링크 (새 탭에서 열기)' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: /새 탭에서 열기/ })).toHaveCount(3);
});

test("프로필은 저장되고 다른 탭에 반영되며 다른 브라우저에는 공유되지 않는다", async ({ page, context, browser }) => {
  await page.goto('/mypage/');
  const otherTab = await context.newPage();
  await otherTab.goto('/');
  await page.getByRole('button', { name: '프로필 편집' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('표시 이름').fill('Kim Nam Ho · Test');
  await dialog.getByLabel('프로필 이니셜').fill('TEST');
  await dialog.getByLabel('한 줄 소개').fill('브라우저 저장 테스트');
  await dialog.getByRole('button', { name: '저장하기' }).click();
  await expect(otherTab.getByRole('heading', { name: 'Kim Nam Ho · Test' })).toBeVisible();
  await otherTab.reload();
  await expect(otherTab.getByLabel('TEST 이니셜')).toBeVisible();
  const cleanContext = await browser.newContext();
  const cleanPage = await cleanContext.newPage();
  await cleanPage.goto('http://127.0.0.1:3100/');
  await expect(cleanPage.getByRole('heading', { name: 'Kim Nam Ho', exact: true })).toBeVisible();
  await cleanContext.close();
});

test("모바일 화면과 복사 권한 실패 시 수동 복사가 동작한다", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/profile-mobile.png', fullPage: true });
  await page.evaluate(() => { Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.reject(new Error('denied')) } }); });
  await page.getByRole('button', { name: '페이지 주소 복사' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByLabel('공개 페이지 주소')).toHaveValue('http://127.0.0.1:3100/');
  await page.keyboard.press('Escape');
  await page.getByRole('link', { name: '링크 관리' }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: '링크 추가', exact: true }).click();
  await expect(page.getByRole('dialog').getByLabel('링크 제목')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("손상된 저장 데이터와 저장 실패를 처리하며 성공으로 표시하지 않는다", async ({ page }) => {
  await page.addInitScript(() => { localStorage.setItem('mylink:library:v1', '{broken'); });
  await page.goto('/mypage/');
  await expect(page.getByRole('alert').filter({ hasText: '기본 프로필' })).toBeVisible();
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); }; });
  await page.getByRole('button', { name: '링크 추가', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('링크 제목').fill('저장 실패 링크');
  await dialog.getByLabel('링크 주소').fill('https://example.com');
  await dialog.getByRole('button', { name: '추가하기' }).click();
  await expect(dialog.getByRole('alert')).toContainText('저장하지 못했어요');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: '취소', exact: true }).click();
  await expect(page.getByRole('link', { name: '저장 실패 링크 (새 탭에서 열기)' })).toHaveCount(0);
});
