/**
 * Test homeContainer sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { takeLatest, call, put } from 'redux-saga/effects';
import { getTracks } from '@services/repoApi';
import { apiResponseGenerator, apiResponseGeneratorTrack } from '@utils/testUtils';
import trackSaga, { getTrackDetails } from '../saga';
import { trackTypes } from '../reducer';

describe('Track saga tests', () => {
  const generator = trackSaga();
  const trackName = 'react-template';
  let getTrackDetailsGenerator = getTrackDetails({ trackName });

  it('should start task to watch for REQUEST_GET_TRACK_DETAILS action', () => {
    expect(generator.next().value).toEqual(takeLatest(trackTypes.REQUEST_GET_TRACK_DETAILS, getTrackDetails));
  });
  it('should ensure that the action FAILURE_GET_TRACK_DETAILS is dispatched when the api call fails', () => {
    const res = getTrackDetailsGenerator.next().value;
    expect(res).toEqual(call(getTracks, trackName));
    const errorResponse = {
      errorMessage: 'There was an error while fetching repo informations.'
    };
    expect(getTrackDetailsGenerator.next(apiResponseGenerator(false, errorResponse)).value).toEqual(
      put({
        type: trackTypes.FAILURE_GET_TRACK_DETAILS,
        error: errorResponse
      })
    );
  });
  it('should ensure that the action SUCCESS_GET_TRACK_DETAILS is dispatched when the api call succeeds', () => {
    getTrackDetailsGenerator = getTrackDetails({ trackName });
    const res = getTrackDetailsGenerator.next().value;
    expect(res).toEqual(call(getTracks, trackName));
    const tracksResponse = {
      resultCount: 1,
      results: [{ trackName: trackName }]
    };
    expect(getTrackDetailsGenerator.next(apiResponseGeneratorTrack(200, tracksResponse)).value).toEqual(
      put({
        type: trackTypes.SUCCESS_GET_TRACK_DETAILS,
        data: tracksResponse
      })
    );
  });
});
