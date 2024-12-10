import { IMAGES_ACTION_TYPES } from './images.types';

const createAction = (type, payload) => ({ type, payload });


export const setData = (AllData) => {
    return createAction(IMAGES_ACTION_TYPES.SET_DATA, AllData);
  };

export const setPage = (page) => 
    createAction(IMAGES_ACTION_TYPES.SET_PAGE,page);

export const setCategory = (category) => 
    createAction(IMAGES_ACTION_TYPES.SET_CATEGORY,category);
