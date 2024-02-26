import {
  selectTrackDomain,
  selecttrackName,
  selecttracksData,
  selecttracksError,
  selectsingletrackData,
  selecttrackId
} from '../selectors';
import { initialState } from '../reducer';

describe('TrackContainer selector tests', () => {
  let mockedState;
  let trackName;
  let tracksData;
  let tracksError;
  let singletrackData;
  let trackId;
  beforeEach(() => {
    trackName = 'mac';
    tracksData = { resultsCount: 1, result: [{ trackName }] };
    tracksError = 'There was some error while fetching the repository details';
    singletrackData = { trackName };
    trackId = '12345678';

    mockedState = {
      track: {
        trackName,
        tracksData,
        tracksError,
        singletrackData,
        trackId
      }
    };
  });
  it('should select the trackName', () => {
    const trackSelector = selecttrackName();
    expect(trackSelector(mockedState)).toEqual(trackName);
  });
  it('should select tracksData', () => {
    const tracksDataSelector = selecttracksData();
    expect(tracksDataSelector(mockedState)).toEqual(tracksData);
  });
  it('should select the tracksError', () => {
    const tracksErrorSelector = selecttracksError();
    expect(tracksErrorSelector(mockedState)).toEqual(tracksError);
  });

  it('should select the singletrackdata', () => {
    const singletrackdataSelector = selectsingletrackData();
    expect(singletrackdataSelector(mockedState)).toEqual(singletrackData);
  });
  it('should select the trackId', () => {
    const trackIdSelector = selecttrackId();
    expect(trackIdSelector(mockedState)).toEqual(trackId);
  });

  it('should select the global state', () => {
    const selector = selectTrackDomain(initialState);
    expect(selector).toEqual(initialState);
  });
});
