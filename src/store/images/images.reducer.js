import { IMAGES_ACTION_TYPES } from './images.types';

const initialState = {
  dataByCategory: {},
  page: 1,
  category: 'sport',
};

export const imagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case IMAGES_ACTION_TYPES.SET_DATA: {
      const { category, data, page } = action.payload;
      const updatedDataByCategory = { ...state.dataByCategory };

      // Ensure the category exists in the state
      if (!updatedDataByCategory[category]) {
        updatedDataByCategory[category] = {};
      }

      // Overwrite data for the current page or add it
      updatedDataByCategory[category][page] = data;

      return {
        ...state,
        dataByCategory: updatedDataByCategory,
      };
    }

    case IMAGES_ACTION_TYPES.SET_PAGE:
      return { ...state, page: action.payload };

    case IMAGES_ACTION_TYPES.SET_CATEGORY:
      return { ...state, category: action.payload, page: 1 }; // Reset to page 1 when category changes

    default:
      return state;
  }
};
