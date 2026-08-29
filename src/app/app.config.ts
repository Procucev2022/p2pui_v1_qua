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
    'CategoryManager' :['/categorymgr/create-rfq', '/categorymgr/gmt-rqfs', '/categorymgr/client-gmt-rqfs', '/categorymgr/vendor-summary', '/categorymgr/cat-mgr-reports', '/categorymgr/buyer-vendors'], // 3 Screens
    'CategoryManager2':['/categorymgr/gmt-rqfs', '/categorymgr/gmt-summary','/categorymgr/gmt-reg-clients','/categorymgr/client-gmt-rqfs', '/categorymgr/gmt-vendors', '/categorymgr/cat-mgr-reports', '/categorymgr/buyer-vendors'], // 4 Screens
   'ClientInitiator':['/categorymgr/create-rfq', '/categorymgr/gmt-rfq-support','/categorymgr/gmt-rfq-faqs', '/categorymgr/my-profile', '/categorymgr/my-category-list', '/categorymgr/buyer-vendors'], // 3 Screens
//    'Registration': [ '/categorymgr/vendor-profile',  '/categorymgr/gmt-rfq-faqs', '/categorymgr/my-profile' ], // 2 Screens
//    'PartialVendor':['/categorymgr/vendor-profile' , '/categorymgr/gmt-rfq-faqs', '/categorymgr/my-profile' ],// 2 Screens
//    'Vendor': [  '/categorymgr/gmt-rfq-faqs', '/categorymgr/gmt-rfq-faqs', '/categorymgr/vendor-profile' , '/categorymgr/my-profile' ] // 2 Screens
 'Registration': ['/categorymgr/gmt-rqfs','/categorymgr/gmt-rfq-faqs', '/categorymgr/vendor-profile','/categorymgr/payment-success', '/categorymgr/payment-failure', '/categorymgr/vendor-profile-subscriptions', '/categorymgr/my-profile','/categorymgr/vendor-catalogue', '/categorymgr/vendor-catalogue-terms-condts', '/categorymgr/my-category-list', '/vendor/dashboard'],  // 2 Screens
  'PartialVendor':['/categorymgr/gmt-rqfs','/categorymgr/gmt-rfq-faqs', '/categorymgr/vendor-profile','/categorymgr/payment-success', '/categorymgr/payment-failure', '/categorymgr/vendor-profile-subscriptions', '/categorymgr/my-profile','/categorymgr/vendor-catalogue', '/categorymgr/vendor-catalogue-terms-condts', '/categorymgr/my-category-list', '/vendor/dashboard'], // 2 Screens
  'Vendor': ['/categorymgr/gmt-rqfs','/categorymgr/gmt-rfq-faqs', '/categorymgr/vendor-profile', '/categorymgr/vendor-profile-subscriptions',
    '/categorymgr/payment-success', '/categorymgr/payment-failure', '/categorymgr/my-profile', '/categorymgr/vendor-catalogue', '/categorymgr/vendor-catalogue-terms-condts', '/categorymgr/my-category-list', '/vendor/dashboard'], // 2 Screens

}

export const BFS_SYSTEM_SCREEN_LIST ={
    'CategoryManager' : ['/bfs', '/bfs/items', '/bfs/my-items', '/bfs/my-bids', '/bfs/requested-items', '/categorymgr/capex-quoteCompare', '/categorymgr/capex-auctions' , '/categorymgr/capex-post-auctions-comp',
    '/client/pr-capex', '/client/cient-summary'
    ],
    'CategoryManager2': ['/bfs', '/bfs/items', '/bfs/my-items', '/bfs/my-bids', '/bfs/requested-items','/bfs/buyer-seller-details'],
    'Registration': ['/bfs',   '/bfs/my-items' , '/categorymgr/my-category-list'],
    'PartialVendor': ['/bfs', '/bfs/my-items', '/categorymgr/my-category-list' ],
    'Vendor': ['/bfs',  '/bfs/my-items', '/bfs/seller-bid-items', '/categorymgr/my-category-list' ],
    'ClientInitiator': ['/bfs', '/bfs/items',   '/bfs/my-bids', '/categorymgr/my-category-list'],

}

export const PATTERNS={ 
    ALPHABETS_WITHOUT_SPACE: '/^[a-zA-Z ]+$/',
    ALPHABETS_NUMBERS_WITH_SPACE: '/^[a-zA-Z0-9\s]*$/',
    ALPHABETS_NUMBERS_WITHOUT_SPACE: '/^[a-zA-Z0-9]*$/',
    ALPHABETS_NUMBERS_SPECIAL_CHARACTERS_NOLEAD_SPACES_SPECIAL_CHARS: '/^[a-zA-Z0-9][a-zA-Z0-9\s@#\$%\^\&*\)\(+=._-]*$/',
    ONLY_NUMBERS: '/^[0-9]+(\.?[0-9]+)?$/',
    EMAIL: '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/',
    GSTIN: '/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/',
}
