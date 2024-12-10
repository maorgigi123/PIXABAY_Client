import { combineReducers } from "redux";

import { imagesReducer } from "./images/images.reducer";

export const rootReducer = combineReducers({
    images : imagesReducer,
});