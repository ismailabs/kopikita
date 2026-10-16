import { readFile } from 'node:fs/promises';
// The CSV was checked against original commit 541ae32 before the redesign.
export const baseline = (await readFile(new URL('../data/menu-baseline.csv', import.meta.url), 'utf8')).trim().split(/\r?\n/).slice(1).map(line => {
  const cells = [...line.matchAll(/(?:^|,)(?:"((?:[^"]|"")*)"|([^,]*))/g)].map(m => (m[1] ?? m[2]).replaceAll('""','"'));
  return { category: cells[0], name: cells[1], description: cells[2], price: cells[3] };
});
export function menuFromHtml(html) {
  return [...html.matchAll(/<article class="menu-item" data-category="([^"]+)"[^>]*>([\s\S]*?)<\/article>/g)].map(([,category,body]) => ({
    category,
    name: body.match(/<h4>(.*?)<\/h4>/)[1],
    description: body.match(/<p>(.*?)<\/p>/)[1],
    price: body.match(/class="menu-price"[^>]*>(.*?)<\/span>/)[1]
  }));
}
