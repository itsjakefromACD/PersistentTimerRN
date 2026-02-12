import * as SecureStore from "expo-secure-store";

async function setValue(key, value) {
  await SecureStore.setItemAsync(key, value);
}

async function getValue(key) {
  return await SecureStore.getItemAsync(key);
}

async function removeValue(key) {
  await SecureStore.deleteItemAsync(key);
}

const keys = {
  startTime: "start_time",
};

export default {
  keys,
  removeValue,
  getValue,
  setValue,
};
