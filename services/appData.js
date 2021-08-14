const data = {
  lastMessage: null,
  currentUserID: null,
  status: null,
  step: 0,
  description: null,
  link: null,
};

function getData(name) {
  return data[name];
}

function setData(name, value) {
  if (!data.hasOwnProperty(name) || value === "undefined") return false;

  data[name] = value;
  return true;
}

export { getData, setData };
