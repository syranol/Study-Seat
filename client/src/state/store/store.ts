import { createStore } from "redux";
import rootReducer from "../reducers/root.reducer";

const store = createStore(rootReducer);
export default store;

/**
 * For debugging, comment out if not needed
 */
store.subscribe(() => console.table(store.getState()));