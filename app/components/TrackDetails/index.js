/**
 *
 * RepoCard
 *
 */

import React from 'react';
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
  return (
    <CustomCard data-testid="track-card">
      <If
        condition={!isEmpty(location.state)}
        otherwise={
          <div>
            <T data-testid="track-name-unavailable" id="track_name_unavailable" />
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
