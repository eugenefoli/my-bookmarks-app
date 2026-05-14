import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';

const INDEX_PATH = '/home/runner/work/my-bookmarks-app/my-bookmarks-app/index.html';
const STORAGE_KEY = 'my-bookmarks-v1';

async function createAppDom(url = 'https://example.test/app') {
  const html = await readFile(INDEX_PATH, 'utf8');
  const dom = new JSDOM(html, {
    url,
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true
  });
  await new Promise(resolve => setTimeout(resolve, 0));
  return dom;
}

function text(el) {
  return el.textContent.replace(/\s+/g, ' ').trim();
}

test('default view shows top 5 bookmarks and can expand/collapse', async () => {
  const dom = await createAppDom();
  const { window } = dom;
  const { document } = window;

  assert.equal(document.querySelectorAll('.card').length, 5);
  assert.match(text(document.querySelector('.btn-see-more')), /See more \(3 more\)/);

  window.toggleShowAll();
  assert.equal(document.querySelectorAll('.card').length, 8);
  assert.equal(text(document.querySelector('.btn-see-more')), 'See less');

  dom.window.close();
});

test('search filters bookmarks and shows empty state for no matches', async () => {
  const dom = await createAppDom();
  const { window } = dom;
  const { document } = window;
  const search = document.getElementById('search');

  search.value = 'github';
  search.dispatchEvent(new window.Event('input'));
  assert.equal(document.querySelectorAll('.card').length, 1);
  assert.equal(text(document.querySelector('.card-title')), 'GitHub');

  search.value = 'no-bookmark-should-match-this';
  search.dispatchEvent(new window.Event('input'));
  assert.equal(document.querySelectorAll('.card').length, 0);
  assert.equal(document.getElementById('empty').style.display, 'block');

  dom.window.close();
});

test('category filter only shows matching category', async () => {
  const dom = await createAppDom();
  const { window } = dom;
  const { document } = window;

  window.setFilter('Design');
  const categories = [...document.querySelectorAll('.card-category')].map(el => text(el));

  assert.ok(categories.length > 0);
  assert.ok(categories.every(cat => cat === 'Design'));

  dom.window.close();
});

test('submitting form adds bookmark, updates storage, and renders at top', async () => {
  const dom = await createAppDom();
  const { window } = dom;
  const { document, localStorage } = window;

  document.getElementById('f-title').value = 'Node Docs';
  document.getElementById('f-url').value = 'https://nodejs.org/docs';
  document.getElementById('f-category').value = 'Development';
  document.getElementById('f-notes').value = 'Runtime docs';

  document.getElementById('bookmark-form').dispatchEvent(
    new window.Event('submit', { bubbles: true, cancelable: true })
  );

  assert.equal(text(document.querySelector('.card-title')), 'Node Docs');
  assert.match(text(document.getElementById('stats')), /Showing 9 of 9 bookmarks/);

  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
  assert.equal(stored.length, 9);
  assert.equal(stored[0].title, 'Node Docs');

  dom.window.close();
});

test('deleteBookmark respects confirmation and removes when confirmed', async () => {
  const dom = await createAppDom();
  const { window } = dom;
  const { document } = window;
  const targetId = document.querySelector('a.card-url').dataset.id;

  window.confirm = () => false;
  window.deleteBookmark(targetId);
  let stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
  assert.equal(stored.length, 8);

  window.confirm = () => true;
  window.deleteBookmark(targetId);
  stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
  assert.equal(stored.length, 7);

  dom.window.close();
});

