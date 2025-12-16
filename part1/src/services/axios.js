import axios from "axios";

const baseUrl = "http://localhost:3001/";

const url = (path) => {
  return `${baseUrl}${path}`;
};

const getAll = (path) => {
  return axios.get(url(path));
};

const create = (path, newObject) => {
  return axios.post(url(path), newObject);
};

const update = (path, id, newObject) => {
  return axios.put(`${url(path)}/${id}`, newObject);
};

export default { getAll, create, update };
