import { Dish } from '../../types/index';
import { storage } from '../../utils/storage';

interface IndexData {
  searchKeyword: string;
  currentCategory: string;
  categories: string[];
  dishList: Dish[];
  allDishes: Dish[];
  favorites: string[];
}

Page({
  data: {
    searchKeyword: '',
    currentCategory: '全部',
    categories: ['全部', '川菜', '粤菜', '湘菜', '鲁菜', '浙菜', '闽菜', '苏菜', '徽菜'],
    dishList: [] as Dish[],
    allDishes: [] as Dish[],
    favorites: [] as string[]
  },

  onLoad() {
    this.loadDishes();
    this.loadFavorites();
  },

  onPullDownRefresh() {
    this.loadDishes();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },

  loadDishes() {
    const dishes = storage.get<Dish[]>('dish_list') || this.getMockDishes();
    if (!storage.get<Dish[]>('dish_list')) {
      storage.set('dish_list', dishes);
    }
    this.setData({
      allDishes: dishes as Dish[],
      dishList: dishes as Dish[]
    });
  },

  loadFavorites() {
    const favorites = storage.get<string[]>('favorites') || [];
    this.setData({ favorites: favorites as string[] });
  },

  getMockDishes(): Dish[] {
    return [
      {
        id: '1',
        name: '宫保鸡丁',
        images: ['https://picsum.photos/400/300?random=1'],
        category: '川菜',
        description: '经典川菜',
        steps: '1. 准备食材\n2. 炒制',
        tags: ['辣', '下饭'],
        rating: 4.8,
        ratingCount: 128,
        authorId: 'user1',
        authorName: '美食达人',
        authorAvatar: 'https://picsum.photos/100/100?random=1',
        createTime: Date.now(),
        updateTime: Date.now(),
        favoriteCount: 256
      },
      {
        id: '2',
        name: '清蒸鲈鱼',
        images: ['https://picsum.photos/400/300?random=2'],
        category: '粤菜',
        description: '鲜美可口',
        steps: '1. 处理鱼\n2. 蒸制',
        tags: ['清淡', '健康'],
        rating: 4.6,
        ratingCount: 96,
        authorId: 'user2',
        authorName: '厨艺大师',
        authorAvatar: 'https://picsum.photos/100/100?random=2',
        createTime: Date.now(),
        updateTime: Date.now(),
        favoriteCount: 189
      },
      {
        id: '3',
        name: '剁椒鱼头',
        images: ['https://picsum.photos/400/300?random=3'],
        category: '湘菜',
        description: '香辣过瘾',
        steps: '1. 准备鱼头\n2. 蒸制',
        tags: ['辣', '湘菜'],
        rating: 4.7,
        ratingCount: 112,
        authorId: 'user3',
        authorName: '湘菜专家',
        authorAvatar: 'https://picsum.photos/100/100?random=3',
        createTime: Date.now(),
        updateTime: Date.now(),
        favoriteCount: 223
      }
    ];
  },

  onSearchInput(e: any) {
    const keyword = e.detail.value;
    this.setData({ searchKeyword: keyword });
    this.filterDishes();
  },

  onCategoryTap(e: any) {
    const category = e.currentTarget.dataset.category;
    this.setData({ currentCategory: category });
    this.filterDishes();
  },

  filterDishes() {
    const { searchKeyword, currentCategory, allDishes } = this.data;
    
    let filtered = [...allDishes];
    
    if (currentCategory !== '全部') {
      filtered = filtered.filter((dish: Dish) => dish.category === currentCategory);
    }
    
    if (searchKeyword) {
      filtered = filtered.filter((dish: Dish) => 
        dish.name.includes(searchKeyword)
      );
    }
    
    this.setData({ dishList: filtered });
  },

  onCardTap(e: any) {
    const dish = e.detail.dish;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${dish.id}`
    });
  },

  onFavoriteTap(e: any) {
    const dish = e.detail.dish;
    const favorites: string[] = [...this.data.favorites];
    const index = favorites.indexOf(dish.id);
    
    if (index > -1) {
      favorites.splice(index, 1);
      wx.showToast({ title: '已取消收藏', icon: 'none' });
    } else {
      favorites.push(dish.id);
      wx.showToast({ title: '收藏成功', icon: 'success' });
    }
    
    this.setData({ favorites });
    storage.set('favorites', favorites);
  },

  goToPublish() {
    wx.switchTab({
      url: '/pages/publish/publish'
    });
  }
});
