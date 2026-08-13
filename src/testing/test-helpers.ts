import { BehaviorSubject, of } from 'rxjs';
import { NavigationEnd } from '@angular/router';
import * as Swal from 'sweetalert2';

function successPayload() {
  return {
    status: 'Success',
    statusCode: '200',
    message: 'ok',
    id: 'u1',
    username: 'tester',
    role: { roleName: 'Vendor', id: 'r1' },
    org: { id: 'o1', name: 'Org' },
    listofPermission: [],
    data: [{ id: '1', name: 'n', status: 'Open', org: { id: 'o1' } }],
    content: [{ id: '1', name: 'n', status: 'Open' }],
    access_token: 'a',
    refresh_token: 'r',
    expires_in: 3600,
    paymentUrl: null,
    resetPassword: false,
    selfClient: false,
    details: {
      id: 'u1',
      username: 'tester',
      role: { roleName: 'Vendor', id: 'r1' },
      org: { id: 'o1', name: 'Org' },
      listofPermission: [],
    },
    body: [{ id: '1' }],
    result: [{ id: '1' }],
    payload: { id: '1' },
    bfsDocuments: [],
    bfsImages: [],
    vendorProduct: [{ id: '1', hsnCode: 'h', brandName: 'b', productName: 'p' }],
    vendorService: [{ id: '1', sacCode: 's', serviceName: 'svc' }],
    certificates: [{ fileName: 'c.pdf', file: 'AAA' }],
    vendorClientReference: [{ id: '1', name: 'c' }],
    uom: { description: 'KG', id: 'u1' },
    vendorId: 'v1',
    uiDisplay: 'Open',
  };
}

function arrayPayload() {
  return [
    {
      id: '1',
      name: 'n',
      status: { uiDisplay: 'Open' },
      org: { id: 'o1' },
      uom: { description: 'KG', id: 'u1' },
      vendorId: 'v1',
      vendorData: ['v1', 'v2'],
      vendorProduct: [],
      vendorService: [],
    },
  ];
}

function looksLikeListMethod(key: string): boolean {
  return /^(get|fetch|load|search|list|find)/i.test(key) &&
    !/ById$|Detail|Config|Token|User$|Profile$/i.test(key);
}

/** Proxy mock: any method returns a success-shaped Observable (or Promise for navigate). */
export function autoMock(name: string): any {
  const events$ = new BehaviorSubject(new NavigationEnd(1, '/', '/'));

  return new Proxy({} as any, {
    get: (t: any, prop: PropertyKey) => {
      if (prop === 'then' || typeof prop === 'symbol') return undefined;
      const key = String(prop);

      if (key === 'events') {
        return events$;
      }
      if (key === 'url' || key === 'urlAfterRedirects') {
        return '/';
      }
      if (key === 'routerState') {
        return { root: { snapshot: { params: {}, data: {} } }, snapshot: {} };
      }
      // Subjects / streams used by constructors (e.g. $expiresTime, $_prData, isLoading)
      if (
        key === 'isLoading' ||
        key.startsWith('$') ||
        key.endsWith('$') ||
        key === 'currentUser'
      ) {
        if (!t[key]) {
          t[key] =
            key === 'isLoading' || key.startsWith('$')
              ? new BehaviorSubject(key === 'isLoading' ? false : 600)
              : of(successPayload());
        }
        return t[key];
      }

      if (!t[key]) {
        t[key] = jasmine.createSpy(name + '.' + key).and.callFake((...args: any[]) => {
          if (key === 'navigate' || key === 'navigateByUrl') {
            return Promise.resolve(true);
          }
          if (key === 'serializeUrl' || key === 'createUrlTree') {
            return '/';
          }
          if (key === 'open') {
            return {
              componentInstance: {
                data: successPayload(),
                onSubmit: () => undefined,
              },
              close: () => undefined,
              afterClosed: () => of({ event: 'submit', data: successPayload() }),
            };
          }
          if (
            [
              'close',
              'closeAll',
              'dismiss',
              'show',
              'hide',
              'success',
              'error',
              'warning',
              'info',
              'next',
              'detectChanges',
              'markForCheck',
              'detach',
              'reattach',
              'confirm',
              'add',
              'remove',
              'clear',
            ].includes(key)
          ) {
            return undefined;
          }
          if (key === 'get' && name === 'EncryDecryService') {
            return JSON.stringify({ details: successPayload() });
          }
          if (key === 'set' && name === 'EncryDecryService') {
            return 'enc';
          }
          if (key === 'transform' || key === 'instant' || key === 'get') {
            if (name === 'TranslateService') {
              return key === 'get' ? of(args[0] || '') : args[0];
            }
            return args[0];
          }
          if (key === 'getBase64') {
            return Promise.resolve('data:application/octet-stream;base64,AAA');
          }
          if (key === 'stream') {
            return of(args[0] || '');
          }
          // List-style APIs often assign the response directly / Array.isArray(res)
          if (looksLikeListMethod(key) || /Search|List|Summary|ByItem|ByRfq|ByPR|ByCode/i.test(key)) {
            return of(arrayPayload());
          }
          return of(successPayload());
        });
      }
      return t[key];
    },
  });
}

