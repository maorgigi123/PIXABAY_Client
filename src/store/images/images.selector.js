export const selectDataByCategory = (state) => state.images.dataByCategory || {};
export const selectPage = (state) => state.images.page || 0;
export const selectCategory = (state) => state.images.category || 'sport';