test('heat tiers are assigned by click rank', async () => {
  const dom = await createAppDom();
  const { window } = dom;
  const { document } = window;

  window.eval(`
    bookmarks = [
      { id: 'a', title: 'A', url: 'https://a.test', category: 'X', notes: '', date: 'Jan 1, 2026', clicks: 10 },
      { id: 'b', title: 'B', url: 'https://b.test', category: 'X', notes: '', date: 'Jan 1, 2026', clicks: 8 },
      { id: 'c', title: 'C', url: 'https://c.test', category: 'X', notes: '', date: 'Jan 1, 2026', clicks: 6 },
      { id: 'd', title: 'D', url: 'https://d.test', category: 'X', notes: '', date: 'Jan 1, 2026', clicks: 4 },
      { id: 'e', title: 'E', url: 'https://e.test', category: 'X', notes: '', date: 'Jan 1, 2026', clicks: 2 }
    ];
    activeFilter = 'All';
    showAll = true;
    render();
  `);

  assert.ok(document.getElementById('card-a').classList.contains('heat-4'));
  assert.ok(document.getElementById('card-b').classList.contains('heat-3'));
  assert.ok(document.getElementById('card-c').classList.contains('heat-2'));
  assert.ok(document.getElementById('card-d').classList.contains('heat-1'));
  assert.ok(document.getElementById('card-e').classList.contains('heat-1'));

  dom.window.close();
});

test('parseNetscapeHTML parses nested folders and skips non-http links', async () => {
  const dom = await createAppDom();
  const { window } = dom;

  const html = `
    <DL><p>
      <DT><H3>Dev</H3>
      <DL><p>
        <DT><A HREF="https://developer.mozilla.org">MDN</A>
        <DT><A HREF="ftp://example.com/file">FTP Link</A>
      </DL><p>
      <DT><A HREF="https://example.com">Example</A>
    </DL><p>
  `;

  const parsed = window.parseNetscapeHTML(html);
  assert.equal(parsed.length, 2);
  assert.deepEqual(parsed.map(x => x.title), ['MDN', 'Example']);
  assert.deepEqual(parsed.map(x => x.category), ['Dev', 'Imported']);

  dom.window.close();
});

test('parseFirefoxJSON parses bookmark nodes and ignores invalid URLs', async () => {
  const dom = await createAppDom();
  const { window } = dom;

  const json = JSON.stringify({
    title: 'root',
    children: [
      {
        title: 'Toolbar',
        children: [
          { type: 'text/x-moz-place', title: 'Mozilla', uri: 'https://mozilla.org' },
          { type: 'text/x-moz-place', title: 'Not allowed', uri: 'about:config' }
        ]
      }
    ]
  });

  const parsed = window.parseFirefoxJSON(json);
  assert.equal(parsed.length, 1);
  assert.deepEqual(parsed[0], {
    title: 'Mozilla',
    url: 'https://mozilla.org',
    category: 'Toolbar',
    notes: ''
  });

  assert.equal(window.parseFirefoxJSON('{bad json'), null);

  dom.window.close();
});

test('normalizeURL lowercases, trims, and removes trailing slash', async () => {
  const dom = await createAppDom();
  const { window } = dom;

  assert.equal(window.normalizeURL('  HTTPS://Example.com/path/  '), 'https://example.com/path');

  dom.window.close();
});

test('popup quick-save marks duplicates and saves new URLs', async () => {
  const duplicateDom = await createAppDom(
    'https://example.test/app?bm_title=GitHub&bm_url=https%3A%2F%2Fgithub.com'
  );
  const dupWindow = duplicateDom.window;
  const dupDoc = dupWindow.document;

  assert.ok(dupDoc.body.classList.contains('popup-mode'));
  assert.match(text(dupDoc.getElementById('popup-status')), /Already in your bookmarks/);
  assert.equal(JSON.parse(dupWindow.localStorage.getItem(STORAGE_KEY)).length, 8);
  duplicateDom.window.close();

  const newDom = await createAppDom(
    'https://example.test/app?bm_title=New%20Site&bm_url=https%3A%2F%2Fnewsite.example'
  );
  const newWindow = newDom.window;

  assert.equal(JSON.parse(newWindow.localStorage.getItem(STORAGE_KEY)).length, 9);
  const first = JSON.parse(newWindow.localStorage.getItem(STORAGE_KEY))[0];
  assert.equal(first.url, 'https://newsite.example');
  assert.equal(first.category, 'Quick Save');

  newDom.window.close();
});
