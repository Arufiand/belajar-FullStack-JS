'use strict';

const getDataFromId = async ({ model, id }) => {
  return await model.findById(id);
};

const getOneDataByFilter = async ({ model, filter, single = false }) => {
  return single ? await model.findOne(filter) : await model.find(filter);
};

const getAllData = async ({ model, populate, select }) => {
  let query = model.find({});
  if (populate) {
    query = query.populate(populate);
  }
  if (select) {
    query = query.select(select);
  }
  return await query;
};

const deleteData = async ({ model, id }) => {
  return await model.findByIdAndDelete(id);
};

const updateData = async ({ model, id, data }) => {
  return await model.findByIdAndUpdate(id, data, {});
};

const postData = async ({ model, data }) => {
  const newDoc = new model(data);
  return await newDoc.save();
};

module.exports = {
  getDataFromId,
  getOneDataByFilter,
  getAllData,
  deleteData,
  updateData,
  postData
};
