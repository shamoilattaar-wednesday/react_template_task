import { generateApiClient } from '@utils/apiUtils';
import axios from 'axios';
const repoApi = generateApiClient('github');

export const getRepos = (repoName) => repoApi.get(`/search/repositories?q=${repoName}`);
export const getTracks = (trackName) => axios.get(`https://itunes.apple.com/search?term=${trackName}`);
