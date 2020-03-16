import profile from './profile.json';

export function getType(key, value) {
  const result = profile.types[key].values[value];
  return result ? result.valueName : `${key}_${value}`;
}

export function getTypeId(key, name) {
  return profile.types[key].names[name];
}

export function getMessage(type) {
  const result = profile.messages[type];
  return result && result.fields;
}

export function getMessageId(type) {
  return profile.messages[type].fields;
}
