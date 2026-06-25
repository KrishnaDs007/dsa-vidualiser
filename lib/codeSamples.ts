import { codeToHtml } from 'shiki'
import {
  CODE_SAMPLE_LANGUAGES,
  type CodeSampleLanguageId,
  type HighlightedCodeSamples
} from '@/lib/codeSampleLanguages'
export type { HighlightedCodeSamples } from '@/lib/codeSampleLanguages'

export async function highlightCodeSamplesByAlgo<T extends string>(
  pseudocodeByAlgo: Record<T, string>
): Promise<Record<T, HighlightedCodeSamples>> {
  const entries = await Promise.all(
    (Object.entries(pseudocodeByAlgo) as [T, string][]).map(async ([id, code]) => [
      id,
      await highlightCodeSamples(code)
    ])
  )

  return Object.fromEntries(entries) as Record<T, HighlightedCodeSamples>
}

async function highlightCodeSamples(code: string): Promise<HighlightedCodeSamples> {
  const samples = buildCodeSamples(code)
  const entries = await Promise.all(
    CODE_SAMPLE_LANGUAGES.map(async (language) => [
      language.id,
      await codeToHtml(samples[language.id], {
        lang: language.shiki,
        theme: 'github-light'
      })
    ])
  )

  return Object.fromEntries(entries) as HighlightedCodeSamples
}

export function buildCodeSamples(code: string): Record<CodeSampleLanguageId, string> {
  const javascript = toJavaScript(code)

  return {
    typescript: toTypeScript(code),
    javascript,
    python: toPython(code),
    java: toJava(code),
    cpp: toCpp(code),
    c: toC(code),
    csharp: toCSharp(code)
  }
}

function toTypeScript(code: string) {
  return code.trim()
}

function toJavaScript(code: string) {
  return code
    .trim()
    .replace(/: number\[\]/g, '')
    .replace(/: number/g, '')
    .replace(/: string/g, '')
    .replace(/: boolean/g, '')
    .replace(/: Node \| null/g, '')
    .replace(/: ListNode \| null/g, '')
    .replace(/: [A-Za-z0-9_<>\[\] |]+/g, '')
    .replace(/\): [A-Za-z0-9_<>\[\] |]+ \{/g, ') {')
}

function toPython(code: string) {
  const lines = code.trim().split('\n')
  let indent = 0
  const output: string[] = ['from math import floor', '']

  for (const rawLine of lines) {
    const trimmed = rawLine.trim()
    if (!trimmed) {
      output.push('')
      continue
    }

    const leadingClosers = trimmed.match(/^}+/)?.[0].length ?? 0
    indent = Math.max(indent - leadingClosers, 0)
    let line = trimmed.replace(/^}+\s*/, '').replace(/\s*{\s*$/, '')
    const opensBlock = trimmed.endsWith('{')

    line = line
      .replace(/^function\s+(\w+)\((.*)\)$/, (_, name: string, args: string) => {
        return `def ${toSnakeCase(name)}(${toPythonArgs(args)}):`
      })
      .replace(/^const\s+/, '')
      .replace(/^let\s+/, '')
      .replace(/;$/g, '')
      .replace(/\btrue\b/g, 'True')
      .replace(/\bfalse\b/g, 'False')
      .replace(/\bnull\b/g, 'None')
      .replace(/===/g, '==')
      .replace(/!==/g, '!=')
      .replace(/&&/g, 'and')
      .replace(/\|\|/g, 'or')
      .replace(/Math\.floor/g, 'floor')
      .replace(/\.push\(/g, '.append(')
      .replace(/\.shift\(\)/g, '.pop(0)')
      .replace(/\.slice\(\)/g, '.copy()')
      .replace(/\.length/g, '__LEN__')
      .replace(/(\w+)__LEN__/g, 'len($1)')
      .replace(/(\w+)\.at\(-1\)/g, '$1[-1]')

    line = line.replace(
      /^for \(let (\w+) = 0; \1 < len\((\w+)\); \1\+\+\)$/,
      'for $1 in range(len($2)):'
    )
    line = line.replace(
      /^for \(let (\w+) = 0; \1 < ([^)]+); \1\+\+\)$/,
      'for $1 in range($2):'
    )
    line = line.replace(
      /^for \(const (\w+) of (\w+)\)$/,
      'for $1 in $2:'
    )
    line = line.replace(/^while \((.*)\)$/, 'while $1:')
    line = line.replace(/^if \((.*)\) return (.*)$/, 'if $1: return $2')
    line = line.replace(/^if \((.*)\)$/, 'if $1:')
    line = line.replace(/^else if \((.*)\)$/, 'elif $1:')
    line = line.replace(/^else$/, 'else:')

    output.push(`${'  '.repeat(indent)}${line}`)

    if (opensBlock && !line.endsWith(':')) {
      output[output.length - 1] = `${output.at(-1)}:`
    }
    if (line.endsWith(':')) indent++
  }

  return output.join('\n')
}

