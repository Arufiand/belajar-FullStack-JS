'use strict';

import {
  DeleteDataParams,
  GetAllDataParams,
  GetDataFromIdParams,
  GetOneDataByFilterParams,
  PostDataParams,
  UpdateDataParams
} from '../constants/mongoQueryHelperInterfaces';

const getDataFromId = async ({ model, id }: GetDataFromIdParams) => {
  return model.findById(id);
};

const getOneDataByFilter = async ({
  model,
  filter,
  single = false
}: GetOneDataByFilterParams) => {
  return single ? await model.findOne(filter) : await model.find(filter);
};

const getAllData = async ({ model, populate, select }: GetAllDataParams) => {
  let query = model.find({});
  if (populate) {
    query = query.populate(populate);
  }
  if (select) {
    query = query.select(select);
  }
  return query;
};

const deleteData = async ({
  allData = false,
  model,
  id = null
}: DeleteDataParams) => {
  return allData ? await model.deleteMany() : await model.findByIdAndDelete(id);
};

const updateData = async ({ model, id, data }: UpdateDataParams) => {
  return model.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true
  });
};

const postData = async ({ model, data }: PostDataParams) => {
  const newDoc = new model(data);
  return await newDoc.save();
};

export {
  getDataFromId,
  getOneDataByFilter,
  getAllData,
  deleteData,
  updateData,
  postData
};