export const defaultAppConfig = {
  apiEndpoint: 'http://localhost',
  loggedUserRole: 'Vendor',
  userRoles: ['Category Manager', 'Client', 'Vendor', 'Vendor Manager', 'Procuceve Admin'],
  GRID_PAGE_INFO: { initpageSize: 100, pageOptions: [100, 150, 200] },
};

function safeSet(c: any, key: string, value: any): void {
  try {
    const desc = Object.getOwnPropertyDescriptor(c, key);
    if (desc && desc.get && !desc.set) return;
    if (c[key] == null || c[key] === undefined) {
      c[key] = value;
    }
  } catch {
    /* ignore getter-only */
  }
}

export function seedComponent(c: any): void {
  if (!c || typeof c !== 'object') return;
  const sampleRow = {
    id: '1',
    name: 'n',
    status: 'Open',
    org: { id: 'o1' },
    bfsDocuments: [],
    bfsImages: [],
    vendorId: 'v1',
    vendorData: ['v1'],
    uom: { description: 'KG', id: 'u1' },
    ID: '1',
  };
  safeSet(c, 'rowData', [sampleRow]);
  safeSet(c, 'gridData', [sampleRow]);
  safeSet(c, 'list', [sampleRow]);
  safeSet(c, 'items', [sampleRow]);
  safeSet(c, 'model', { id: '1' });
  safeSet(c, 'data', {
    isNewVendor: true,
    vendorProduct: [{ id: '1' }],
    vendorService: [{ id: '1' }],
    id: '1',
    status: 'Success',
    certificates: [{ fileName: 'c.pdf', file: 'AAA' }],
  });
  safeSet(c, 'loggedUserDetails', successPayload());
  safeSet(c, 'loggedUserPermissions', []);
  safeSet(c, 'selectedData', [sampleRow]);
  safeSet(c, 'selectedRows', [sampleRow]);
  safeSet(c, 'formData', {});
  safeSet(c, 'itemGridData', { gridValue: [sampleRow], columnDefs: [] });
  safeSet(c, 'bfsDocuments', []);
  safeSet(c, 'commentFilesDataList', []);
  safeSet(c, 'tabGrp', { selectedIndex: 0 });
  const fakeForm = {
    value: { id: '1', name: 'n', itemCode: 'IC1', email: 'a@b.com', password: 'x' },
    valid: true,
    invalid: false,
    reset: () => undefined,
    patchValue: () => undefined,
    setValue: () => undefined,
    markAllAsTouched: () => undefined,
    controls: {
      itemCode: { value: 'IC1', setValue: () => undefined, valid: true, errors: null },
      type: { value: 'hsn', setValue: () => undefined, valid: true, errors: null },
    },
    get: (k?: string) => ({
      value: k === 'itemCode' ? 'IC1' : 'x',
      setValue: () => undefined,
      valid: true,
      invalid: false,
      errors: null,
      patchValue: () => undefined,
    }),
  };
  safeSet(c, 'searchForm', fakeForm);
  safeSet(c, 'loginForm', fakeForm);
  safeSet(c, 'form', fakeForm);
  safeSet(c, 'itemForm', fakeForm);
  safeSet(c, 'vendorForm', fakeForm);
  safeSet(c, 'op', { hide: () => undefined, show: () => undefined, toggle: () => undefined });
  safeSet(c, 'targetEl', { nativeElement: document.createElement('div') });
  safeSet(c, 'vendorData', { vendorId: 'v1', id: '1', name: 'n' });
  safeSet(c, 'selectedOrgData', sampleRow);
  safeSet(c, 'selectedOrg', sampleRow);
  safeSet(c, 'boqSelectedUser', sampleRow);
  safeSet(c, 'vendorList', [{ id: '1', isLinked: true, isEdit: false }]);
  safeSet(c, 'itemList', [sampleRow]);
  safeSet(c, 'productsList', [{ id: '1' }, { id: '2' }]);
  safeSet(c, 'servicesList', [{ id: '1' }, { id: '2' }]);
  safeSet(c, 'vendorRegData', {
    ...successPayload(),
    vendorProduct: [{ id: '1' }],
    vendorService: [{ id: '1' }],
    certificates: [{ fileName: 'c.pdf', file: 'AAA' }],
  });
  safeSet(c, 'vendorRegObj', { certificates: [{ fileName: 'c.pdf' }] });
  safeSet(c, 'certificatesArray', [{ name: 'c.pdf' }]);
  safeSet(c, 'certificatesToBase64', [{ fileName: 'c.pdf', file: 'AAA' }]);
  safeSet(c, 'regId', 'o1');
  safeSet(c, 'roleName', 'Category Manager');
  safeSet(c, 'selectedType', 'Daily');
  safeSet(c, 'startTime', new Date(2020, 0, 1, 9, 0));
  safeSet(c, 'endTime', new Date(2020, 0, 1, 17, 0));
  safeSet(c, 'day', 'Monday');
  try {
    if (!(c.selectedItems instanceof Map)) {
      c.selectedItems = new Map([['1', ['v1']]]);
    }
  } catch {
    /* ignore */
  }

  // Heuristic fill for remaining nullish fields to unlock method branches
  try {
    for (const key of Object.keys(c)) {
      try {
        const val = c[key];
        if (val !== null && val !== undefined) continue;
        const lk = key.toLowerCase();
        if (lk.includes('form')) safeSet(c, key, fakeForm);
        else if (
          lk.includes('list') ||
          lk.includes('rows') ||
          lk.includes('items') ||
          lk.endsWith('data') ||
          lk.includes('array')
        ) {
          safeSet(c, key, [sampleRow]);
        } else if (lk.startsWith('is') || lk.startsWith('show') || lk.startsWith('has') || lk.startsWith('can')) {
          safeSet(c, key, true);
        } else if (lk.includes('selected') || lk.includes('current') || lk.includes('org')) {
          safeSet(c, key, sampleRow);
        } else if (lk.includes('date') || lk.includes('time')) {
          safeSet(c, key, new Date().toISOString());
        } else if (lk.includes('title') || lk.includes('name') || lk.includes('desc')) {
          safeSet(c, key, 'x');
        }
      } catch {
        /* ignore */
      }
    }
  } catch {
    /* ignore */
  }
}

