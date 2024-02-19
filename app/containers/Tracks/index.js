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
import For from '@components/For';
import RepoCard from '@components/RepoCard';
import TrackCard from '@components/TrackCard';
import colors from '@app/themes/colors';
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
const RightContent = styled.div`
  display: flex;
  align-self: flex-end;
`;

const StyledT = styled(T)`
  && {
    color: ${colors.gotoStories};
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

export function Track({dispatchTrackDetails,
  dispatchClearTrackDetails,
  tracksData,
  tracksError,
  trackName,
  maxwidth,
  padding}) {
  
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
        dispatchTrackDetails (trackName);
        setLoading(true);
      }
    }, []);
    
  const searchTracks = (rName) => {
      dispatchTrackDetails(rName);
      setLoading(true);
    };

    const handleOnChange = (rName) => {
      if (!isEmpty(rName)) {
        searchTracks(rName);
      } else {
        dispatchClearTrackDetails();
      }
    };

    const handleStoriesClick = () => {
      history.push('/stories');
      window.location.reload();
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

    const renderTrackList = () => {
      
      const items = get(tracksData, 'results', []);
      const totalCount = get(tracksData, 'resultCount', 0);
      return (
        <If condition={!isEmpty(items) || loading}>
          <CustomCard>
            <If condition={!loading} otherwise={renderSkeleton()}>
              <>
                <If condition={!isEmpty(trackName)}>
                  <div>
                    <T id="search_query" values={{repoName: trackName}} />
                  </div>
                </If>
                <If condition={totalCount !== 0}>
                  <div>
                    <T id="matching_repos" values={{ totalCount }} />
                  </div>
                </If>
                <For
                  of={items}
                  ParentComponent={Container}
                  renderItem={(item, index) => <TrackCard key={index} {...item} />}
                />
              </>
            </If>
          </CustomCard>
        </If>
      );
    };
  const debouncedHandleOnChange = debounce(handleOnChange, 200);

  return (
    <Container>

       <RightContent>
        <StyledT onClick={handleStoriesClick} data-testid="redirect" id="stories" />
      </RightContent>
      <CustomCard maxwidth={maxwidth}>
        <CustomCardHeader title={translate('track_search')} />
        <Divider sx={{ mb: 1.25 }} light />
        <T marginBottom={10} id="get_track_details" />
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
    items: PropTypes.array
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
