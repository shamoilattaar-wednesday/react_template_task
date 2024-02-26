import React from 'react';
import { renderWithIntl, timeout } from '@utils/testUtils';
import { TrackDetailsTest as TrackDetails, mapDispatchToProps } from '../index';
import { fireEvent } from '@testing-library/dom';
import { trackTypes } from '@containers/Provider/reducer';

jest.mock('react-router-dom', () => ({
  useLocation: () => ({
    pathname: '/tracks/123456789',
    state: {
      item: {
        artworkUrl100: 'https://via.placeholder.com/100',
        collectionName: 'Test Collection',
        artistName: 'Test Artist',
        shortdescription: 'Test Description',
        collectionPrice: 9.99,
        previewUrl:
          'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview112/v4/4a/68/06/4a6806aa-be22-3eff-8153-d9b1ab9dab8b/mzaf_12411707066990307220.plus.aac.p.m4a'
      }
    }
  })
}));

describe('<TrackDetails />', () => {
  let submitSpy;

  beforeEach(() => {
    submitSpy = jest.fn();
  });
  it('should render and match the snapshot', () => {
    const { baseElement } = renderWithIntl(<TrackDetails dispatchTrackDetails={submitSpy} />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should contain 1 TrackDetails component', () => {
    const { getAllByTestId } = renderWithIntl(<TrackDetails dispatchTrackDetails={submitSpy} />);
    expect(getAllByTestId('track-card').length).toBe(1);
  });
  it('should render the track details inside the card', () => {
    let item = {
      trackId: '123456789',
      artworkUrl100: 'https://via.placeholder.com/100',
      collectionName: 'Test Collection',
      artistName: 'Test Artist',
      shortdescription: 'Test Description',
      collectionPrice: 9.99,
      previewUrl:
        'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview112/v4/4a/68/06/4a6806aa-be22-3eff-8153-d9b1ab9dab8b/mzaf_12411707066990307220.plus.aac.p.m4a'
    };
    let items = { results: [item] };
    const { baseElement } = renderWithIntl(
      <TrackDetails dispatchTrackDetails={submitSpy} singletrackData={item} tracksData={items} />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should validate mapDispatchToProps actions', async () => {
    const dispatchTrackSearchSpy = jest.fn();
    const trackId = '123456789';
    const actions = {
      dispatchTrackDetails: { trackId, type: trackTypes.REQUEST_GET_TRACK_DETAILS_BY_ID },
      dispatchClearTrackDetails: { type: trackTypes.CLEAR_TRACK_DETAILS }
    };

    const props = mapDispatchToProps(dispatchTrackSearchSpy);
    props.dispatchTrackDetails(trackId);
    expect(dispatchTrackSearchSpy).toHaveBeenCalledWith(actions.dispatchTrackDetails);
  });
  it('should render the track details from the click on play and pause', async () => {
    let tracksData = {
      results: [
        {
          trackId: '123456789',
          artworkUrl100: 'https://via.placeholder.com/100',
          collectionName: 'Test Collection',
          artistName: 'Test Artist',
          shortDescription: 'Test Description',
          collectionPrice: 9.99,
          previewUrl:
            'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview112/v4/4a/68/06/4a6806aa-be22-3eff-8153-d9b1ab9dab8b/mzaf_12411707066990307220.plus.aac.p.m4a'
        }
      ]
    };
    const { getByTestId } = renderWithIntl(
      <TrackDetails dispatchTrackDetails={submitSpy} tracksData={tracksData} singletrackData={tracksData} />
    );
    await timeout(500);

    fireEvent.click(getByTestId('play-audio'));
    await timeout(500);
    expect(getByTestId('pause-audio')).toBeInTheDocument();
    fireEvent.click(getByTestId('pause-audio'));
    await timeout(500);
    expect(getByTestId('play-audio')).toBeInTheDocument();
  });

  // sc
});
