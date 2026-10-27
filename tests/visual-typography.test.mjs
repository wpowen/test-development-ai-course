import assert from 'node:assert/strict';
import test from 'node:test';

import {wrapText} from '../scripts/visuals/routing.mjs';
import {widthOf} from '../scripts/visuals/renderer.mjs';

const SIZE = 23;
const EPSILON = 1e-7;
const opening = new Set([... '（【《〈「『〔〖“‘([{']);
const closing = new Set([... '，。、；：？！）】》〉」』〕〗”’％%.,:;!?)]}']);
const hanCount = value => [...value.matchAll(/\p{Script=Han}/gu)].length;
const hanWidth = count => widthOf('中', SIZE) * count;

// Exercise the wrapping contract directly, independent of graph placement.
// Delegating every measurement to widthOf also catches attempts to shrink type.
function wrap(value, width, size = SIZE) {
  let measurements = 0;
  const lines = wrapText(value, width, size, (text, measuredSize) => {
    measurements++;
    assert.equal(measuredSize, size, 'wrapping must measure at the requested font size');
    return widthOf(text, measuredSize);
  });
  assert.ok(Array.isArray(lines), 'wrapText must return an array of lines');
  assert.ok(lines.length > 0, 'even empty input must return a line');
  assert.ok(lines.every(line => typeof line === 'string'), 'each line must be text');
  if (String(value ?? '').trim()) {
    assert.ok(measurements > 0, 'nonempty text must use the supplied measurement function');
  }
  return lines;
}

function preservesText(lines, source) {
  assert.equal(lines.join(''), source, `wrapping must preserve text: ${JSON.stringify(lines)}`);
}

function fits(lines, width, size = SIZE) {
  for (const line of lines) {
    assert.ok(widthOf(line, size) <= width + EPSILON,
      `${JSON.stringify(line)} measures ${widthOf(line, size)} at size ${size}, budget ${width}`);
  }
}

function respectsPunctuation(lines) {
  for (const line of lines) {
    assert.ok(!closing.has(line[0]), `punctuation must not start a line: ${JSON.stringify(lines)}`);
    assert.ok(!opening.has(line.at(-1)), `an opening bracket must not end a line: ${JSON.stringify(lines)}`);
  }
}

for (const value of ['', null, undefined]) {
  test(`empty input ${String(value)} returns one empty line`, () => {
    assert.deepEqual(wrap(value, 0), ['']);
  });
}

test('explicit newlines preserve leading, consecutive and trailing empty paragraphs', () => {
  const source = '\n甲乙丙丁\n\nCANCEL_PENDING\n';
  assert.deepEqual(wrap(source, 1000), ['', '甲乙丙丁', '', 'CANCEL_PENDING', '']);
});

test('wrapping within paragraphs never merges text across explicit newlines', () => {
  const width = hanWidth(2);
  assert.deepEqual(wrap('甲乙丙丁戊己\n\ntokens\n甲乙丙丁', width),
    ['甲乙', '丙丁', '戊己', '', 'tokens', '甲乙', '丙丁']);
});

test('explicit one-character paragraphs remain explicit rather than stealing adjacent text', () => {
  assert.deepEqual(wrap('甲\n乙', hanWidth(4)), ['甲', '乙']);
});

for (const mark of ['，', '。', '、', '；', '：', '？', '！', ',', '.', ';', ':', '?', '!']) {
  test(`closing punctuation ${mark} stays off line starts`, () => {
    const source = `甲乙丙${mark}丁戊己庚辛壬`;
    const width = hanWidth(3.5);
    const lines = wrap(source, width);
    assert.ok(lines.length > 1, 'the fixture must actually wrap');
    preservesText(lines, source);
    respectsPunctuation(lines);
    fits(lines, width);
  });
}

for (const [left, right] of [
  ['（', '）'], ['【', '】'], ['《', '》'], ['〈', '〉'],
  ['「', '」'], ['『', '』'], ['〔', '〕'], ['〖', '〗'],
  ['“', '”'], ['‘', '’'], ['(', ')'], ['[', ']'], ['{', '}'],
]) {
  for (const capacity of [3, 4]) {
    test(`brackets ${left}${right} obey both line-edge prohibitions at ${capacity} Han width`, () => {
      const source = `甲乙${left}丙丁${right}戊己庚辛`;
      const width = hanWidth(capacity);
      const lines = wrap(source, width);
      assert.ok(lines.length > 1, 'the fixture must actually wrap');
      preservesText(lines, source);
      respectsPunctuation(lines);
      fits(lines, width);
    });
  }
}

for (const source of ['甲乙（「丙丁」）戊己庚辛', '甲乙丙丁？！戊己庚辛', '甲乙“丙丁”，戊己庚辛']) {
  test(`nested brackets and punctuation chains remain attached: ${source}`, () => {
    const width = hanWidth(5);
    const lines = wrap(source, width);
    assert.ok(lines.length > 1);
    preservesText(lines, source);
    respectsPunctuation(lines);
    fits(lines, width);
  });
}

