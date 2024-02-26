import MockAdapter from 'axios-mock-adapter';
import { getApiClient } from '@utils/apiUtils';
import { getRepos, getTracks, getTrackById } from '../repoApi';
import { axios } from 'axios';

describe('RepoApi tests', () => {
  const repositoryName = 'mac';
  const trackName = 'mac';
  const trackId = '123456789';
  it('should make the api call to "/search/repositories?q="', async () => {
    const mock = new MockAdapter(getApiClient().axiosInstance);
    const data = [
      {
        totalCount: 1,
        items: [{ repositoryName }]
      }
    ];
    mock.onGet(`/search/repositories?q=${repositoryName}`).reply(200, data);
    const res = await getRepos(repositoryName);
    expect(res.data).toEqual(data);
  });
  it('should make the api call to "https://itunes.apple.com/search?term="', async () => {
    const mock = new MockAdapter(axios);
    const data = [
      {
        resultCount: 50,
        items: [{ repositoryName }]
      }
    ];
    mock.onGet(`https://itunes.apple.com/search?term=${trackName}`).reply(200, data);
    const res = await getTracks(repositoryName);
    expect(res.data.resultCount).toEqual(data[0].resultCount);
  });
  it('should make the api call to "https://itunes.apple.com/lookup?id="', async () => {
    const mock = new MockAdapter(axios);
    const data = [
      {
        resultCount: 0,
        items: [{ repositoryName }]
      }
    ];
    mock.onGet(`https://itunes.apple.com/lookup?id=${trackId}`).reply(200, data);
    const res = await getTrackById(trackId);
    expect(res.data.resultCount).toEqual(data[0].resultCount);
  });
});
