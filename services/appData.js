const data = {
  lastMessage: null,
  user: null,
  status: null,
  step: 0,
  description: null,
  link: null,
};

function isAllDataSet() {
  return getData("description") !== null && getData("link") !== "null";
}

function resetData() {
  for (let prop in data) {
    if (prop === "step") data[prop] = 0;
    else data[prop] = null;
  }
}

function getData(name) {
  return data[name];
}

function setData(name, value) {
  if (!data.hasOwnProperty(name) || value === "undefined") return false;

  data[name] = value;
  return true;
}

export { getData, setData, resetData, isAllDataSet };
