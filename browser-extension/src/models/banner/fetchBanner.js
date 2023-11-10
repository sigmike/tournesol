const fetchBanners = async () =>
  new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ message: 'getBanners' }, (result) => {
      console.log({ result });
      if (result === undefined) {
        reject(new Error(chrome.runtime.lastError));
        return;
      }
      const { banners } = result;
      console.log({ banners });
      if (banners) resolve(banners.results);
      else reject(new Error('Invalid API response'));
    });
  });

const sortBanners = (a, b) => {
  // This function also exists in frontend/src/features/banners/WebsiteBanners.tsx
  if (a.security_advisory && !b.security_advisory) {
    return -1;
  }
  if (!a.security_advisory && b.security_advisory) {
    return 1;
  }
  if (a.priority !== undefined && b.priority !== undefined) {
    return b.priority - a.priority;
  }

  return 0;
};

const selectBanner = (banners) => {
  banners.sort(sortBanners);
  return banners[0];
};

export const fetchBanner = async () => {
  try {
    const banners = await fetchBanners();
    const banner = selectBanner(banners);
    return banner;
  } catch (e) {
    console.warn('Error while fetching Tournesol banners:', e);
    return;
  }
};
