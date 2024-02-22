import { trackReducer, initialState, trackTypes } from '../reducer';

describe('Tracks reducer tests', () => {
  let state;
  beforeEach(() => {
    state = initialState;
  });
  it('should return the initial state', () => {
    expect(trackReducer(undefined, {})).toEqual(state);
  });

  it('should return the initial state when an action of type REQUEST_GET_TRACK_DETAILS is dispatched', () => {
    const trackName = 'Mohammed Ali Chherawalla';
    const expectedResult = { ...state, trackName };
    expect(
      trackReducer(state, {
        type: trackTypes.REQUEST_GET_TRACK_DETAILS,
        trackName
      })
    ).toEqual(expectedResult);
  });
  it('should ensure that the track data is present and Loading = false when SUCCESS_GET_TRACK_DETAILS is dispatched', () => {
    const data = { trackName: 'Mohammed Ali Chherawalla' };
    const expectedResult = { ...state, tracksData: data };
    expect(
      trackReducer(state, {
        type: trackTypes.SUCCESS_GET_TRACK_DETAILS,
        data
      })
    ).toEqual(expectedResult);
  });
  it('should ensure that the tracksError has some data and Loading = false when FAILURE_GET_TRACK_DETAILS is dispatched', () => {
    const error = 'something_went_wrong';
    const expectedResult = { ...state, tracksError: error };
    expect(
      trackReducer(state, {
        type: trackTypes.FAILURE_GET_TRACK_DETAILS,
        error
      })
    ).toEqual(expectedResult);
  });

  it('should return the initial state when CLEAR_TRACK_DETAILS is dispatched', () => {
    expect(
      trackReducer(state, {
        type: trackTypes.CLEAR_TRACK_DETAILS
      })
    ).toEqual(initialState);
  });
});
