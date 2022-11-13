// Utility Function to retry an async request N times
// Can be modified to fix at any number of retries by passing N
export const retryNTimes = (n) => (fn) => {
  let tries = 0;

  return async (...args) => {
    while (tries < n) {
      try {
        const result = await fn(...args);
        return result;
      } catch (e) {
        tries++;
      }
    }
    return null;
  };
};

// Utility function to transform any object to desired shape recursively
// Params needed
// 1. masterData - dataObject on which transformation needs to be performed.
// 2. transformConfig - Config used for transformation.
// - fieldsToCopy: Array of fields to copy as it is. Pass a '*' in the array for copying all fields as they are.
// - fieldsConfig: An object of configs used to transform each key in the masterData. Each fieldConfig can have the following configuration options.
//     - toKey: The new key name which should be used in the new transformed object.
//     - transformConfig: transformConfig to be used to transform object recursively.
//     - defaulVal: Default value to be used in case no value is present in masterData.
//     - transformFn: Transform function to be used to transform the value and store in the transformed object. fn (valueAtKey, masterData) => newValue
export const transformObject = (masterData, transformConfig = {}) => {
  const { fieldsToCopy = [], fieldsConfig = {} } = transformConfig;
  const data = JSON.parse(JSON.stringify(masterData));
  let keysToIterate;

  if (fieldsToCopy.includes("*")) {
    keysToIterate = Object.keys(data);
  } else {
    keysToIterate = fieldsToCopy;
  }

  const newData = keysToIterate.reduce((acc, key) => {
    const { toKey, transformConfig, defaultVal, transformFn } =
      fieldsConfig?.[key] ?? {};
    let newVal;
    if (data.hasOwnProperty(key)) {
      if (typeof transformFn === "function") {
        newVal = transformFn(data[key], data);
      } else if (typeof data[key] === "object") {
        if (transformConfig) {
          newVal = transformObject(data[key], transformConfig);
        } else {
          newVal = data[key];
        }
      } else {
        newVal = data[key];
      }
    } else {
      newVal = defaultVal;
    }

    if (toKey === "..." && typeof newVal === "object") {
      acc = {
        ...acc,
        ...newVal,
      };
    } else if (toKey) {
      acc[toKey] = newVal;
    } else {
      acc[key] = newVal;
    }

    return acc;
  }, {});

  return newData;
};

export const stopPropagation = (e) => {
  e.stopPropagation();
  e.nativeEvent.stopImmediatePropagation();
};