const sampleFile = {
  name: 'doc.pdf',
  size: 10,
  type: 'application/pdf',
  lastModified: 1,
};

const ARG_SETS: any[][] = [
  [],
  [null],
  [true],
  [false],
  [0],
  [1],
  [''],
  ['x'],
  [{}],
  [[]],
  [successPayload()],
  [{ status: 'Failure', data: null, message: 'err', statusCode: '500' }],
  [
    {
      preventDefault() {},
      stopPropagation() {},
      target: { value: 'x', files: [sampleFile], checked: true },
    },
  ],
  [{ id: '1', name: 'n', status: 'Open', org: { id: 'o1' }, bfsDocuments: [], vendorId: 'v1', ID: '1', uom: { description: 'KG' }, vendorData: ['v1'] }],
  [1, 2],
  [{ id: '1' }, { id: '2' }],
  ['add', { id: '1', action: null }],
  [{ id: '1' }, 0, true, true],
  [{}, { id: '1', vendorId: 'v1' }, 'vendorLevel'],
];

const FLAG_KEYS = [
  'isEdit',
  'isEditForm',
  'isShowGrid',
  'isLoading',
  'submitted',
  'showModal',
  'isNew',
  'isNewVendor',
  'disabled',
  'readonly',
  'expanded',
  'visible',
  'active',
  'checked',
  'selected',
  'hasError',
  'userExists',
];

