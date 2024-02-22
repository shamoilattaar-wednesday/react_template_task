import { createSelector } from 'reselect';
import get from 'lodash/get';
import { initialState } from './reducer';

/**
 * Direct selector to the homeContainer state domain
 */

export const selectTrackDomain = (state) => state.track || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by HomeContainer
 */

export const selecttracksData = () => createSelector(selectTrackDomain, (substate) => get(substate, 'tracksData'));

export const selecttracksError = () => createSelector(selectTrackDomain, (substate) => get(substate, 'tracksError'));

export const selecttrackName = () => createSelector(selectTrackDomain, (substate) => get(substate, 'trackName'));
