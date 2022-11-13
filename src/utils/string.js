export class KMPStringMatch {
  constructor(pattern) {
    this.pattern = pattern;
    this.buildPrefixArray(this.pattern);
  }

  buildPrefixArray() {
    let pattern = this.pattern;

    if (!pattern || pattern?.length <= 0) {
      this.prefixArray = [];
      return;
    }

    let prefixArray = [0];

    for (let i = 1, j = 0; i < pattern.length; ) {
      if (pattern.charAt(i) === pattern.charAt(j)) {
        prefixArray[i++] = j + 1;
        j++;
      } else {
        if (j === 0) {
          prefixArray[i++] = 0;
        } else {
          j = prefixArray[j - 1];
        }
      }
    }

    this.prefixArray = prefixArray;
  }

  setPattern(pattern) {
    this.pattern = pattern;
    this.buildPrefixArray();
  }

  match(str, matchAll = false) {
    let matches = [];
    const prefArr = this.prefixArray;
    for (let i = 0, j = 0; i < str.length; ) {
      if (this.pattern.charAt(j) === str.charAt(i)) {
        i++;
        j++;

        if (j === this.pattern.length) {
          matches.push(i - j);
          if (matchAll === false) {
            return matches;
          }

          j = 0;
        }
      } else {
        if (j === 0) {
          i++;
        } else {
          j = prefArr[j - 1];
        }
      }
    }

    return matches;
  }
}
