export const CUSTOM_CODE_LANGUAGES = [
  {
    id: 'javascript',
    label: 'JavaScript / Node.js',
    sample: `function twoSum(nums, target) {
  const seen = new Map()

  for (let i = 0; i < nums.length; i++) {
    const pair = target - nums[i]
    if (seen.has(pair)) return [seen.get(pair), i]
    seen.set(nums[i], i)
  }

  return []
}`
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    sample: `function binarySearch(nums: number[], target: number): number {
  let left = 0
  let right = nums.length - 1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    if (nums[mid] === target) return mid
    if (nums[mid] < target) left = mid + 1
    else right = mid - 1
  }

  return -1
}`
  },
  {
    id: 'python',
    label: 'Python',
    sample: `def max_subarray(nums):
    best = nums[0]
    current = nums[0]

    for value in nums[1:]:
        current = max(value, current + value)
        best = max(best, current)

    return best`
  },
  {
    id: 'java',
    label: 'Java',
    sample: `int linearSearch(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] == target) {
            return i;
        }
    }

    return -1;
}`
  },
  {
    id: 'cpp',
    label: 'C++',
    sample: `int countPairs(vector<int>& nums, int target) {
    unordered_set<int> seen;
    int pairs = 0;

    for (int value : nums) {
        if (seen.count(target - value)) pairs++;
        seen.insert(value);
    }

    return pairs;
}`
  },
  {
    id: 'c',
    label: 'C',
    sample: `int sum_array(int nums[], int length) {
    int total = 0;

    for (int i = 0; i < length; i++) {
        total += nums[i];
    }

    return total;
}`
  },
  {
    id: 'csharp',
    label: 'C#',
    sample: `int FindPeak(int[] nums) {
    for (int i = 1; i < nums.Length - 1; i++) {
        if (nums[i] > nums[i - 1] && nums[i] > nums[i + 1]) {
            return i;
        }
    }

    return -1;
}`
  }
] as const

export const CUSTOM_CODE_TEMPLATES = [
  {
    id: 'two-sum',
    title: 'Two Sum Hash Map',
    language: 'javascript',
    code: getLanguageSampleFromList('javascript')
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    language: 'typescript',
    code: getLanguageSampleFromList('typescript')
  },
  {
    id: 'kadane',
    title: 'Kadane Maximum Subarray',
    language: 'python',
    code: getLanguageSampleFromList('python')
  },
  {
    id: 'linear-search',
    title: 'Linear Search',
    language: 'java',
    code: getLanguageSampleFromList('java')
  },
  {
    id: 'hash-set-pairs',
    title: 'Hash Set Pair Count',
    language: 'cpp',
    code: getLanguageSampleFromList('cpp')
  }
] as const

export type CustomCodeLanguageId = (typeof CUSTOM_CODE_LANGUAGES)[number]['id']
export type CustomCodeTemplateId = (typeof CUSTOM_CODE_TEMPLATES)[number]['id']

export function isCustomCodeLanguageId(
  value?: string
): value is CustomCodeLanguageId {
  return Boolean(CUSTOM_CODE_LANGUAGES.some((language) => language.id === value))
}

export function getLanguageLabel(id: string) {
  return (
    CUSTOM_CODE_LANGUAGES.find((language) => language.id === id)?.label ??
    'Unknown language'
  )
}

export function getLanguageSample(id: CustomCodeLanguageId) {
  return getLanguageSampleFromList(id)
}

export function getCustomCodeTemplate(id: CustomCodeTemplateId) {
  return CUSTOM_CODE_TEMPLATES.find((template) => template.id === id)
}

export interface ComplexityFactor {
  label: string
  value: string
  level: 'low' | 'medium' | 'high'
  description: string
}

