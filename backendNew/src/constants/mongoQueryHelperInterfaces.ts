import { Model, PopulateOptions, UpdateQuery } from 'mongoose';

export interface GetDataFromIdParams {
  model: Model<any>;
  id: string;
}

export interface GetOneDataByFilterParams {
  model: Model<any>;
  filter: any;
  single?: boolean;
}

export interface GetAllDataParams {
  model: Model<any>;
  populate?: PopulateOptions;
  select?: Record<string, number>;
}

export interface DeleteDataParams {
  model: Model<any>;
  allData?: boolean;
  id?: string | null;
}

export interface UpdateDataParams {
  model: Model<any>;
  id: string;
  data: UpdateQuery<any>;
}

export interface PostDataParams {
  model: Model<any>;
  data: Record<string, unknown>;
}