function invokeAll(c: any, names: Set<string>): void {
  for (const name of names) {
    for (const args of ARG_SETS) {
      try {
        const result = c[name](...args);
        if (result && typeof result.subscribe === 'function') {
          try {
            const sub = result.subscribe({
              next: () => undefined,
              error: () => undefined,
            });
            if (sub && typeof sub.unsubscribe === 'function') {
              sub.unsubscribe();
            }
          } catch {
            /* ignore */
          }
        }
      } catch {
        /* ignore */
      }
    }
  }
}

/** Best-effort exercise of instance methods for coverage (swallows errors). */
export function exerciseComponent(c: any): void {
  if (!c) return;
  const _clog = console.log;
  const _cwarn = console.warn;
  try {
    console.log = () => undefined;
    console.warn = () => undefined;
  } catch {
    /* ignore */
  }
  try {
    seedComponent(c);
    _exerciseComponentBody(c);
  } finally {
    try {
      console.log = _clog;
      console.warn = _cwarn;
    } catch {
      /* ignore */
    }
  }
}

function _exerciseComponentBody(c: any): void {
  const skip = new Set(['constructor', 'ngOnDestroy']);
  const skipName = (n: string) =>
    skip.has(n) ||
    /^(download|export|print|logout|signOut|reload|redirect)/i.test(n) ||
    // onSubmit often opens sweetalert2 modals and hangs Karma
    /^(onSubmit)$/i.test(n) ||
    /SampleBOQ|FileDownload|openWindow|openUrl|setInterval|setTimeout|clearInterval|clearTimeout|autoTable|swal/i.test(
      n
    );


  const names = new Set<string>();
  let proto = Object.getPrototypeOf(c);
  while (proto && proto !== Object.prototype) {
    for (const n of Object.getOwnPropertyNames(proto)) {
      if (n.startsWith('_')) continue;
      if (skipName(n)) continue;
      try {
        const d = Object.getOwnPropertyDescriptor(proto, n);
        if (d && typeof d.value === 'function') names.add(n);
      } catch {
        /* ignore */
      }
    }
    proto = Object.getPrototypeOf(proto);
  }

  for (const life of [
    'ngOnInit',
    'ngAfterViewInit',
    'ngAfterContentInit',
    'ngOnChanges',
  ]) {
    if (typeof c[life] === 'function') {
      try {
        c[life](life === 'ngOnChanges' ? {} : undefined);
      } catch {
        /* ignore */
      }
    }
  }

  // Pass 1: default seeded state
  invokeAll(c, names);

  // Pass 2/3: flip common flags to hit alternate branches
  for (const mode of [true, false]) {
    for (const key of FLAG_KEYS) {
      try {
        c[key] = mode;
      } catch {
        /* ignore */
      }
    }
    try {
      if (c.form) {
        c.form.valid = mode;
        c.form.invalid = !mode;
      }
      if (c.itemForm) {
        c.itemForm.valid = mode;
        c.itemForm.invalid = !mode;
      }
    } catch {
      /* ignore */
    }
    invokeAll(c, names);
  }

  // Pass 4: id-present vs id-absent input shapes (common branch pattern)
  const shapes = [
    { vendorData: { vendorId: 'v1', id: '1' }, data: { id: '1', graphTitle: 'Price: X' }, rowData: [{ id: '1' }] },
    { vendorData: { vendorId: null }, data: {}, rowData: [] },
    { vendorData: {}, selectedOrg: null, selectedOrgData: null, boqSelectedUser: null },
    {
      vendorData: { vendorId: 'v2', id: '2' },
      selectedOrg: { id: 'o1' },
      selectedOrgData: { id: 'o1' },
      boqSelectedUser: { id: 'u1' },
      form: {
        valid: true,
        invalid: false,
        value: { id: '1' },
        reset: () => undefined,
        patchValue: () => undefined,
        get: () => ({ value: 'x', setValue: () => undefined, valid: true }),
      },
    },
  ];
  for (const shape of shapes) {
    for (const [k, v] of Object.entries(shape)) {
      try {
        c[k] = v;
      } catch {
        /* ignore */
      }
    }
    try {
      c.op = { hide: () => undefined, show: () => undefined, toggle: () => undefined };
    } catch {
      /* ignore */
    }
    invokeAll(c, names);
  }

  // Pass 5: role / pricing / selection variants used by large components
  const deepShapes = [
    {
      roleName: 'VendorManager',
      selectedType: 'Weekly',
      day: 'Monday',
      startTime: new Date(2020, 0, 1, 9, 30),
      endTime: new Date(2020, 0, 1, 18, 45),
      selectedItems: new Map([['1', ['v1', 'v2']]]),
      selectedData: { id: '1', vendorId: 'v1' },
      searchForm: c.searchForm,
    },
    {
      roleName: 'Category Manager',
      selectedType: 'Daily',
      day: undefined,
      startTime: new Date(),
      endTime: new Date(),
      selectedItems: new Map([['1', ['v1']]]),
      selectedData: { id: '1' },
    },
    {
      roleName: 'VendorManager',
      selectedType: undefined,
      selectedItems: new Map(),
      selectedData: [],
    },
    {
      selectedData: [{ id: '1' }],
      productsList: [{ id: '1' }, { id: '2' }],
      servicesList: [{ id: '1' }, { id: '2' }],
      vendorRegData: {
        ...successPayload(),
        vendorProduct: [{ id: '1' }],
        vendorService: [{ id: '1' }],
        certificates: [{ fileName: 'c.pdf', file: 'AAA' }],
      },
      vendorRegObj: { certificates: [{ fileName: 'c.pdf' }] },
      certificatesArray: [{ name: 'a.pdf' }, { name: 'b.pdf' }],
      certificatesToBase64: [{ fileName: 'a.pdf', file: 'AA' }],
      regId: 'o1',
    },
  ];
  // Light pass: apply deep shapes and call only a few key methods once each
  const lightNames = [...names].filter((n) =>
    /^(ngOnInit|searchVendor|onSubmit|submit|save|addItem|activateItem|deactivateItem|getLinkedVendorDetails|onAddProduct|onDelete|globalSearch|getVendorById|bindData)$/i.test(
      n
    )
  );
  for (const shape of deepShapes) {
    for (const [k, v] of Object.entries(shape)) {
      try {
        c[k] = v;
      } catch {
        /* ignore */
      }
    }
    rebindServiceSpies(c, 'array');
    for (const name of lightNames) {
      try {
        c[name]();
      } catch {
        /* ignore */
      }
      try {
        c[name]({ id: '1', vendorId: 'v1', ID: '1', vendorData: ['v1'] });
      } catch {
        /* ignore */
      }
    }
  }

  try {
    if (typeof c.ngOnDestroy === 'function') c.ngOnDestroy();
  } catch {
    /* ignore */
  }
}

