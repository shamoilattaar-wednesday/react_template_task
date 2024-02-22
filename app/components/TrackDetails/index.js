/**
 *
 * RepoCard
 *
 */

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Card } from '@mui/material';
import T from '@components/T';
import If from '@components/If';
import isEmpty from 'lodash/isEmpty';
import { useLocation } from 'react-router-dom';

const CustomCard = styled(Card)`
  && {
    margin: 1rem 0;
    padding: 1rem;
    min-height: 270px;
  }
`;

export function TrackDetails({ collectionName, artistName, collectionPrice, artworkUrl100, description }) {
  const location = useLocation();
  const [isplaying, setIsplaying] = useState(false);
  const audioref = useRef(null);

  useEffect(() => {
    if (isplaying) {
      audioref.current.play();
    } else {
      audioref.current.pause();
    }
  }, [isplaying]);
  return (
    <CustomCard data-testid="track-card">
      <If
        condition={!isEmpty(location.state)}
        otherwise={
          <div>
            <img src={location.state.item.artworkUrl100} alt={collectionName} />
            <T data-testid="name" id="track_name" values={{ trackName: location.state.item.trackName }} />
          </div>
        }
      >
        <div>
          <img src={location.state.item.artworkUrl100} alt={collectionName} />
          <T data-testid="name" id="track_name" values={{ trackName: location.state.item.collectionName }} />
        </div>
      </If>

      <If
        condition={!isEmpty(location.state)}
        otherwise={<T data-testid="artist-unavailable" id="artist_unavailable" />}
      >
        <T data-testid="artist-name" id="artist_name" values={{ artist_name: location.state.item.artistName }} />
      </If>
      <If
        condition={!isEmpty(location.state)}
        otherwise={<T data-testid="description-unavailable" id="description_unavailable" />}
      >
        <T
          data-testid="track-description"
          id="track_description"
          values={{ track_description: location.state.item.description }}
        />
      </If>
      <If condition={!isEmpty(location.state)} otherwise={<T data-testid="cost-unavaiable" id="cost_unavailable" />}>
        <T data-testid="total-cost" id="total_cost" values={{ price: location.state.item.collectionPrice }} />
      </If>
      <If
        condition={!isEmpty(location.state) && !isEmpty(location.state.item.previewUrl)}
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
          <source src={location.state.item.previewUrl}></source>
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
  description: PropTypes.string
};

export default TrackDetails;
