import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const sourceHtml = readFileSync('index.html', 'utf8')
const builtHtml = readFileSync('dist/index.html', 'utf8')
const title = (html) => html.match(/<title>([^<]+)<\/title>/)?.[1]
const description = (html) => html.match(/<meta\s+name="description"\s+content="([^"]+)"/)?.[1]

assert.ok(title(sourceHtml), 'Source title is missing')
assert.equal(title(builtHtml), title(sourceHtml), 'Built title differs from source')
assert.ok(description(sourceHtml), 'Source description is missing')
assert.equal(description(builtHtml), description(sourceHtml), 'Built description differs from source')
assert.match(builtHtml, /<link\s+rel="icon"[^>]+href="\/ccsc-mark\.png"/, 'Built favicon is missing')

const sourceLogo = readFileSync('public/ccsc-mark.png')
assert.equal(sourceLogo.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', 'Logo is not a PNG')
assert.ok(sourceLogo.equals(readFileSync('dist/ccsc-mark.png')), 'Built logo differs from source')

const references = [...builtHtml.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)]
assert.ok(references.length >= 2, 'Built JavaScript and stylesheet references are missing')
for (const [, asset] of references) {
  const outputRoot = resolve('dist')
  const assetPath = resolve('dist', `.${asset}`)
  assert.ok(assetPath.startsWith(`${outputRoot}/`) || assetPath.startsWith(`${outputRoot}\\`), 'Asset path leaves build output')
  assert.ok(existsSync(assetPath), `Built asset is missing: ${asset}`)
}

console.log(`Build verified: title, description, favicon, ${sourceLogo.readUInt32BE(16)} × ${sourceLogo.readUInt32BE(20)} logo, and ${references.length} asset references`)