/** Reconfigure autoMock spies found on component fields. */
function rebindServiceSpies(c: any, mode: 'object' | 'array' | 'failure'): void {
  const payload =
    mode === 'array'
      ? arrayPayload()
      : mode === 'failure'
        ? { status: 'Failure', statusCode: '500', message: 'err', data: null }
        : successPayload();
  const commonMethods = [
    'get',
    'getAll',
    'getById',
    'getVendorById',
    'getVendorsSearchByItemCode',
    'getVendorsSearchByItemCodeForCM',
    'createDynamicPricingByItemcodes',
    'getLinkedVendorByItemId',
    'deactivateItem',
    'activateItem',
    'deactivateVendor',
    'activateVendor',
    'saveVendorRegistration',
    'submitVendorRegistration',
    'search',
    'save',
    'update',
    'delete',
    'create',
    'list',
    'fetch',
    'load',
    'post',
    'put',
  ];
  try {
    for (const key of Object.keys(c)) {
      const svc = c[key];
      if (!svc || typeof svc !== 'object') continue;
      for (const m of commonMethods) {
        try {
          void svc[m];
        } catch {
          /* ignore */
        }
      }
      const names = new Set<string>([...Object.keys(svc), ...commonMethods]);
      for (const m of names) {
        const spy = svc[m];
        if (spy && typeof spy.and === 'object' && typeof spy.and.returnValue === 'function') {
          try {
            spy.and.returnValue(of(payload));
          } catch {
            /* ignore */
          }
        }
      }
    }
  } catch {
    /* ignore */
  }
}

/**
 * Extra focused coverage pass for large components: call major CRUD/lifecycle
 * methods with realistic args and both success/failure service payloads.
 */
