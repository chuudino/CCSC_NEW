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
assert.match(builtHtml, /<link\s+rel="icon"[^>]+href="\/ccsc-mark\.svg"/, 'Built vector favicon is missing')

const sourceLogo = readFileSync('public/ccsc-mark.svg')
assert.match(sourceLogo.toString('utf8'), /<svg\b[^>]*viewBox="[^"]+"/, 'Logo is not a scalable SVG')
assert.doesNotMatch(sourceLogo.toString('utf8'), /<image\b|data:image\//i, 'Vector logo embeds a raster image')
assert.ok(sourceLogo.equals(readFileSync('dist/ccsc-mark.svg')), 'Built vector logo differs from source')

const references = [...builtHtml.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)]
assert.ok(references.length >= 2, 'Built JavaScript and stylesheet references are missing')
for (const [, asset] of references) {
  const outputRoot = resolve('dist')
  const assetPath = resolve('dist', `.${asset}`)
  assert.ok(assetPath.startsWith(`${outputRoot}/`) || assetPath.startsWith(`${outputRoot}\\`), 'Asset path leaves build output')
  assert.ok(existsSync(assetPath), `Built asset is missing: ${asset}`)
}

assert.match(builtHtml, /<link rel="manifest" href="\/manifest\.webmanifest"/)
assert.match(builtHtml, /<link rel="apple-touch-icon" sizes="180x180" href="\/pwa\/apple-touch-icon\.png"/)
const manifest = JSON.parse(readFileSync('dist/manifest.webmanifest', 'utf8'))
assert.equal(manifest.id, '/')
assert.equal(manifest.start_url, '/')
assert.equal(manifest.scope, '/')
assert.equal(manifest.display, 'standalone')
for (const size of [192, 512]) {
  assert.ok(manifest.icons.some(({ sizes, purpose }) => sizes === `${size}x${size}` && !purpose))
}
for (const { src, sizes } of [...manifest.icons, { src: '/pwa/apple-touch-icon.png', sizes: '180x180' }]) {
  const [width, height] = sizes.split('x').map(Number)
  const icon = readFileSync(`dist${src}`)
  assert.equal(icon.toString('ascii', 12, 16), 'IHDR', `Invalid PNG header: ${src}`)
  assert.equal(icon.readUInt32BE(16), width, `Invalid icon width: ${src}`)
  assert.equal(icon.readUInt32BE(20), height, `Invalid icon height: ${src}`)
}
assert.ok(readFileSync('public/sw.js').equals(readFileSync('dist/sw.js')))

console.log(`Build verified: title, description, logo, PWA files, and ${references.length} asset references`)
