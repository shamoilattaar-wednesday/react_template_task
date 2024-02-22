import React from 'react';
import { renderWithIntl, renderProvider, timeout } from '@utils/testUtils';
import TrackCard from '../index';
import { translate } from '@app/utils/index';
import { fireEvent } from '@testing-library/dom';

describe('<TrackCard />', () => {
  let submitSpy;
  beforeEach(() => {
    submitSpy = jest.fn();
  });
  it('should render and match the snapshot', () => {
    const track = {};
    const { baseElement } = renderWithIntl(<TrackCard track={track} />);
    expect(baseElement).toMatchSnapshot();
  });
  it('should contain 1 TrackCard component', () => {
    const track = {};
    const { getAllByTestId } = renderWithIntl(<TrackCard track={track} />);
    expect(getAllByTestId('track-card').length).toBe(1);
    expect(getAllByTestId('track-details').length).toBe(1);
  });
  it('should render the track details inside the card', () => {
    const trackName = 'mac';
    const artistName = 'wednesday-solutions';
    const collectionPrice = 200;
    const track = { trackName: 'mac' };
    const { getByTestId } = renderWithIntl(
      <TrackCard collectionName={trackName} artistName={artistName} collectionPrice={collectionPrice} track={track} />
    );
    expect(getByTestId('name')).toHaveTextContent(trackName);
    expect(getByTestId('artist-name')).toHaveTextContent(artistName);
  });
  it('should render the repository unavailable messages in case any props are unavailable or have falsy values', () => {
    const repoUnavailable = translate('repo_name_unavailable');
    const fullNameUnavailable = translate('repo_full_name_unavailable');
    const stargazersUnavailable = translate('repo_stars_unavailable');
    const track = {};
    const { getByTestId } = renderWithIntl(<TrackCard track={track} />);
    expect(getByTestId('name-unavailable')).toHaveTextContent(repoUnavailable);
    expect(getByTestId('fullName-unavailable')).toHaveTextContent(fullNameUnavailable);
    expect(getByTestId('stargazers-unavaiable')).toHaveTextContent(stargazersUnavailable);
  });
  it('should render the track details from the click on card', async () => {
    const trackName = 'mac';
    const artistName = 'wednesday-solutions';
    const collectionPrice = 200;
    const track = {
      artworkUrl100: 'https://via.placeholder.com/100',
      collectionName: 'Test Collection',
      artistName: 'Test Artist',
      description: 'Test Description',
      collectionPrice: 9.99,
      trackName: 'mac',
      previewUrl:
        'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview112/v4/4a/68/06/4a6806aa-be22-3eff-8153-d9b1ab9dab8b/mzaf_12411707066990307220.plus.aac.p.m4a'
    };
    const { getByTestId } = renderProvider(
      <TrackCard
        viewTracks={submitSpy}
        collectionName={trackName}
        artistName={artistName}
        collectionPrice={collectionPrice}
        track={track}
      />
    );
    fireEvent.click(getByTestId('track-details'));

    await timeout(500);
    expect(submitSpy).toBeCalledWith(track);
  });
  it('should render the track details from the click on play audio', async () => {
    const trackName = 'mac';
    const artistName = 'wednesday-solutions';
    const collectionPrice = 200;
    const track = {
      artworkUrl100: 'https://via.placeholder.com/100',
      collectionName: 'Test Collection',
      artistName: 'Test Artist',
      description: 'Test Description',
      collectionPrice: 9.99,
      trackName: 'mac',
      previewUrl:
        'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview112/v4/4a/68/06/4a6806aa-be22-3eff-8153-d9b1ab9dab8b/mzaf_12411707066990307220.plus.aac.p.m4a'
    };
    const { getByTestId } = renderProvider(
      <TrackCard
        handlePlay={submitSpy}
        collectionName={trackName}
        artistName={artistName}
        collectionPrice={collectionPrice}
        track={track}
      />
    );
    fireEvent.click(getByTestId('play-audio'));

    await timeout(500);
    expect(submitSpy).toBeCalledWith(track);
  });
  it('should render the track details from the click on pause audio', async () => {
    const trackName = 'mac';
    const artistName = 'wednesday-solutions';
    const collectionPrice = 200;
    const isPlaying = true;
    const track = {
      artworkUrl100: 'https://via.placeholder.com/100',
      collectionName: 'Test Collection',
      artistName: 'Test Artist',
      description: 'Test Description',
      collectionPrice: 9.99,
      trackName: 'mac',
      previewUrl:
        'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview112/v4/4a/68/06/4a6806aa-be22-3eff-8153-d9b1ab9dab8b/mzaf_12411707066990307220.plus.aac.p.m4a'
    };
    const { getByTestId } = renderProvider(
      <TrackCard
        handlePlay={submitSpy}
        collectionName={trackName}
        artistName={artistName}
        collectionPrice={collectionPrice}
        track={track}
        isPlaying={isPlaying}
      />
    );
    fireEvent.click(getByTestId('pause-audio'));

    await timeout(500);
    expect(submitSpy).toBeCalledWith(track);
  });
});
