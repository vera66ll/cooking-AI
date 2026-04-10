import { Dish } from '../../types/index';
import { storage } from '../../utils/storage';

Page({
  data: {
    dishId: '',
    dish: null as Dish | null
  },

  onLoad(options: any) {
    if (options.id) {
      this.setData({ dishId: options.id });
      this.loadDish(options.id);
    }
  },

  loadDish(id: string) {
    const dishes = storage.get<Dish[]>('dish_list') || [];
    const dish = dishes.find(d => d.id === id);
    
    if (dish) {
      this.setData({ dish });
    } else {
      wx.showToast({ title: '菜品不存在', icon: 'none' });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  formatTime(timestamp: number): string {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  onAddToMenu() {
    wx.showActionSheet({
      itemList: ['早餐', '午餐', '晚餐'],
      success: (res) => {
        const mealTypes = ['breakfast', 'lunch', 'dinner'];
        const mealType = mealTypes[res.tapIndex];
        
        const menus = storage.get<any[]>('menu') || [];
        const today = this.formatTime(Date.now());
        
        menus.push({
          dishId: this.data.dishId,
          dishName: this.data.dish?.name,
          dishImage: this.data.dish?.images[0],
          mealType,
          date: today
        });
        
        storage.set('menu', menus);
        wx.showToast({ title: '已加入菜单', icon: 'success' });
      }
    });
  },

  onRate() {
    wx.showModal({
      title: '评分',
      content: '请为这道菜打分',
      editable: false,
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: '评分成功', icon: 'success' });
        }
      }
    });
  }
});
