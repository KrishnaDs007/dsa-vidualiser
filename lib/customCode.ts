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

export type CustomCodeLanguageId = (typeof CUSTOM_CODE_LANGUAGES)[number]['id']

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
  return CUSTOM_CODE_LANGUAGES.find((language) => language.id === id)?.sample ?? ''
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

function getRecursiveName(normalized: string, language: CustomCodeLanguageId) {
  if (language === 'python') {
    return normalized.match(/def\s+([a-z0-9_]+)/)?.[1]
  }

  return (
    normalized.match(/function\s+([a-z0-9_]+)/)?.[1] ??
    normalized.match(/\b(?:int|void|bool|string|double|float|long)\s+([a-z0-9_]+)\s*\(/)?.[1]
  )
}