export function analyzeComplexity(code: string, language: CustomCodeLanguageId) {
  const normalized = code.toLowerCase()
  const loopCount = (
    normalized.match(/\b(for|while|foreach|map|filter|reduce)\b/g) ?? []
  ).length
  const recursiveName = getRecursiveName(normalized, language)
  const recursiveCalls = recursiveName
    ? (normalized.match(new RegExp(`\\b${recursiveName}\\s*\\(`, 'g')) ?? [])
        .length - 1
    : 0
  const divideSignal = /\/\s*2|>>\s*1|mid|binary|half/.test(normalized)
  const collectionSignal =
    /\b(new map|new set|unordered_map|unordered_set|hashmap|hashset|dict|set\(|list\(|vector|arraylist|\[\]|{}|push\(|append\(|add\(|insert\()\b/.test(
      normalized
    )
  const matrixSignal = /\bmatrix|grid|rows|cols|2d\b/.test(normalized)

  let time = 'O(1)'
  let timeReason = 'No clear loop or recursion signal was detected.'

  if (recursiveCalls > 1 && divideSignal) {
    time = 'O(n log n)'
    timeReason =
      'Recursive branching plus divide-style signals suggest logarithmic layers over linear work.'
  } else if (recursiveCalls > 0 && divideSignal) {
    time = 'O(log n)'
    timeReason = 'A recursive divide signal suggests logarithmic progression.'
  } else if (loopCount >= 2) {
    time = 'O(n^2)'
    timeReason = 'Multiple iteration signals suggest nested or repeated linear scans.'
  } else if (loopCount === 1) {
    time = 'O(n)'
    timeReason = 'One primary iteration signal suggests linear traversal.'
  } else if (recursiveCalls > 0) {
    time = 'O(n)'
    timeReason = 'Recursion without a divide signal is treated as linear by default.'
  }

  let space = 'O(1)'
  let spaceReason = 'No growing collection or recursion stack signal was detected.'

  if (matrixSignal) {
    space = 'O(n^2)'
    spaceReason = 'Matrix or grid-shaped terms suggest two-dimensional storage.'
  } else if (collectionSignal) {
    space = 'O(n)'
    spaceReason = 'Growing collection signals suggest linear auxiliary storage.'
  } else if (recursiveCalls > 0) {
    space = divideSignal ? 'O(log n)' : 'O(n)'
    spaceReason = 'Recursive calls add stack usage even without explicit collections.'
  }

  return {
    time,
    space,
    timeReason,
    spaceReason,
    confidence: calculateConfidence({
      loopCount,
      recursiveCalls,
      divideSignal,
      collectionSignal,
      matrixSignal
    }),
    factors: [
      {
        label: 'Iteration',
        value: String(loopCount),
        level: loopCount >= 2 ? 'high' : loopCount === 1 ? 'medium' : 'low',
        description:
          loopCount >= 2
            ? 'Repeated iteration signals often increase time cost.'
            : loopCount === 1
              ? 'One traversal usually means linear time.'
              : 'No direct loop signal was found.'
      },
      {
        label: 'Recursion',
        value: String(Math.max(recursiveCalls, 0)),
        level: recursiveCalls > 1 ? 'high' : recursiveCalls === 1 ? 'medium' : 'low',
        description:
          recursiveCalls > 0
            ? 'Recursive calls add call-stack cost and may affect time.'
            : 'No recursive self-call signal was found.'
      },
      {
        label: 'Divide',
        value: divideSignal ? 'Yes' : 'No',
        level: divideSignal ? 'medium' : 'low',
        description: divideSignal
          ? 'Half, mid, binary, or divide-by-two signals suggest logarithmic progress.'
          : 'No divide-and-conquer signal was found.'
      },
      {
        label: 'Storage',
        value: matrixSignal ? 'Grid' : collectionSignal ? 'List' : 'Fixed',
        level: matrixSignal ? 'high' : collectionSignal ? 'medium' : 'low',
        description: matrixSignal
          ? 'Matrix-like terms suggest two-dimensional storage.'
          : collectionSignal
            ? 'Collection usage suggests extra linear storage.'
            : 'No growing auxiliary storage signal was found.'
      }
    ] satisfies ComplexityFactor[],
    signals: [
      `${loopCount} loop or iterator signal${loopCount === 1 ? '' : 's'}`,
      `${Math.max(recursiveCalls, 0)} recursive call signal${recursiveCalls === 1 ? '' : 's'}`,
      divideSignal ? 'Divide-and-conquer signal present' : 'No divide signal',
      collectionSignal
        ? 'Auxiliary collection signal present'
        : 'No growing collection signal',
      `Language profile: ${getLanguageLabel(language)}`
    ]
  }
}

export interface CustomCodeTraceStep {
  lineNumber: number
  line: string
  codePrefix: string
  result: ReturnType<typeof analyzeComplexity>
  note: string
}

export function createCustomCodeTrace(
  code: string,
  language: CustomCodeLanguageId
): CustomCodeTraceStep[] {
  const lines = code.split('\n')
  const meaningfulLines = lines
    .map((line, index) => ({ line, index }))
    .filter(({ line }) => line.trim().length > 0)

  if (meaningfulLines.length === 0) {
    return [
      {
        lineNumber: 1,
        line: '',
        codePrefix: '',
        result: analyzeComplexity('', language),
        note: 'Write or paste code to begin step-by-step complexity tracing.'
      }
    ]
  }

  return meaningfulLines.map(({ line, index }) => {
    const codePrefix = lines.slice(0, index + 1).join('\n')
    const result = analyzeComplexity(codePrefix, language)

    return {
      lineNumber: index + 1,
      line,
      codePrefix,
      result,
      note: createTraceNote(line, result)
    }
  })
}

function createTraceNote(
  line: string,
  result: ReturnType<typeof analyzeComplexity>
) {
  const normalized = line.trim().toLowerCase()

  if (/\b(for|while|foreach|map|filter|reduce)\b/.test(normalized)) {
    return `This line introduces iteration, so the current time estimate is ${result.time}.`
  }

  if (/\b(new map|new set|unordered_map|unordered_set|hashmap|hashset|dict|set\(|list\(|vector|arraylist|\[\]|{}|push\(|append\(|add\(|insert\()\b/.test(normalized)) {
    return `This line suggests growing storage, so the current space estimate is ${result.space}.`
  }

  if (/\/\s*2|>>\s*1|mid|binary|half/.test(normalized)) {
    return `This line suggests halving or midpoint logic, so logarithmic behavior may apply.`
  }

  return `After this line, the current estimate is ${result.time} time and ${result.space} space.`
}

function calculateConfidence({
  loopCount,
  recursiveCalls,
  divideSignal,
  collectionSignal,
  matrixSignal
}: {
  loopCount: number
  recursiveCalls: number
  divideSignal: boolean
  collectionSignal: boolean
  matrixSignal: boolean
}) {
  const signalCount = [
    loopCount > 0,
    recursiveCalls > 0,
    divideSignal,
    collectionSignal,
    matrixSignal
  ].filter(Boolean).length

  if (signalCount >= 3) return 88
  if (signalCount === 2) return 74
  if (signalCount === 1) return 62
  return 45
}

function getRecursiveName(normalized: string, language: CustomCodeLanguageId) {
  if (language === 'python') {
    return normalized.match(/def\s+([a-z0-9_]+)/)?.[1]
  }

  return (
    normalized.match(/function\s+([a-z0-9_]+)/)?.[1] ??
    normalized.match(/\b(?:int|void|bool|string|double|float|long)\s+([a-z0-9_]+)\s*\(/)?.[1]
  )
}

function getLanguageSampleFromList(id: CustomCodeLanguageId) {
  return CUSTOM_CODE_LANGUAGES.find((language) => language.id === id)?.sample ?? ''
}