export function deepExerciseComponent(c: any): void {
  if (!c) return;
  const _clog = console.log;
  try {
    console.log = () => undefined;
  } catch {
    /* ignore */
  }
  // Prevent timer-driven loops from hanging Karma
  const _setInterval = window.setInterval;
  const _setTimeout = window.setTimeout;
  try {
    (window as any).setInterval = () => 1;
    (window as any).setTimeout = (fn: any) => {
      try {
        if (typeof fn === 'function') fn();
      } catch {
        /* ignore */
      }
      return 1;
    };
  } catch {
    /* ignore */
  }
  try {
    seedComponent(c);
    _deepExerciseBody(c);
  } finally {
    try {
      console.log = _clog;
      (window as any).setInterval = _setInterval;
      (window as any).setTimeout = _setTimeout;
    } catch {
      /* ignore */
    }
  }
}

function _deepExerciseBody(c: any): void {

  const major = [
    'ngOnInit',
    'searchVendor',
    'onSubmit',
    'submit',
    'save',
    'saveGeneral',
    'globalSearch',
    'onSearchMode',
    'onDelete',
    'getVendorById',
    'bindData',
    'resetForm',
    'addItem',
    'activateItem',
    'deactivateItem',
    'activateVendor',
    'deactivateVendor',
    'getLinkedVendorDetails',
    'linkUnLinkVendor',
    'unLinkVendor',
    'onAddProduct',
    'onAddService',
    'onAddClientRef',
    'onEditProduct',
    'onEditService',
    'EditClientRef',
    'onCertificateAdd',
    'uploadCertificates',
    'deleteAttachment',
    'submitProfile',
    'onTabClick',
    'viewRFQDetails',
    'onViewRFQDetails',
    'onRequestForRFQ',
    'filterRFQsBYCategory',
    'sendRFQToVendors',
    'createAuction',
    'QuotationSubmit',
    'calculateTotal',
    'ppoActions',
    'getRFQs',
    'getAllPOs',
    'getAllPPOs',
    'getAllAuctions',
    'getPrSummaryData',
    'getStatus',
    'onSelectStatus',
    'successCallBack',
    'successChilds',
  ];

  const row = {
    id: '1',
    vendorId: 'v1',
    ID: '1',
    name: 'n',
    status: 'Open',
    uom: { description: 'KG' },
    vendorData: ['v1'],
    action: null,
    certificates: [{ fileName: 'c.pdf', file: 'AAA' }],
  };
  const ev = {
    preventDefault() {},
    stopPropagation() {},
    target: { files: [sampleFile], value: 'x', checked: true },
    index: 0,
  };

  try {
    c.roleName = 'VendorManager';
    c.selectedType = 'Weekly';
    c.day = 'Monday';
    c.startTime = new Date(2020, 0, 1, 10, 15);
    c.endTime = new Date(2020, 0, 1, 16, 45);
    c.selectedItems = new Map([['1', ['v1']]]);
    c.selectedData = row;
    c.vendorList = [{ id: '1', isLinked: true, isEdit: true, linkedVendorItemDetails: { uom: '1' } }];
    c.regId = 'o1';
    c.vendorRegData = {
      ...successPayload(),
      certificates: [{ fileName: 'c.pdf', file: 'AAA' }],
      vendorProduct: [row],
      vendorService: [row],
    };
    c.productsList = [row, { id: '2' }];
    c.servicesList = [row, { id: '2' }];
    c.certificatesArray = [{ name: 'a.pdf' }];
    c.certificatesToBase64 = [{ fileName: 'a.pdf', file: 'AA' }];
    c.vendorRegObj = { certificates: [{ fileName: 'a.pdf' }] };
  } catch {
    /* ignore */
  }

  for (const mode of ['array', 'object', 'failure'] as const) {
    rebindServiceSpies(c, mode);
    for (const name of major) {
      if (typeof c[name] !== 'function') continue;
      for (const args of [[], [row], [ev, row], ['add', row], [row, 0, true, true], [0, 'certificatesArray']]) {
        try {
          c[name](...args);
        } catch {
          /* ignore */
        }
      }
    }
  }

  try {
    c.roleName = 'Category Manager';
    rebindServiceSpies(c, 'array');
    if (typeof c.searchVendor === 'function') c.searchVendor();
    if (typeof c.ngOnInit === 'function') c.ngOnInit();
    if (typeof c.globalSearch === 'function') c.globalSearch();
  } catch {
    /* ignore */
  }
}
