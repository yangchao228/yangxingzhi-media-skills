// CUA bridge: read only. Upload/select/save actions are driven from fresh visible UI.
// In particular, never click a generic publish control: the save button may be in closed shadow DOM.
export async function observe(tab) {
 return tab.playwright.evaluate(readXhsDocument);
}

// Serializable DOM-only reader, also usable with Chrome DevTools evaluate_script.
export function readXhsDocument() {
 const editor=document.querySelector('[contenteditable="true"]');
 const topics=Array.from(editor?.querySelectorAll('a.tiptap-topic')||[]).map(el=>{
  try {const topic=JSON.parse(el.getAttribute('data-topic')||'{}');return {name:topic.name||'',id:topic.id||''};}
  catch {return {name:'',id:''};}
 });
 const textOf=node=>{
  if(node.nodeType===3)return node.textContent||'';
  if(node.nodeType!==1||node.matches('a.tiptap-topic, .content-hide'))return '';
  if(node.tagName==='BR')return '\n';
  const text=Array.from(node.childNodes).map(textOf).join('');
  return /^(P|DIV|LI)$/.test(node.tagName)?text+'\n':text;
 };
 const description=Array.from(editor?.childNodes||[]).map(textOf).join('')
  .split('\n').map(s=>s.replace(/[\u00a0\u200b]/g,' ').trim()).filter(Boolean).join('\n');
 return {
  account:document.querySelector('.user-info .name-box')?.innerText.trim()||'',
  title:document.querySelector('input[placeholder="填写标题会有更多赞哦"]')?.value||'',
  description,topics,
  images:Array.from(document.querySelectorAll('img.img.preview')).map(i=>({src:i.src.split(/[?#]/)[0],complete:i.complete,width:i.naturalWidth,height:i.naturalHeight}))
 };
}
