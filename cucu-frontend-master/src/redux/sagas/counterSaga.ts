import { takeLatest, put } from "redux-saga/effects";

function* increaseCounterAsync() {
  try {
    yield put({
      type: "INCREASE_COUNTER_ASYNC",
    });
  } catch (error) {
    //console.log(error);
  }
}

export function* watchIncreaseCounter() {
  yield takeLatest("INCREASE_COUNTER", increaseCounterAsync);
}

function* decreaseCounter() {
  try {
    yield put({
      type: "DECREASE_COUNTER_ASYNC",
    });
  } catch (error) {
    //console.log(error);
  }
}

export function* watchDecreaseCounter() {
  yield takeLatest("DECREASE_COUNTER", decreaseCounter);
}
