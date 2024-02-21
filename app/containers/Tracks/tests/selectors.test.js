import { selectTrackDomain, selecttrackName, selecttracksData, selecttracksError } from '../selectors';
import { initialState } from '../reducer';

describe('TrackContainer selector tests', () => {
  let mockedState;
  let trackName;
  let tracksData;
  let tracksError;
  beforeEach(() => {
    trackName = 'mac';
    tracksData = { resultsCount: 1, result: [{ trackName }] };
    tracksError = 'There was some error while fetching the repository details';

    mockedState = {
      track: {
        trackName,
        tracksData,
        tracksError
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
  it('should select the global state', () => {
    const selector = selectTrackDomain(initialState);
    expect(selector).toEqual(initialState);
  });
});
