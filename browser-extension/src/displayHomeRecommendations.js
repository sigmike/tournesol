(async () => {
  const [
    { TournesolRecommendations },
    { TournesolRecommendationsOptions },
    { Banner },
    { BannerOptions },
    { fetchBanner },
  ] = await Promise.all(
    [
      './models/tournesolRecommendations/TournesolRecommendations.js',
      './models/tournesolRecommendations/TournesolRecommendationsOptions.js',
      './models/banner/Banner.js',
      './models/banner/BannerOptions.js',
      './models/banner/fetchBanner.js',
    ].map((path) => import(chrome.runtime.getURL(path)))
  );

  const banner = await fetchBanner();

  const options = new TournesolRecommendationsOptions({
    videosPerRow: 4,
    rowsWhenExpanded: 3,
    banner: new Banner(
      new BannerOptions(
        banner.date_start,
        banner.date_end,
        banner.action_link,
        banner.action_link,
        undefined
      )
    ),
    parentComponentQuery: '#primary > ytd-rich-grid-renderer',
    displayCriteria: false,
  });
  const homeRecommendations = new TournesolRecommendations(options);

  const process = () => {
    // Display the home page recommendations.
    if (location.pathname === '/') {
      homeRecommendations.process();
    } else {
      homeRecommendations.clear();
    }
  };

  /**
   * YouTube doesn't completely load a video page. The content script needs
   * these events to run correctly.
   */
  document.addEventListener('yt-navigate-finish', process);

  if (document.body) {
    process();
  } else {
    document.addEventListener('DOMContentLoaded', process);
  }
})();
