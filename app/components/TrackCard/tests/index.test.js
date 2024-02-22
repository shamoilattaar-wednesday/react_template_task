import React from 'react';
import { renderWithIntl } from '@utils/testUtils';
import TrackCard from '../index';
import { translate } from '@app/utils/index';

describe('<TrackCard />', () => {
  it('should render and match the snapshot', () => {
    const { baseElement } = renderWithIntl(<TrackCard />);
    expect(baseElement).toMatchSnapshot();
  });
  it('should contain 1 TrackCard component', () => {
    const { getAllByTestId } = renderWithIntl(<TrackCard />);
    expect(getAllByTestId('track-card').length).toBe(1);
  });
  it('should render the track details inside the card', () => {
    const trackName = 'mac';
    const artistName = 'wednesday-solutions';
    const collectionPrice = 200;
    const { getByTestId } = renderWithIntl(
      <TrackCard collectionName={trackName} artistName={artistName} collectionPrice={collectionPrice} />
    );
    expect(getByTestId('name')).toHaveTextContent(trackName);
    expect(getByTestId('artist-name')).toHaveTextContent(artistName);
  });
  it('should render the repository unavailable messages in case any props are unavailable or have falsy values', () => {
    const repoUnavailable = translate('repo_name_unavailable');
    const fullNameUnavailable = translate('repo_full_name_unavailable');
    const stargazersUnavailable = translate('repo_stars_unavailable');
    const { getByTestId } = renderWithIntl(<TrackCard />);
    expect(getByTestId('name-unavailable')).toHaveTextContent(repoUnavailable);
    expect(getByTestId('fullName-unavailable')).toHaveTextContent(fullNameUnavailable);
    expect(getByTestId('stargazers-unavaiable')).toHaveTextContent(stargazersUnavailable);
  });
});