function toJava(code: string) {
  return wrapStaticClass(toCStyle(code, 'java'), 'Java')
}

function toCpp(code: string) {
  return `#include <algorithm>
#include <vector>
using namespace std;

${wrapStaticClass(toCStyle(code, 'cpp'), 'C++')}`
}

function toC(code: string) {
  const body = toCStyle(code, 'c')
  const functionName = getFunctionName(code) ?? 'algorithm'

  return `#include <stdbool.h>
#include <stdlib.h>

// C reference version. Caller owns the returned array when allocation is used.
${body}

// Example entry point name: ${functionName}`
}

function toCSharp(code: string) {
  return `using System;
using System.Collections.Generic;

${wrapStaticClass(toCStyle(code, 'csharp'), 'C#')}`
}

function toCStyle(code: string, language: 'java' | 'cpp' | 'c' | 'csharp') {
  const variableKeyword = localVariableKeyword(language)

  return code
    .trim()
    .replace(/function\s+(\w+)\(([^)]*)\)(: [^{]+)? \{/g, (_, name: string, args: string) => {
      const staticPrefix = language === 'c' ? '' : 'static '
      return `${staticPrefix}${returnTypeFor(name, language)} ${name}(${toCStyleArgs(args, language)}) {`
    })
    .replace(/for \(let (\w+) =/g, 'for (int $1 =')
    .replace(/for \(const (\w+) of (\w+)\)/g, forEachExpression('$1', '$2', language))
    .replace(/\bconst\s+(\w+)\s*=\s*/g, `${variableKeyword} $1 = `)
    .replace(/\blet\s+(\w+)\s*=\s*/g, `${variableKeyword} $1 = `)
    .replace(/\blet\s+(\w+);/g, `${variableKeyword} $1;`)
    .replace(/: number\[\]/g, '')
    .replace(/: number/g, '')
    .replace(/: string/g, '')
    .replace(/: boolean/g, '')
    .replace(/: Node \| null/g, '')
    .replace(/: ListNode \| null/g, '')
    .replace(/\btrue\b/g, language === 'cpp' || language === 'c' ? 'true' : 'true')
    .replace(/\bfalse\b/g, language === 'cpp' || language === 'c' ? 'false' : 'false')
    .replace(/\bnull\b/g, language === 'c' ? 'NULL' : 'null')
    .replace(/\[\]/g, language === 'java' || language === 'csharp' ? 'new int[0]' : 'vector<int>()')
    .replace(/(\w+)\.length/g, lengthExpression('$1', language))
    .replace(/(\w+)\.slice\(\)/g, cloneExpression('$1', language))
    .replace(/(\w+)\.push\(([^)]+)\)/g, pushExpression('$1', '$2', language))
    .replace(/(\w+)\.pop\(\)/g, popExpression('$1', language))
    .replace(/(\w+)\.shift\(\)/g, shiftExpression('$1', language))
    .replace(/(\w+)\.at\(-1\)/g, lastExpression('$1', language))
    .replace(/Math\.floor/g, language === 'java' ? '(int)Math.floor' : language === 'csharp' ? '(int)Math.Floor' : 'floor')
}

function wrapStaticClass(body: string, label: string) {
  return `public class Solution {
  // ${label} reference implementation generated from the visualized algorithm.
${indentLines(body, 2)}
}`
}

function toPythonArgs(args: string) {
  return args
    .split(',')
    .map((arg) => arg.trim().replace(/: .+$/, ''))
    .filter(Boolean)
    .join(', ')
}

function toCStyleArgs(args: string, language: 'java' | 'cpp' | 'c' | 'csharp') {
  return args
    .split(',')
    .map((arg) => {
      const [name = 'input', type = 'number[]'] = arg.trim().split(/:\s*/)
      return `${mapType(type, language)} ${name.trim()}`
    })
    .filter(Boolean)
    .join(', ')
}

function mapType(type: string, language: 'java' | 'cpp' | 'c' | 'csharp') {
  const normalized = type.trim()

  if (normalized.includes('string[]')) {
    if (language === 'cpp') return 'vector<string>'
    if (language === 'c') return 'char**'
    if (language === 'csharp') return 'string[]'
    return 'String[]'
  }
  if (normalized.includes('string')) {
    if (language === 'cpp') return 'string'
    if (language === 'c') return 'char*'
    if (language === 'csharp') return 'string'
    return 'String'
  }
  if (normalized.includes('boolean')) {
    if (language === 'c' || language === 'csharp') return 'bool'
    return 'boolean'
  }
  if (normalized.includes('number[]')) {
    if (language === 'cpp') return 'vector<int>'
    if (language === 'c') return 'int*'
    if (language === 'csharp') return 'int[]'
    return 'int[]'
  }
  if (normalized.includes('Node') || normalized.includes('ListNode')) return normalized.replace(' | null', '')
  return language === 'csharp' ? 'int' : 'int'
}

function localVariableKeyword(language: 'java' | 'cpp' | 'c' | 'csharp') {
  if (language === 'cpp') return 'auto'
  if (language === 'c') return 'int'
  return 'var'
}

function returnTypeFor(name: string, language: 'java' | 'cpp' | 'c' | 'csharp') {
  const lowered = name.toLowerCase()
  if (lowered.startsWith('is') || lowered.startsWith('has')) return language === 'c' ? 'bool' : 'boolean'
  if (lowered.includes('search') || lowered.includes('peek')) return 'int'
  if (language === 'cpp') return 'vector<int>'
  if (language === 'c') return 'int*'
  return 'int[]'
}

function lengthExpression(name: string, language: 'java' | 'cpp' | 'c' | 'csharp') {
  if (language === 'cpp') return `${name}.size()`
  if (language === 'csharp') return `${name}.Length`
  if (language === 'c') return `${name}Length`
  return `${name}.length`
}

function cloneExpression(name: string, language: 'java' | 'cpp' | 'c' | 'csharp') {
  if (language === 'cpp') return `${name}`
  if (language === 'csharp') return `(int[])${name}.Clone()`
  if (language === 'c') return `${name}`
  return `${name}.clone()`
}

function pushExpression(name: string, value: string, language: 'java' | 'cpp' | 'c' | 'csharp') {
  if (language === 'cpp') return `${name}.push_back(${value})`
  if (language === 'csharp') return `${name}.Add(${value})`
  if (language === 'c') return `append(${name}, ${value})`
  return `${name}.add(${value})`
}

function popExpression(name: string, language: 'java' | 'cpp' | 'c' | 'csharp') {
  if (language === 'cpp') return `${name}.pop_back()`
  if (language === 'csharp') return `${name}.RemoveAt(${name}.Count - 1)`
  if (language === 'c') return `pop(${name})`
  return `${name}.remove(${name}.size() - 1)`
}

function shiftExpression(name: string, language: 'java' | 'cpp' | 'c' | 'csharp') {
  if (language === 'cpp') return `${name}.erase(${name}.begin())`
  if (language === 'csharp') return `${name}.RemoveAt(0)`
  if (language === 'c') return `shift(${name})`
  return `${name}.remove(0)`
}

function lastExpression(name: string, language: 'java' | 'cpp' | 'c' | 'csharp') {
  if (language === 'cpp') return `${name}.back()`
  if (language === 'csharp') return `${name}[${name}.Count - 1]`
  if (language === 'c') return `${name}[${name}Length - 1]`
  return `${name}.get(${name}.size() - 1)`
}

function forEachExpression(value: string, collection: string, language: 'java' | 'cpp' | 'c' | 'csharp') {
  if (language === 'cpp') return `for (int ${value} : ${collection})`
  if (language === 'csharp') return `foreach (int ${value} in ${collection})`
  if (language === 'c') return `for (int ${value}Index = 0; ${value}Index < ${collection}Length; ${value}Index++)`
  return `for (int ${value} : ${collection})`
}

function indentLines(value: string, spaces: number) {
  const prefix = ' '.repeat(spaces)
  return value
    .split('\n')
    .map((line) => (line ? `${prefix}${line}` : line))
    .join('\n')
}

function toSnakeCase(value: string) {
  return value.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

function getFunctionName(code: string) {
  return code.match(/function\s+(\w+)/)?.[1]
}
