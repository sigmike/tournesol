import { getForEnv, generateImportWrappers, writeManifest } from './utils.js';

const env = process.env.TOURNESOL_ENV || 'production';

const urlPermissions = getForEnv(
  {
    production: ['https://tournesol.app/', 'https://api.tournesol.app/'],
    'dev-env': [
      'http://localhost/',
      'http://localhost:3000/',
      'http://localhost:8000/',
    ],
  },
  env
);

const tournesolContentScriptMatches = getForEnv(
  {
    production: ['https://tournesol.app/*'],
    'dev-env': ['http://localhost:3000/*'],
  },
  env
);

const manifest = {
  name: 'Tournesol Extension',
  version: '3.4.0',
  description: 'Open Tournesol directly from YouTube',
  permissions: [
    ...urlPermissions,
    'https://www.youtube.com/',
    'activeTab',
    'contextMenus',
    'storage',
    'webNavigation',
    'webRequest',
    'webRequestBlocking',
  ],
  manifest_version: 2,
  icons: {
    64: 'Logo64.png',
    128: 'Logo128.png',
    512: 'Logo512.png',
  },
  background: {
    page: 'background.html',
    persistent: true,
  },
  browser_action: {
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
      js: ['addVideoStatistics.js', 'addModal.js', 'addRateButtons.js'],
      css: ['addVideoStatistics.css', 'addModal.css', 'addRateButtons.css'],
      run_at: 'document_end',
      all_frames: true,
    },
    {
      matches: tournesolContentScriptMatches,
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
  web_accessible_resources: [
    'Logo128.png',
    'html/*',
    'images/*',
    'utils.js',
    'models/*',
  ],
};

(async () => {
  await generateImportWrappers(manifest);
  await writeManifest(manifest, 'src/manifest.json');
})();
