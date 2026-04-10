import { Dish } from '../../types/index';
import { storage } from '../../utils/storage';

Page({
  data: {
    favoriteDishes: [] as Dish[]
  },

  onShow() {
    this.loadFavorites();
  },

  loadFavorites() {
    const favorites = storage.get<string[]>('favorites') || [];
    const dishes = storage.get<Dish[]>('dish_list') || [];
    
    const favoriteDishes = dishes.filter(dish => favorites.includes(dish.id));
    this.setData({ favoriteDishes });
  },

  onDishTap(e: any) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },

  onDeleteFavorite(e: any) {
    const id = e.currentTarget.dataset.id;
    const favorites = storage.get<string[]>('favorites') || [];
    const newFavorites = favorites.filter(favId => favId !== id);
    
    storage.set('favorites', newFavorites);
    this.loadFavorites();
    
    wx.showToast({ title: '已取消收藏', icon: 'success' });
  }
});
