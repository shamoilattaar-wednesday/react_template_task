import React from 'react';
import { renderWithIntl, timeout } from '@utils/testUtils';
import TrackDetails from '../index';
import { fireEvent } from '@testing-library/dom';

jest.mock('react-router-dom', () => ({
  useLocation: () => ({
    state: {
      item: {
        artworkUrl100: 'https://via.placeholder.com/100',
        collectionName: 'Test Collection',
        artistName: 'Test Artist',
        description: 'Test Description',
        collectionPrice: 9.99,
        previewUrl:
          'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview112/v4/4a/68/06/4a6806aa-be22-3eff-8153-d9b1ab9dab8b/mzaf_12411707066990307220.plus.aac.p.m4a'
      }
    }
  })
}));

describe('<TrackDetails />', () => {
  it('should render and match the snapshot', () => {
    const { baseElement } = renderWithIntl(<TrackDetails />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should contain 1 TrackDetails component', () => {
    const { getAllByTestId } = renderWithIntl(<TrackDetails />);
    expect(getAllByTestId('track-card').length).toBe(1);
  });
  it('should render the track details inside the card', () => {
    jest.mock('react-router-dom', () => ({
      useLocation: () => ({
        state: {}
      })
    }));
    const { baseElement } = renderWithIntl(<TrackDetails />);
    expect(baseElement).toMatchSnapshot();
  });
  it('should render the track details from the click on play and pause', async () => {
    const { getByTestId } = renderWithIntl(<TrackDetails />);
    fireEvent.click(getByTestId('play-audio'));
    await timeout(500);
    expect(getByTestId('pause-audio')).toBeInTheDocument();
    fireEvent.click(getByTestId('pause-audio'));
    await timeout(500);
    expect(getByTestId('play-audio')).toBeInTheDocument();
  });
});
