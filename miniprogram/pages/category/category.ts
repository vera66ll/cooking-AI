import { storage } from '../../utils/storage';

Page({
  data: {
    categories: [
      { name: '川菜', icon: '🌶️', count: 0 },
      { name: '粤菜', icon: '🥟', count: 0 },
      { name: '湘菜', icon: '🐟', count: 0 },
      { name: '鲁菜', icon: '🍖', count: 0 },
      { name: '浙菜', icon: '🦀', count: 0 },
      { name: '闽菜', icon: '🍜', count: 0 },
      { name: '苏菜', icon: '🥘', count: 0 },
      { name: '徽菜', icon: '🍲', count: 0 }
    ]
  },

  onShow() {
    this.updateCategoryCounts();
  },

  updateCategoryCounts() {
    const dishes = storage.get<any[]>('dish_list') || [];
    const categories = this.data.categories.map(cat => ({
      ...cat,
      count: dishes.filter(d => d.category === cat.name).length
    }));
    
    this.setData({ categories });
  },

  onCategoryTap(e: any) {
    const category = e.currentTarget.dataset.category;
    wx.navigateTo({
      url: `/pages/index/index?category=${category}`
    });
  }
});
