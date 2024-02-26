/**
 *
 * Tests for HomeContainer
 *
 */

import React from 'react';
import { fireEvent } from '@testing-library/dom';
import { timeout, renderProvider } from '@utils/testUtils';
import { TrackTest as Track, mapDispatchToProps } from '../index';
import { trackTypes } from '../reducer';
import { translate } from '@app/utils/index';

describe('<Track /> tests', () => {
  let submitSpy;

  beforeEach(() => {
    submitSpy = jest.fn();
  });
  it('should render and match the snapshot', () => {
    const { baseElement } = renderProvider(<Track dispatchTrackDetails={submitSpy} />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should call dispatchClearTrackDetails on empty change', async () => {
    const getTrackDestailsSpy = jest.fn();
    const clearTrackDetailsSpy = jest.fn();
    const { getByTestId } = renderProvider(
      <Track dispatchClearTrackDetails={clearTrackDetailsSpy} dispatchTrackDetails={getTrackDestailsSpy} />
    );
    fireEvent.change(getByTestId('search-bar'), {
      target: { value: 'a' }
    });
    await timeout(500);
    expect(getTrackDestailsSpy).toBeCalled();
    fireEvent.change(getByTestId('search-bar'), {
      target: { value: '' }
    });
    await timeout(500);
    expect(clearTrackDetailsSpy).toBeCalled();
  });

  it('should call dispatchTrackDetails on change and after enter', async () => {
    const trackName = 'react-template';
    const { getByTestId } = renderProvider(<Track dispatchTrackDetails={submitSpy} />);
    const searchBar = getByTestId('search-bar');
    fireEvent.change(searchBar, {
      target: { value: trackName }
    });
    await timeout(500);
    expect(submitSpy).toBeCalledWith(trackName);

    fireEvent.keyDown(searchBar, {
      key: 'Enter',
      code: 13,
      charCode: 13
    });
    expect(submitSpy).toBeCalledWith(trackName);
  });

  it('should call dispatchTrackDetails on clicking the search icon', async () => {
    const trackName = 'react-template';
    const { getByTestId } = renderProvider(<Track dispatchTrackDetails={submitSpy} trackName={trackName} />);
    fireEvent.click(getByTestId('search-icon'));

    await timeout(500);
    expect(submitSpy).toBeCalledWith(trackName);
  });

  it('should  dispatchTrackDetails on update on mount if repoName is already persisted', async () => {
    const trackName = 'react-template';
    renderProvider(<Track trackName={trackName} tracksData={null} dispatchTrackDetails={submitSpy} />);

    await timeout(500);
    expect(submitSpy).toBeCalledWith(trackName);
  });
  it('should validate mapDispatchToProps actions', async () => {
    const dispatchTrackSearchSpy = jest.fn();
    const trackName = 'react-template';
    const actions = {
      dispatchTrackDetails: { trackName, type: trackTypes.REQUEST_GET_TRACK_DETAILS },
      dispatchClearTrackDetails: { type: trackTypes.CLEAR_TRACK_DETAILS }
    };

    const props = mapDispatchToProps(dispatchTrackSearchSpy);
    props.dispatchTrackDetails(trackName);
    expect(dispatchTrackSearchSpy).toHaveBeenCalledWith(actions.dispatchTrackDetails);

    await timeout(500);
    props.dispatchClearTrackDetails();
    expect(dispatchTrackSearchSpy).toHaveBeenCalledWith(actions.dispatchClearTrackDetails);
  });
  it('should render default error message when search goes wrong', () => {
    const defaultError = translate('something_went_wrong');
    const { getByTestId } = renderProvider(<Track tracksError={defaultError} />);
    expect(getByTestId('error-message')).toBeInTheDocument();
    expect(getByTestId('error-message').textContent).toBe(defaultError);
  });
  it('should render the default message when searchBox is empty and tracksError is null', () => {
    const defaultMessage = translate('track_search_default');
    const { getByTestId } = renderProvider(<Track />);
    expect(getByTestId('default-message')).toBeInTheDocument();
    expect(getByTestId('default-message').textContent).toBe(defaultMessage);
  });
  it('should render the data when loading becomes false', () => {
    const tracksData = { results: [{ trackName: 'react-template' }] };
    const { getByTestId } = renderProvider(<Track tracksData={tracksData} dispatchTrackDetails={submitSpy} />);
    expect(getByTestId('track_det')).toBeInTheDocument();
  });

  it('should render the data and call viewTracks', async () => {
    const tracksData = { results: [{ trackName: 'react-template' }] };
    const { getByTestId } = renderProvider(<Track tracksData={tracksData} dispatchTrackDetails={submitSpy} />);
    expect(getByTestId('track-details')).toBeInTheDocument();
    fireEvent.click(getByTestId('track-details'));
    await timeout(500);
    expect(getByTestId('track-card')).toBeInTheDocument();
  });
  it('should render the data and call handlePlay', async () => {
    const tracksData = {
      results: [
        {
          trackName: 'react-template',
          previewUrl:
            'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview112/v4/4a/68/06/4a6806aa-be22-3eff-8153-d9b1ab9dab8b/mzaf_12411707066990307220.plus.aac.p.m4a'
        }
      ]
    };
    const { getByTestId } = renderProvider(<Track tracksData={tracksData} dispatchTrackDetails={submitSpy} />);
    expect(getByTestId('play-audio')).toBeInTheDocument();
    fireEvent.click(getByTestId('play-audio'));
    await timeout(500);
    expect(getByTestId('pause-audio')).toBeInTheDocument();
  });
});
