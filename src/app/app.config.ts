import { InjectionToken } from '@angular/core';

export let APP_CONFIG = new InjectionToken('app.config');

export interface IAppConfig {
    apiEndpoint: string;
    loggedUserRole: string;
    userRoles: string[];
    GRID_PAGE_INFO: any;
}

export const AppConfig: IAppConfig = {
    // apiEndpoint: 'http://104.154.48.179:8080',
    apiEndpoint: 'http://34.68.203.139:8080',
    loggedUserRole: 'Vendor',
    userRoles: [
        'Category Manager',
        'Client',
        'Vendor',
        'Vendor Manager',
        'Procuceve Admin'
    ],

    GRID_PAGE_INFO : {
        'initpageSize': 100,
        'pageOptions': [100, 150, 200]
    }
};

export const SystemViewConfig = {
    DPS_BASIC: 'DPS Basic',
    DPS_BASIC_PLUS: 'DPS Basic Plus',
    GMT_BASIC: 'GMT Basic',
    GMT_BASIC_PLUS: 'GMT Basic Plus',
    GMT_PROF: 'GMT Professional',
    BFS_PRO: 'BFS PRO'
}

export const GMT_SYSTEM_SCREENS_LIST ={
   'CategoryManager' :['/categorymgr/create-rfq', '/categorymgr/gmt-rqfs', '/categorymgr/client-gmt-rqfs', '/categorymgr/vendor-summary'], // 3 Screens
   'CategoryManager2':['/categorymgr/gmt-rqfs', '/categorymgr/gmt-summary','/categorymgr/gmt-reg-clients','/categorymgr/client-gmt-rqfs'], // 4 Screens
   'ClientInitiator':['/categorymgr/create-rfq', '/categorymgr/gmt-rfq-support','/categorymgr/gmt-rfq-faqs', '/categorymgr/my-profile'], // 3 Screens

   'Registration': ['/categorymgr/gmt-rqfs','/categorymgr/gmt-rfq-faqs', '/categorymgr/vendor-profile', '/categorymgr/vendor-profile-subscriptions', '/categorymgr/my-profile'], // 2 Screens
   'PartialVendor':['/categorymgr/gmt-rqfs','/categorymgr/gmt-rfq-faqs', '/categorymgr/vendor-profile', '/categorymgr/vendor-profile-subscriptions', '/categorymgr/my-profile'],// 2 Screens
   'Vendor': ['/categorymgr/gmt-rqfs','/categorymgr/gmt-rfq-faqs', '/categorymgr/vendor-profile', '/categorymgr/vendor-profile-subscriptions', '/categorymgr/my-profile'],// 2 Screens
}

export const BFS_SYSTEM_SCREEN_LIST ={
    'CategoryManager' : ['/bfs', '/bfs/items', '/bfs/my-items', '/bfs/my-bids', '/bfs/requested-items' ],
    'CategoryManager2': ['/bfs', '/bfs/items', '/bfs/my-items', '/bfs/my-bids', '/bfs/requested-items','/bfs/buyer-seller-details'],
    'Registration': ['/bfs', '/bfs/items', '/bfs/my-items', '/bfs/my-bids'],
    'PartialVendor': ['/bfs', '/bfs/items', '/bfs/my-items', '/bfs/my-bids'],
    'Vendor': ['/bfs', '/bfs/items', '/bfs/my-items', '/bfs/my-bids'],
    'ClientInitiator': ['/bfs', '/bfs/items', '/bfs/my-items', '/bfs/my-bids'],

}
