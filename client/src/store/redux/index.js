import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user";
import roleReducer from "./slices/role";
import permissionReducer from "./slices/permissions";
import truckReducer from "./slices/truck";
import barcodeReducer from "./slices/barcode";
import searchReducer from "./slices/search";
import filterReducer from "./slices/filter";
import storeReducer from "./slices/store";
import marketplaceReducer from "./slices/marketplace";
import listingReducer from "./slices/listing";

// import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import persistStore from "redux-persist/es/persistStore";

const persistConfig = {
  key: "cart",
  storage,
  // stateReconciler: autoMergeLevel2,
  whitelist: ["cart", "user"],
};

const rootReducer = combineReducers({
  user: userReducer,
  role: roleReducer,
  permission: permissionReducer,
  truck: truckReducer,
  barcode: barcodeReducer,
  search: searchReducer,
  filter: filterReducer,
  store: storeReducer,
  marketplace: marketplaceReducer,
  listing: listingReducer
});

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// const store = configureStore({
//   reducer: persistedReducer,
// });

const store = configureStore({
  reducer: rootReducer,
});

export default store;
// export const persistor = persistStore(store);