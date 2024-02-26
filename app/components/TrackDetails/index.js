/**
 *
 * RepoCard
 *
 */

import React, { useEffect, useRef, useState, memo } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Card } from '@mui/material';
import T from '@components/T';
import If from '@components/If';
import isEmpty from 'lodash/isEmpty';
import { useLocation } from 'react-router-dom';
import {
  selecttracksData,
  selecttracksError,
  selecttrackName,
  selecttrackId,
  selectsingletrackData
} from '@containers/Provider/selectors';
import { trackCreators } from '@containers/Provider/reducer';
import trackSaga from '@containers/Provider/saga';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { injectSaga } from 'redux-injectors';

const CustomCard = styled(Card)`
  && {
    margin: 1rem 0;
    padding: 1rem;
    min-height: 270px;
  }
`;

export function TrackDetails({
  collectionName,
  dispatchTrackDetails,
  tracksData,
  tracksError,
  trackName,
  trackId,
  singletrackData
}) {
  const location = useLocation();
  const [isplaying, setIsplaying] = useState(false);
  const audioref = useRef(null);
  const [trackdata, settrackData] = useState({});
  const [loading, setLoading] = useState(false);
  const tid = location.pathname.split('/')[2];

  const getTrackDetsById = () => {
    dispatchTrackDetails(tid);
  };

  useEffect(() => {
    const items = get(singletrackData, 'results', []);

    settrackData(items[0]);
  }, [singletrackData]);

  useEffect(() => {
    settrackData({});
    let item = {};

    if (!isEmpty(tracksData)) {
      item = tracksData.results.filter((item) => item.trackId === tid);
    }
    if (item.length > 0) {
      settrackData(item[0]);
    } else {
      getTrackDetsById();
    }
  }, [loading]);
  useEffect(() => {
    setLoading(false);
  }, [trackdata]);

  useEffect(() => {
    if (audioref.current !== null) {
      if (isplaying) {
        audioref.current.play();
      } else {
        audioref.current.pause();
      }
    }
  }, [isplaying]);

  return (
    <CustomCard data-testid="track-card">
      <If
        condition={!isEmpty(trackdata)}
        otherwise={
          <div>
            <img src={trackdata.artworkUrl100} alt={collectionName} />
            <T data-testid="name" id="track_name" values={{ trackName: trackdata.trackName }} />
          </div>
        }
      >
        <div>
          <img src={trackdata.artworkUrl100} alt={collectionName} />
          <T data-testid="name" id="track_name" values={{ trackName: trackdata.collectionName }} />
        </div>
      </If>

      <If condition={!isEmpty(trackdata)} otherwise={<T data-testid="artist-unavailable" id="artist_unavailable" />}>
        <T data-testid="artist-name" id="artist_name" values={{ artist_name: trackdata.artistName }} />
      </If>
      <If
        condition={!isEmpty(trackdata)}
        otherwise={<T data-testid="description-unavailable" id="description_unavailable" />}
      >
        <T
          data-testid="track-description"
          id="track_description"
          values={{ track_description: trackdata.shortDescription }}
        />
      </If>
      <If condition={!isEmpty(trackdata)} otherwise={<T data-testid="cost-unavaiable" id="cost_unavailable" />}>
        <T data-testid="total-cost" id="total_cost" values={{ price: trackdata.collectionPrice }} />
      </If>
      <If
        condition={!isEmpty(trackdata) && !isEmpty(trackdata.previewUrl)}
        otherwise={<T data-testid="no-audio" id="no_audio" />}
      >
        <If
          condition={!isplaying}
          otherwise={
            <button>
              <T data-testid="pause-audio" id="pause_audio" onClick={() => setIsplaying(!isplaying)} />
            </button>
          }
        >
          <button>
            <T data-testid="play-audio" id="play_audio" onClick={() => setIsplaying(!isplaying)} />
          </button>
        </If>
        <audio ref={audioref} className="audio-element">
          <source src={trackdata.previewUrl}></source>
        </audio>
      </If>
    </CustomCard>
  );
}

TrackDetails.propTypes = {
  collectionName: PropTypes.string,
  artistName: PropTypes.string,
  collectionPrice: PropTypes.number,
  artworkUrl100: PropTypes.string,
  description: PropTypes.string,
  tracksData: PropTypes.shape({
    totalCount: PropTypes.number,
    incompleteResults: PropTypes.bool,
    items: PropTypes.array,
    results: PropTypes.array
  }),
  dispatchTrackDetails: PropTypes.func,
  tracksError: PropTypes.string,
  trackName: PropTypes.string,
  trackId: PropTypes.string,
  singletrackData: PropTypes.shape({
    totalCount: PropTypes.number,
    incompleteResults: PropTypes.bool,
    items: PropTypes.array,
    results: PropTypes.array
  })
};

TrackDetails.defaultProps = {
  maxwidth: 500,
  padding: 20,
  tracksData: {},
  tracksError: null,
  trackId: null
};
const mapStateToProps = createStructuredSelector({
  tracksData: selecttracksData(),
  tracksError: selecttracksError(),
  trackName: selecttrackName(),
  trackId: selecttrackId(),
  singletrackData: selectsingletrackData()
});

export function mapDispatchToProps(dispatch) {
  const { requestGetTrackDetailsById, clearTrackDetails } = trackCreators;
  return {
    dispatchTrackDetails: (trackId) => dispatch(requestGetTrackDetailsById(trackId)),
    dispatchClearTrackDetails: () => dispatch(clearTrackDetails())
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo, injectSaga({ key: 'track', saga: trackSaga }))(TrackDetails);

export const TrackDetailsTest = compose()(TrackDetails);
