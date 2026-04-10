import { storage } from '../../utils/storage';

Page({
  data: {
    currentDate: '',
    menus: [] as any[]
  },

  onShow() {
    this.loadMenu();
  },

  loadMenu() {
    const today = this.formatDate(Date.now());
    const menus = storage.get<any[]>('menu') || [];
    const todayMenus = menus.filter(m => m.date === today);
    
    this.setData({
      currentDate: today,
      menus: todayMenus
    });
  },

  formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  getMealsByType(mealType: string) {
    return this.data.menus.filter(m => m.mealType === mealType);
  },

  onDeleteMeal(e: any) {
    const dishId = e.currentTarget.dataset.id;
    const mealType = e.currentTarget.dataset.type;
    
    const menus = storage.get<any[]>('menu') || [];
    const newMenus = menus.filter(m => !(m.dishId === dishId && m.mealType === mealType && m.date === this.data.currentDate));
    
    storage.set('menu', newMenus);
    this.loadMenu();
    
    wx.showToast({ title: '已删除', icon: 'success' });
  }
});
