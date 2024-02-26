import produce from 'immer';
import { createActions } from 'reduxsauce';
import get from 'lodash/get';

export const { Types: trackTypes, Creators: trackCreators } = createActions({
  requestGetTrackDetails: ['trackName'],
  successGetTrackDetails: ['data'],
  failureGetTrackDetails: ['error'],
  requestGetTrackDetailsById: ['trackId'],
  successGetSingleTrackDetails: ['singledata'],

  clearTrackDetails: {}
});
export const initialState = { trackName: null, tracksData: {}, tracksError: null, trackId: null, singletrackData: {} };

export const trackReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case trackTypes.REQUEST_GET_TRACK_DETAILS:
        draft.trackName = action.trackName;
        break;
      case trackTypes.CLEAR_TRACK_DETAILS:
        draft.trackName = null;
        draft.tracksError = null;
        draft.tracksData = {};
        draft.trackId = null;
        draft.singletrackData = {};
        break;
      case trackTypes.SUCCESS_GET_TRACK_DETAILS:
        draft.tracksData = action.data;
        break;
      case trackTypes.FAILURE_GET_TRACK_DETAILS:
        draft.tracksError = get(action.error, 'message', 'something_went_wrong');
        break;
      case trackTypes.REQUEST_GET_TRACK_DETAILS_BY_ID:
        draft.trackId = action.trackId;
        break;
      case trackTypes.SUCCESS_GET_SINGLE_TRACK_DETAILS:
        draft.singletrackData = action.singledata;
        break;
    }
  });

export default trackReducer;
