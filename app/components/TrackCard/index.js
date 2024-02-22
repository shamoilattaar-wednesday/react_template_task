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

const CustomCard = styled(Card)`
  && {
    margin: 1rem 0;
    padding: 1rem;
    min-height: 270px;
  }
`;

export function TrackCard({ collectionName, artistName, collectionPrice, artworkUrl100 }) {
  return (
    <CustomCard data-testid="track-card">
      <If
        condition={!isEmpty(collectionName)}
        otherwise={<T data-testid="name-unavailable" id="repo_name_unavailable" />}
      >
        <div>
          <img src={artworkUrl100} alt={collectionName} />
          <T data-testid="name" id="track_name" values={{ trackName: collectionName }} />
        </div>
      </If>
      <If
        condition={!isEmpty(artistName)}
        otherwise={<T data-testid="fullName-unavailable" id="repo_full_name_unavailable" />}
      >
        <T data-testid="artist-name" id="artist_name" values={{ artist_name: artistName }} />
      </If>
      <If condition={collectionPrice} otherwise={<T data-testid="stargazers-unavaiable" id="repo_stars_unavailable" />}>
        <T data-testid="total-cost" id="total_cost" values={{ price: collectionPrice }} />
      </If>
    </CustomCard>
  );
}

TrackCard.propTypes = {
  collectionName: PropTypes.string,
  artistName: PropTypes.string,
  collectionPrice: PropTypes.number,
  artworkUrl100: PropTypes.string
};

export default TrackCard;
