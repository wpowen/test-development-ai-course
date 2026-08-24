import type { GlossaryEntry } from "../content/glossary";

export type GlossaryTextPart =
  | { kind: "text"; text: string }
  | { kind: "term"; text: string; entry: GlossaryEntry };

type GlossaryAlias = {
  alias: string;
  normalized: string;
  entry: GlossaryEntry;
};

export type GlossaryMatcher = {
  aliasCount: number;
  aliases: GlossaryAlias[];
  byFirstCharacter: Map<string, GlossaryAlias[]>;
  byAlias: Map<string, GlossaryEntry>;
};

const ASCII_WORD = /[A-Za-z0-9_]/;
const SPLIT_AKA = /[、，,；;|]/;

const normalize = (value: string) => value.trim().toLocaleLowerCase("zh-CN");

function isAmbiguousParentheticalAbbreviation(value: string) {
  return /^[A-Za-z0-9]{1,2}$/.test(value.trim());
}

function isUsableAlias(value: string) {
  const alias = value.trim();
  if (alias.length < 2) return false;
  if (/^https?:\/\//i.test(alias)) return false;
  return /[\p{L}\p{N}]/u.test(alias);
}

/**
 * One glossary record may be written as its canonical label, the English/Chinese
 * half of a bilingual label, or one of its authored aliases. All variants still
 * resolve to the same record; the glossary remains the sole definition source.
 */
export function glossaryAliases(entry: GlossaryEntry) {
  const aliases = new Set<string>();
  const add = (value?: string) => {
    const alias = value?.trim();
    if (alias && isUsableAlias(alias)) aliases.add(alias);
  };

  add(entry.term);
  const bilingual = entry.term.match(/^(.+?)[（(]([^）)]+)[）)]$/u);
  if (bilingual) {
    add(bilingual[1]);
    // Bare two-letter abbreviations are often domain-dependent: CI can mean
    // confidence interval or continuous integration, CV can mean coefficient
    // of variation or computer vision. Keep the full authored term clickable,
    // but do not invent an unsafe bare alias.
    if (!isAmbiguousParentheticalAbbreviation(bilingual[2])) add(bilingual[2]);
  }
  if (entry.aka) {
    add(entry.aka);
    entry.aka.split(SPLIT_AKA).forEach(add);
  }
  return [...aliases];
}

export function buildGlossaryMatcher(entries: readonly GlossaryEntry[]): GlossaryMatcher {
  const byAlias = new Map<string, GlossaryEntry>();
  const displayAlias = new Map<string, string>();

  for (const entry of entries) {
    for (const alias of glossaryAliases(entry)) {
      const key = normalize(alias);
      const existing = byAlias.get(key);
      // Prefer an exact canonical label, then the core glossary record, then the
      // first stable occurrence. This makes alias collisions deterministic.
      const shouldReplace = !existing
        || (normalize(entry.term) === key && normalize(existing.term) !== key)
        || (entry.kind === "core" && existing.kind !== "core");
      if (shouldReplace) {
        byAlias.set(key, entry);
        displayAlias.set(key, alias);
      }
    }
  }

  const aliases = [...byAlias.entries()]
    .map(([normalized, entry]) => ({ normalized, entry, alias: displayAlias.get(normalized) ?? normalized }))
    .sort((left, right) => right.normalized.length - left.normalized.length || left.normalized.localeCompare(right.normalized));
  const byFirstCharacter = new Map<string, GlossaryAlias[]>();
  for (const alias of aliases) {
    const first = alias.normalized[0];
    const bucket = byFirstCharacter.get(first) ?? [];
    bucket.push(alias);
    byFirstCharacter.set(first, bucket);
  }
  return { aliases, aliasCount: aliases.length, byAlias, byFirstCharacter };
}

function hasAsciiBoundary(text: string, start: number, length: number, alias: string) {
  const before = text[start - 1];
  const after = text[start + length];
  if (ASCII_WORD.test(alias[0]) && before && ASCII_WORD.test(before)) return false;
  if (ASCII_WORD.test(alias[alias.length - 1]) && after && ASCII_WORD.test(after)) return false;
  return true;
}

export function tokenizeGlossaryText(text: string, matcher: GlossaryMatcher): GlossaryTextPart[] {
  if (!text) return [{ kind: "text", text }];
  const normalizedText = text.toLocaleLowerCase("zh-CN");
  const parts: GlossaryTextPart[] = [];
  let cursor = 0;
  let plainStart = 0;

  while (cursor < text.length) {
    const candidates = matcher.byFirstCharacter.get(normalizedText[cursor]) ?? [];
    const match = candidates.find((candidate) =>
      normalizedText.startsWith(candidate.normalized, cursor)
      && hasAsciiBoundary(text, cursor, candidate.normalized.length, candidate.alias));

    if (!match) {
      cursor += 1;
      continue;
    }
    if (cursor > plainStart) parts.push({ kind: "text", text: text.slice(plainStart, cursor) });
    const end = cursor + match.normalized.length;
    parts.push({ kind: "term", text: text.slice(cursor, end), entry: match.entry });
    cursor = end;
    plainStart = end;
  }

  if (plainStart < text.length) parts.push({ kind: "text", text: text.slice(plainStart) });
  return parts.length ? parts : [{ kind: "text", text }];
}

export function findGlossaryEntry(matcher: GlossaryMatcher, value: string) {
  const direct = matcher.byAlias.get(normalize(value));
  if (direct) return direct;
  return tokenizeGlossaryText(value, matcher).find((part) => part.kind === "term")?.entry;
}
