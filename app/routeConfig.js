import NotFound from '@containers/NotFoundPage/Loadable';
import HomeContainer from '@containers/HomeContainer/Loadable';
import Tracks from '@containers/Tracks/Loadable';
import Track from '@components/TrackDetails/index';
import routeConstants from '@utils/routeConstants';
export const routeConfig = {
  repos: {
    component: HomeContainer,
    ...routeConstants.repos
  },
  tracks: {
    component: Tracks,
    ...routeConstants.tracks
  },
  track: {
    component: Track,
    ...routeConstants.track
  },
  notFoundPage: {
    component: NotFound,
    route: '/'
  }
};
