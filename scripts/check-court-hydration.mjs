// macOS: node scripts/check-court-hydration.mjs (JSC may override Safari's JS engine path).
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'

const modules = Object.fromEntries(
  [
    'art/court-art',
    'art/harden-art',
    'art/svg-number',
    'timeline/court-timeline',
  ].map((name) => [
    `@/components/portfolio/${name}`,
    ts.transpileModule(
      readFileSync(
        new URL(
          `../app/components/portfolio/${name}.ts${name.endsWith('-art') ? 'x' : ''}`,
          import.meta.url,
        ),
        'utf8',
      ),
      {
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.CommonJS,
          jsx: ts.JsxEmit.ReactJSX,
        },
      },
    ).outputText,
  ]),
)

// Inspect every generated SVG prop, including nested Limb/Foot output.
// Hooks/JSX are identical stubs in both engines; geometry runs unmodified.
const source = `
const modules = ${JSON.stringify(modules)};
const cache = {};
const jsx = (type, props) => typeof type === 'function' ? type(props) : {type, props};
function require(name) {
  if (name === 'react') return {useId: () => 'court-test'};
  if (name === 'react/jsx-runtime') return {jsx, jsxs: jsx};
  if (!cache[name]) {
    const module = {exports: {}};
    cache[name] = module;
    new Function('module', 'exports', 'require', modules[name])(module, module.exports, require);
  }
  return cache[name].exports;
}
const {CourtArt} = require('@/components/portfolio/art/court-art');
const {courtAt} = require('@/components/portfolio/timeline/court-timeline');
const frames = [JSON.stringify(CourtArt({}))];
for (let frame = 0; frame <= 480; frame++) {
  frames.push(JSON.stringify(CourtArt({pose: courtAt(frame)})));
}
JSON.stringify(frames);
`
const expected = JSON.parse(runInNewContext(source))
const jsc =
  process.env.JSC ||
  '/System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc'
const actual = JSON.parse(
  execFileSync(jsc, ['-e', `print(eval(${JSON.stringify(source)}))`], {
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
  }),
)
assert.equal(actual.length, expected.length)
expected.forEach((svg, index) => {
  assert.ok(
    svg === actual[index],
    `Safari SVG differs from server at ${index === 0 ? 'SSR still (170)' : `frame ${index - 1}`}`,
  )
  assert.ok(!/NaN|Infinity/.test(svg), 'SVG coordinates must stay finite')
})
console.log(
  'Court SVG: SSR still + all 481 frames match between V8 and Safari JavaScriptCore',
)
