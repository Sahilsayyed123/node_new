// ! length of longest Substring

function lengthOfLongestSubstring(s) {
  let left = 0;
  let maxLen = 0;
  let charIndexMap = new Map(); // character -> last index seen

  for (let right = 0; right < s.length; right++) {
    let currentChar = s[right];

    if (
      charIndexMap.has(currentChar) &&
      charIndexMap.get(currentChar) >= left
    ) {
      left = charIndexMap.get(currentChar) + 1;
    }

    charIndexMap.set(currentChar, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}
// ! Create Linked List

class LinkedListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}
const n1 = new LinkedListNode(1);
const n2 = new LinkedListNode(2);
const n3 = new LinkedListNode(3);
n1.next = n2;
n2.next = n3;
console.log(n1);
// ! Reverse a linked list

function reverseLinkedList(head) {
  prev = null;
  while (head) {
    let next = head.next;
    head.next = prev;
    prev = head;
    head = next;
  }
  return prev;
}

// ! Check if Palindrome

function isPalindrome(word) {
  let left = 0;
  let right = word.length - 1;
  while (left < right) {
    if (word[left] !== word[right]) {
      return false;
    }
    left++;
    right--;
  }
  return true;
}

// ! Most frquent Character in a string

function mostFrequentChar(str) {
  const map = {};
  for (let char of str) {
    map[char] = (map[char] || 0) + 1;
  }
  console.log(map);
  let maxChar = "",
    maxCount = 0;
  for (let char in map) {
    if (map[char] > maxCount) {
      maxCount = map[char];
      maxChar = char;
    }
  }
  return maxChar;
}
mostFrequentChar("hello world"); // returns 'l'

// ! two Sums

var twoSum = function (nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[j] === target - nums[i]) {
        console.log([i, j]);
        return [i, j];
      }
    }
  }
  // Return an empty array if no solution is found
  return [];
};
twoSum([2, 4, 6, 8], 10);

// ! Optimized two Sums using a Map
var twoSum = function (nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    map.set(nums[i], i);
  }
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement) && map.get(complement) !== i) {
      return [i, map.get(complement)];
    }
  }
  // If no valid pair is found, return an empty array
  return [];
};

// ! Most water in a container
function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let maxWater = 0;

  while (left < right) {
    const width = right - left;
    const water = Math.min(height[left], height[right]) * width;
    maxWater = Math.max(maxWater, water);

    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }

  return maxWater;
}

// Sorting Algorithms

// ! Bubble Sort
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

// ! Insertion Sort
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;

    // Move elements greater than key one position ahead
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}

// ! Merge Sort
function mergeSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  let result = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }

  // Add remaining elements
  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

// ! Quick Sort
function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const pivot = arr[Math.floor(arr.length / 2)];
  const less = [];
  const equal = [];
  const greater = [];

  for (let element of arr) {
    if (element < pivot) {
      less.push(element);
    } else if (element > pivot) {
      greater.push(element);
    } else {
      equal.push(element);
    }
  }

  return [...quickSort(less), ...equal, ...quickSort(greater)];
}

// Alternative in-place Quick Sort implementation
function quickSortInPlace(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pivotIndex = partition(arr, low, high);
    quickSortInPlace(arr, low, pivotIndex - 1);
    quickSortInPlace(arr, pivotIndex + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

function isValid(s) {
  const stack = [];
  const map = {
    ")": "(",
    "]": "[",
    "}": "{",
  };

  for (let char of s) {
    if (char === "(" || char === "[" || char === "{") {
      stack.push(char);
    } else {
      if (stack.length === 0 || stack.pop() !== map[char]) {
        return false;
      }
    }
  }

  return stack.length === 0;
}
