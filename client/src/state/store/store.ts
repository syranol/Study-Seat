import { createStore } from "redux";
import rootReducer from "../reducers/root.reducer";

const store = createStore(rootReducer);
export default store;

/**
 * Store state in localStorage for persistance
 */
store.subscribe(() => {
    localStorage.setItem("studySeatState", JSON.stringify(store.getState()));
});

/**
 * For debugging redux store, comment out if not needed
 */
store.subscribe(() => console.table(store.getState()));