import { put, call, takeLatest } from 'redux-saga/effects';
import { getTracks, getTrackById } from '@services/repoApi';
import { trackTypes, trackCreators } from './reducer';

const { REQUEST_GET_TRACK_DETAILS, REQUEST_GET_TRACK_DETAILS_BY_ID } = trackTypes;
const { successGetTrackDetails, failureGetTrackDetails, successGetSingleTrackDetails } = trackCreators;
export function* getTrackDetails(action) {
  const response = yield call(getTracks, action.trackName);
  const { data, status } = response;
  if (status === 200) {
    yield put(successGetTrackDetails(data));
  } else {
    yield put(failureGetTrackDetails(data));
  }
}
export function* getTrackDetailsById(action) {
  const response = yield call(getTrackById, action.trackId);
  const { data, status } = response;
  if (status === 200) {
    yield put(successGetSingleTrackDetails(data));
  } else {
    yield put(failureGetTrackDetails(data));
  }
}
// Individual exports for testing
export default function* trackSaga() {
  yield takeLatest(REQUEST_GET_TRACK_DETAILS, getTrackDetails);
  yield takeLatest(REQUEST_GET_TRACK_DETAILS_BY_ID, getTrackDetailsById);
}
