// Run only inside cua_repl after inspecting the target editor and confirming account/draft.
// Browser operations use the injected, documented cua Tab; no network or hidden app state.
import { validateObservation, preflightZhihuBaseline } from '../dist/zhihu-sync.js';

export async function observe(tab) {
  return tab.playwright.evaluate(() => {
    const editor = document.querySelector('[contenteditable="true"]');
    const title = document.querySelector('textarea');
    const account = Array.from(document.querySelectorAll('img')).map(i => i.alt.match(/^点击打开(.+)的主页$/)?.[1]).find(Boolean) || '';
    const all = document.body.innerText;
    let text = editor?.innerText || '';
    for (const caption of editor?.querySelectorAll('figcaption.is-placeholder') || []) text = text.replace(caption.innerText, '');
    // Zhihu inserts zero-width separators into rendered links.
    text = text.replace(/\u200b/g, '');
    return { url: document.URL, account, title: title?.value || '', text,
      initialized: !!editor && !!title && !all.includes('草稿加载中'),
      busy: /图片上传中|草稿保存中|草稿加载中/.test(all), failed: /上传失败|上传图片出错/.test(all),
      saved: /·\s*草稿/.test(all) && !/草稿保存中|草稿加载中/.test(all),
      images: Array.from(editor?.querySelectorAll('img') || []).map(i => ({ src: (i.getAttribute('src') || '').split(/[?#]/)[0], complete: i.complete, width: i.naturalWidth, height: i.naturalHeight })) };
  });
}
export async function importDraft(tab, plan, { baseline } = {}) {
  const before = await observe(tab);
  if (!before.initialized || before.busy || !before.saved) throw new Error('EDITOR_NOT_READY');
  if (before.url !== plan.draft_url || before.account !== plan.account) throw new Error('DRAFT_OR_ACCOUNT_MISMATCH');
  // The baseline is the last independently accepted remote observation. Do this
  // before clearing the editor so a remote edit cannot be destroyed by import.
  if (!baseline) throw new Error('BASELINE_REQUIRED');
  preflightZhihuBaseline(plan, baseline, before);
  await tab.playwright.locator('textarea').fill(plan.title);
  const editor = tab.playwright.locator('[contenteditable="true"]');
  await editor.press('ControlOrMeta+A'); await editor.press('Backspace');
  const empty = await observe(tab);
  if (empty.text.trim() || empty.images.length) throw new Error('EDITOR_NOT_EMPTY');
  await tab.paste(null, plan.html, { format: 'html' });
  await tab.getAXState({ emit: false });
  return { status: 'awaiting_transfer', before };
}
// Each bounded wait checks actual DOM state; timeout never authorizes a re-upload or success.
export async function waitForDraft(tab, plan, { timeoutMs = 45000 } = {}) {
  const end = Date.now() + Math.min(timeoutMs, 45000);
  let last = 'EDITOR_NOT_READY';
  do {
    const o = await observe(tab);
    if (o.initialized) {
      if (o.url !== plan.draft_url || o.account !== plan.account) throw new Error('DRAFT_OR_ACCOUNT_MISMATCH');
      if (o.failed) throw new Error('IMAGE_TRANSFER_FAILED');
      try { validateObservation(plan, o); return o; }
      catch (e) { last = e.message; }
    }
    // Use the browser's observation wait, not a fixed post-paste sleep.
    await tab.getAXState({ emit: false });
  } while (Date.now() < end);
  throw new Error('WAIT_TIMEOUT:' + last);
}
export async function reopenAndRead(cua, originalTab, plan, options) {
  const tab = await cua.createBrowserTab('iab', plan.draft_url, { visible: false });
  if (tab.id === originalTab.id) throw new Error('INDEPENDENT_REOPEN_REQUIRED');
  const reopened = await waitForDraft(tab, plan, options);
  return { tab, reopened, independent_reopen: true };
}