for (const mark of ['%', '％']) {
  test(`numeric suffix ${mark} stays with its preceding number`, () => {
    const source = `甲乙丙99${mark}丁戊己庚辛`;
    const width = hanWidth(3);
    const lines = wrap(source, width);
    preservesText(lines, source);
    respectsPunctuation(lines);
    assert.ok(lines.some(line => line.includes(`99${mark}`)), 'a percentage must remain intact');
    fits(lines, width);
  });
}

for (const source of ['甲乙丙丁戊', '甲乙丙丁戊己庚', '甲乙丙丁戊己庚辛壬', '甲乙丙丁戊。']) {
  test(`Chinese wrapping leaves at least two Han characters on the final line: ${source}`, () => {
    const width = hanWidth(4);
    const lines = wrap(source, width);
    assert.ok(lines.length > 1);
    preservesText(lines, source);
    respectsPunctuation(lines);
    assert.ok(hanCount(lines.at(-1)) >= 2, `isolated Chinese tail: ${JSON.stringify(lines)}`);
    fits(lines, width);
  });
}

// Zero/narrow budgets cannot fit two Han characters. Preserve the minimum
// readable group through overflow; do not replace the rule with single glyphs.
for (const width of [0, 1, hanWidth(1) - 0.01, hanWidth(1)]) {
  test(`Chinese text keeps two-character groups even with width ${width}`, () => {
    const source = '甲乙丙丁戊';
    const lines = wrap(source, width);
    preservesText(lines, source);
    for (const line of lines) {
      assert.ok(hanCount(line) >= 2, `narrow width must not create isolated Han: ${JSON.stringify(lines)}`);
    }
  });
}

for (const token of [
  'tokens', 'CANCEL_PENDING', 'tool_name', 'args', 'caller', 'tenant',
  'unbreakableIdentifierWithoutSemanticBoundaries0123456789',
]) {
  for (const width of [0, 1, widthOf(token, SIZE) - 0.01]) {
    test(`indivisible token ${token} remains whole at width ${width}`, () => {
      assert.deepEqual(wrap(token, width), [token],
        'an oversized token must overflow intact, never become fragments such as toke/ns');
    });
  }
}

function semanticBreaksOnly(lines, source) {
  preservesText(lines, source);
  let offset = 0;
  for (const line of lines) {
    assert.match(line, /[A-Za-z0-9_]/, 'a separator must not occupy a line by itself');
    offset += line.length;
    if (offset < source.length) {
      assert.ok(/[-/]/.test(source[offset - 1]) || /[-/]/.test(source[offset]),
        `identifier split inside a component at ${offset}: ${JSON.stringify(lines)}`);
    }
  }
}

for (const source of ['tool_name/args/caller/tenant', 'EVIDENCE-INSUFFICIENT']) {
  const chunks = source.split(/(?<=[-/])/u);
  const width = Math.max(...chunks.map(chunk => widthOf(chunk, SIZE))) + 0.01;
  test(`${source} wraps at semantic boundaries when its components fit`, () => {
    const lines = wrap(source, width);
    assert.ok(lines.length > 1, 'semantic breaks must be used instead of overflowing the whole label');
    semanticBreaksOnly(lines, source);
    fits(lines, width);
  });
  for (const narrowWidth of [0, 1]) {
    test(`${source} never splits components even at width ${narrowWidth}`, () => {
      semanticBreaksOnly(wrap(source, narrowWidth), source);
    });
  }
}

test('mixed Chinese and CANCEL_PENDING preserve the underscore identifier', () => {
  const source = '当前状态CANCEL_PENDING等待确认';
  const lines = wrap(source, hanWidth(4));
  preservesText(lines, source);
  assert.ok(lines.some(line => line.includes('CANCEL_PENDING')));
  assert.equal(lines.filter(line => line.includes('CANCEL_PENDING')).length, 1);
  respectsPunctuation(lines);
});

test('English words break at spaces while tokens never becomes toke/ns', () => {
  const width = widthOf('tokens', SIZE);
  const lines = wrap('tokens caller tenant', width);
  assert.deepEqual(lines, ['tokens', 'caller', 'tenant']);
  fits(lines, width);
});

for (const size of [18, 23, 28, 40]) {
  test(`exact measured width fits without shrinking font size ${size}`, () => {
    for (const source of ['甲乙丙丁', 'CANCEL_PENDING', 'tool_name/args/caller/tenant', 'EVIDENCE-INSUFFICIENT']) {
      const width = widthOf(source, size);
      assert.deepEqual(wrap(source, width, size), [source]);
    }
  });
  test(`smaller width causes Chinese wrapping at the original font size ${size}`, () => {
    const source = '甲乙丙丁';
    const width = widthOf(source, size) - 0.01;
    const lines = wrap(source, width, size);
    assert.ok(lines.length > 1, 'overflow must be solved by wrapping at the requested size');
    preservesText(lines, source);
    assert.ok(lines.every(line => hanCount(line) >= 2));
    fits(lines, width, size);
  });
}
