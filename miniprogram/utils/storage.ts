const STORAGE_KEYS = {
  DISH_LIST: 'dish_list',
  FAVORITES: 'favorites',
  MENU: 'menu',
  PUBLISH_DRAFT: 'publish_draft',
  USER_INFO: 'user_info',
};

export const storage = {
  get<T>(key: string): T | null {
    try {
      const data = wx.getStorageSync(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('读取存储失败:', e);
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      wx.setStorageSync(key, JSON.stringify(value));
    } catch (e) {
      console.error('写入存储失败:', e);
    }
  },

  remove(key: string): void {
    try {
      wx.removeStorageSync(key);
    } catch (e) {
      console.error('删除存储失败:', e);
    }
  },

  clear(): void {
    try {
      wx.clearStorageSync();
    } catch (e) {
      console.error('清空存储失败:', e);
    }
  },
};

export const format = {
  formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  formatRating(rating: number): string {
    return rating.toFixed(1);
  },

  formatCount(count: number): string {
    if (count >= 10000) {
      return (count / 10000).toFixed(1) + 'w';
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return String(count);
  },
};

export const validator = {
  isNotEmpty(str: string): boolean {
    return !!(str && str.trim().length > 0);
  },

  isValidUrl(url: string): boolean {
    try {
      const urlPattern = /^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      return urlPattern.test(url);
    } catch {
      return false;
    }
  },

  isValidRating(rating: number): boolean {
    return rating >= 0 && rating <= 5;
  },
};
