import { put, call, takeLatest } from 'redux-saga/effects';
import { getRepos, getTracks } from '@services/repoApi';
import { trackTypes, trackCreators } from './reducer';

const { REQUEST_GET_TRACK_DETAILS } = trackTypes;
const { successGetTrackDetails, failureGetTrackDetails } = trackCreators;
export function* getTrackDetails(action) {
  const response = yield call(getTracks, action.trackName);
  const { data, status } = response;
  if (status === 200) {
    yield put(successGetTrackDetails(data));
  } else {
    yield put(failureGetTrackDetails(data));
  }
}
// Individual exports for testing
export default function* trackSaga() {
  yield takeLatest(REQUEST_GET_TRACK_DETAILS, getTrackDetails);
}
