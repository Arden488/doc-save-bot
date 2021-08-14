const data = {
  lastFileOrLink: null,
  currentUserID: null,
  status: null,
  stage: 0,
  savedData: {},
};

function getData(name) {
  return data[name];
}

function setData(name, value) {
  if (!data.hasOwnProperty(name) || !value) return false;

  data[name] = value;
  return true;
}

export { getData, setData };
