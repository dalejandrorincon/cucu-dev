import { all, fork } from "redux-saga/effects";
import { watchIncreaseCounter, watchDecreaseCounter } from "./counterSaga";

export function* rootSaga() {
  yield all([fork(watchIncreaseCounter), fork(watchDecreaseCounter)]);
}
