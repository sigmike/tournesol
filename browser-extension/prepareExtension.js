import {
  getForEnv,
  generateImportWrappers,
  writeManifest,
  writeConfig,
  readPackage,
} from './prepareTools.js';

const env = process.env.TOURNESOL_ENV || 'production';
const manifestVersion = parseInt(process.env.MANIFEST_VERSION || '2');

if (manifestVersion != 2 && manifestVersion != 3)
  throw new Error(`Invalid manifest version: ${manifestVersion}`);

const { version } = await readPackage();

const hostPermissions = [
  ...getForEnv(
    {
      production: ['https://tournesol.app/', 'https://api.tournesol.app/'],
      'dev-env': [
        'http://localhost/',
        'http://localhost:3000/',
        'http://localhost:8000/',
      ],
    },
    env
  ),
  'https://www.youtube.com/',
];

const permissions = [
  'activeTab',
  'contextMenus',
  'storage',
  'webNavigation',
  'webRequest',
  'webRequestBlocking',
];

const allPermissions =
  manifestVersion === 2
    ? { permissions: [...hostPermissions, ...permissions] }
    : { permissions, host_permissions: hostPermissions };

const youtubeWebAccessibleResources = [
  'Logo128.png',
  'html/*',
  'images/*',
  'utils.js',
  'models/*',
  'config.js',
];

const manifest = {
  name: 'Tournesol Extension',
  version,
  description: 'Open Tournesol directly from YouTube',
  ...allPermissions,
  manifest_version: manifestVersion,
  icons: {
    64: 'Logo64.png',
    128: 'Logo128.png',
    512: 'Logo512.png',
  },
  background:
    manifestVersion === 2
      ? { page: 'background.html', persistent: true }
      : {
          service_worker: 'background.js',
          type: 'module',
        },
  [manifestVersion === 2 ? 'browser_action' : 'action']: {
    default_icon: {
      16: 'Logo16.png',
      64: 'Logo64.png',
    },
    default_title: 'Tournesol actions',
    default_popup: 'browserAction/menu.html',
  },
  content_scripts: [
    {
      matches: ['https://*.youtube.com/*'],
      js: ['displayHomeRecommendations.js', 'displaySearchRecommendations.js'],
      css: ['addTournesolRecommendations.css'],
      run_at: 'document_start',
      all_frames: true,
    },
    {
      matches: ['https://*.youtube.com/*'],
      js: ['addVideoStatistics.js', 'addModal.js', 'addVideoButtons.js'],
      css: ['addVideoStatistics.css', 'addModal.css', 'addVideoButtons.css'],
      run_at: 'document_end',
      all_frames: true,
    },
    {
      matches: getForEnv(
        {
          production: ['https://tournesol.app/*'],
          'dev-env': ['http://localhost:3000/*'],
        },
        env
      ),
      js: [
        'fetchTournesolToken.js',
        'fetchTournesolRecommendationsLanguages.js',
      ],
      run_at: 'document_end',
      all_frames: true,
    },
  ],
  options_ui: {
    page: 'options/options.html',
    open_in_tab: true,
  },
  default_locale: 'en',
  web_accessible_resources:
    manifestVersion === 2
      ? youtubeWebAccessibleResources
      : [
          {
            matches: ['https://www.youtube.com/*'],
            resources: youtubeWebAccessibleResources,
          },
        ],
};

// Please DO NOT add a trailing slash to front end URL, this prevents
// creating duplicates in our web analytics tool
const config = {
  manifestVersion,
  ...getForEnv(
    {
      production: {
        frontendUrl: 'https://tournesol.app',
        frontendHost: 'tournesol.app',
        apiUrl: 'https://api.tournesol.app',
      },
      'dev-env': {
        frontendUrl: 'http://localhost:3000',
        frontendHost: 'localhost:3000',
        apiUrl: 'http://localhost:8000',
      },
    },
    env
  ),
};

(async () => {
  await generateImportWrappers(manifest, youtubeWebAccessibleResources);
  await writeManifest(manifest, 'src/manifest.json');
  await writeConfig(config, 'src/config.js');
})();
