// CUA bridge: read only. Upload/select/save actions are driven from fresh visible UI.
// In particular, never click a generic publish control: the save button may be in closed shadow DOM.
export async function observe(tab) {
 return tab.playwright.evaluate(()=>({
  account:document.querySelector('.user-info .name-box')?.innerText.trim()||'',
  title:document.querySelector('input[placeholder="填写标题会有更多赞哦"]')?.value||'',
  description:document.querySelector('[contenteditable="true"]')?.innerText||'',
  images:Array.from(document.querySelectorAll('img.img.preview')).map(i=>({src:i.src.split(/[?#]/)[0],complete:i.complete,width:i.naturalWidth,height:i.naturalHeight}))
 }));
}
