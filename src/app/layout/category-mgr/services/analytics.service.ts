import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppApiConfig } from 'src/app/shared/constants/app-api.config';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<any> {
    return this.http.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_ANALYTICS_DASHBOARD);
  }

  getCategoriesData(): Observable<any> {
    return this.http.get(AppApiConfig.apiEndpoint + AppApiConfig.GET_ANALYTICS_CATEGORIES);
  }

  getFunnelData(type: string = 'buyer'): Observable<any> {
    return this.http.get(`${AppApiConfig.apiEndpoint + AppApiConfig.GET_ANALYTICS_FUNNEL}?type=${type}`);
  }

  getFunnelStageDetails(type: string = 'buyer', stageNumber: number = 1, search: string = ''): Observable<any> {
    return this.http.get(`${AppApiConfig.apiEndpoint + AppApiConfig.GET_ANALYTICS_FUNNEL_DETAILS}?type=${type}&stage=${stageNumber}&q=${encodeURIComponent(search)}`);
  }

  getFunnelDropoffDetails(type: string = 'buyer', stageNumber: number = 2, search: string = ''): Observable<any> {
    return this.http.get(`${AppApiConfig.apiEndpoint + AppApiConfig.GET_ANALYTICS_FUNNEL_DROPOFF}?type=${type}&stage=${stageNumber}&q=${encodeURIComponent(search)}`);
  }

  getCalendarData(year?: number, month?: number): Observable<any> {
    let url = AppApiConfig.apiEndpoint + AppApiConfig.GET_ANALYTICS_CALENDAR;
    if (year && month) {
      url += `?year=${year}&month=${month}`;
    }
    return this.http.get(url);
  }

  searchCompanies(query: string = ''): Observable<any> {
    return this.http.get(`${AppApiConfig.apiEndpoint + AppApiConfig.SEARCH_ANALYTICS_COMPANIES}?q=${encodeURIComponent(query)}`);
  }

  processChat(payload: any): Observable<any> {
    return this.http.post(AppApiConfig.apiEndpoint + AppApiConfig.CHAT_ANALYTICS_CONSOLE, payload);
  }
}
