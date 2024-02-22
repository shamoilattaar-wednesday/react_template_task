/* eslint-disable react/prop-types */
import React, { useEffect, memo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import get from 'lodash/get';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import styled from '@emotion/styled';
import { injectSaga } from 'redux-injectors';
import { Card, IconButton, Skeleton, InputAdornment, OutlinedInput, CardHeader, Divider } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import T from '@components/T';
import If from '@components/If';
import TrackCard from '@components/TrackCard';
import { selecttracksData, selecttracksError, selecttrackName } from './selectors';
import { trackCreators } from './reducer';
import trackSaga from './saga';
import { translate } from '@app/utils/index';

const CustomCard = styled(Card)`
  && {
    margin: 1.25rem 0;
    padding: 1rem;
    max-width: ${(props) => props.maxwidth};
    color: ${(props) => props.color};
    ${(props) => props.color && `color: ${props.color}`};
  }
`;
const CustomCardHeader = styled(CardHeader)`
  && {
    padding: 0;
  }
`;
const Container = styled.div`
  && {
    display: flex;
    flex-direction: column;
    max-width: ${(props) => props.maxwidth}px;
    width: 100%;
    margin: 0 auto;
    padding: ${(props) => props.padding}px;
  }
`;

const TrackDet = styled.div`
  && {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-gap: 1rem;
  }
`;

const StyledOutlinedInput = styled(OutlinedInput)`
  legend {
    display: none;
  }
  > fieldset {
    top: 0;
  }
`;

export function Track({
  dispatchTrackDetails,
  dispatchClearTrackDetails,
  tracksData,
  tracksError,
  trackName,
  maxwidth,
  padding
}) {
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const loaded = get(tracksData, 'results', null) || tracksError;
    if (loaded) {
      setLoading(false);
    }
  }, [tracksData]);
  useEffect(() => {
    if (trackName && !tracksData?.results?.length) {
      dispatchTrackDetails(trackName);
      setLoading(true);
    }
  }, []);

  const searchTracks = (trackName) => {
    dispatchTrackDetails(trackName);
    setLoading(true);
  };

  const handleOnChange = (rName) => {
    if (!isEmpty(rName)) {
      searchTracks(rName);
    } else {
      dispatchClearTrackDetails();
    }
  };

  const renderSkeleton = () => {
    return (
      <>
        <Skeleton data-testid="skeleton" animation="wave" variant="text" height={40} />
        <Skeleton data-testid="skeleton" animation="wave" variant="text" height={40} />
        <Skeleton data-testid="skeleton" animation="wave" variant="text" height={40} />
      </>
    );
  };

  const viewTracks = (item) => {
    let finalurl = '/tracks/' + item.trackId;
    history.push({ pathname: finalurl, state: { item: item } });
    window.location.reload();
  };

  const renderTrackList = () => {
    const items = get(tracksData, 'results', []);
    const totalCount = get(tracksData, 'resultCount', 0);
    return (
      <If condition={!isEmpty(items) || loading}>
        <CustomCard>
          <If condition={!loading} otherwise={renderSkeleton()}>
            <>
              <If condition={totalCount !== 0}>
                <div>
                  <T id="records_found" values={{ totalCount }} />
                </div>
              </If>
              <TrackDet data-testid="track_det">
                {items.map((item, index) => (
                  <div key={index} onClick={() => viewTracks(item)}>
                    <TrackCard key={index} {...item} />
                  </div>
                ))}
              </TrackDet>
            </>
          </If>
        </CustomCard>
      </If>
    );
  };
  const renderErrorState = () => {
    let trackError;
    if (tracksError) {
      trackError = tracksError;
    } else if (isEmpty(trackName)) {
      trackError = 'track_search_default';
    }
    return (
      !loading &&
      trackError && (
        <CustomCard color={tracksError ? 'red' : 'grey'}>
          <CustomCardHeader title={translate('repo_list')} />
          <Divider sx={{ mb: 1.25 }} light />
          <If condition={tracksError} otherwise={<T data-testid="default-message" id={trackError} />}>
            <T data-testid="error-message" text={tracksError} />
          </If>
        </CustomCard>
      )
    );
  };
  const debouncedHandleOnChange = debounce(handleOnChange, 200);
  
  return (
    <Container>
      <CustomCard maxwidth={maxwidth}>
        <CustomCardHeader title={translate('track_search')} />
        <Divider sx={{ mb: 1.25 }} light />
        <T marginBottom={10} id="search_track_details" />
        <StyledOutlinedInput
          inputProps={{ 'data-testid': 'search-bar' }}
          onChange={(event) => debouncedHandleOnChange(event.target.value)}
          fullWidth
          defaultValue={trackName}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                data-testid="search-icon"
                aria-label="search repos"
                type="button"
                onClick={() => searchTracks(trackName)}
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </CustomCard>
      {renderTrackList()}
      {renderErrorState()}
    </Container>
  );
}

Track.propTypes = {
  dispatchTrackDetails: PropTypes.func,
  dispatchClearTrackDetails: PropTypes.func,
  intl: PropTypes.object,
  tracksData: PropTypes.shape({
    totalCount: PropTypes.number,
    incompleteResults: PropTypes.bool,
    items: PropTypes.array,
    results: PropTypes.array
  }),
  tracksError: PropTypes.string,
  trackName: PropTypes.string,
  history: PropTypes.object,
  maxwidth: PropTypes.number,
  padding: PropTypes.number
};

Track.defaultProps = {
  maxwidth: 500,
  padding: 20,
  tracksData: {},
  tracksError: null
};
const mapStateToProps = createStructuredSelector({
  tracksData: selecttracksData(),
  tracksError: selecttracksError(),
  trackName: selecttrackName()
});

export function mapDispatchToProps(dispatch) {
  const { requestGetTrackDetails, clearTrackDetails } = trackCreators;
  return {
    dispatchTrackDetails: (trackName) => dispatch(requestGetTrackDetails(trackName)),
    dispatchClearTrackDetails: () => dispatch(clearTrackDetails())
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo, injectSaga({ key: 'track', saga: trackSaga }))(Track);

export const TrackTest = compose()(Track);
