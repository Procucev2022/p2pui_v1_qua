import { environment } from 'src/environments/environment';
import { AppApiConfig } from './app-api.config';

describe('AppApiConfig', () => {
  it('should define apiEndpoint matching environment configuration', () => {
    expect(AppApiConfig.apiEndpoint).toBeDefined();
    expect(typeof AppApiConfig.apiEndpoint).toBe('string');
    expect(AppApiConfig.apiEndpoint.length).toBeGreaterThan(0);
    expect(AppApiConfig.apiEndpoint).toBe(environment.apiEndpoint);
  });

  it('should define authentication and user path constants', () => {
    expect(AppApiConfig.ACCESS_TOKEN_PATH).toBe('/authenticate');
    expect(AppApiConfig.LOGGED_USER_PATH).toBe('/rest/users/user/loggedUser');
    expect(AppApiConfig.CHANGE_PASSWORD).toBe('/rest/users/changePswd');
    expect(AppApiConfig.FORGOT_PASSWORD).toBe('/partialvendor/forgotPassword');
    expect(AppApiConfig.OTP_VALIDATION).toBeDefined();
    expect(AppApiConfig.REFRESH_TOKEN_PATH).toBeDefined();
  });

  it('should define analytics path constants', () => {
    expect(AppApiConfig.SAVE_USER_LOGIN_DATA).toBeDefined();
    expect(AppApiConfig.GET_VISITORS_COUNT).toBeDefined();
  });

  it('should define GMT and BFS path constants', () => {
    expect(AppApiConfig.GET_RFQS_FOR_NOPR).toBeDefined();
    expect(AppApiConfig.FETCH_ALL_RFQS_BY_GTM_VENDOR).toBeDefined();
    expect(AppApiConfig.SELLER_BID_MY_ITEMS).toBeDefined();
  });
});
