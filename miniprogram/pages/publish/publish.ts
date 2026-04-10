import { Dish } from '../../types/index';
import { storage, validator } from '../../utils/storage';

Page({
  data: {
    images: [] as string[],
    formData: {
      name: '',
      category: '',
      description: ''
    },
    categories: ['川菜', '粤菜', '湘菜', '鲁菜', '浙菜', '闽菜', '苏菜', '徽菜'],
    categoryIndex: -1,
    tags: [] as string[],
    tagInput: ''
  },

  onLoad() {
    this.loadDraft();
  },

  loadDraft() {
    const draft = storage.get<any>('publish_draft');
    if (draft) {
      this.setData(draft);
    }
  },

  saveDraft() {
    storage.set('publish_draft', this.data);
  },

  onImagesChange(e: any) {
    this.setData({ images: e.detail.images });
    this.saveDraft();
  },

  onNameInput(e: any) {
    this.setData({ 'formData.name': e.detail.value });
    this.saveDraft();
  },

  onCategoryChange(e: any) {
    const index = Number(e.detail.value);
    this.setData({ 
      categoryIndex: index,
      'formData.category': this.data.categories[index]
    });
    this.saveDraft();
  },

  onDescriptionInput(e: any) {
    this.setData({ 'formData.description': e.detail.value });
    this.saveDraft();
  },

  onTagInput(e: any) {
    this.setData({ tagInput: e.detail.value });
  },

  onAddTag() {
    const { tagInput, tags } = this.data;
    if (validator.isNotEmpty(tagInput) && !tags.includes(tagInput)) {
      this.setData({ 
        tags: [...tags, tagInput],
        tagInput: ''
      });
      this.saveDraft();
    }
  },

  onDeleteTag(e: any) {
    const index = e.currentTarget.dataset.index;
    const tags = this.data.tags.filter((_, i) => i !== index);
    this.setData({ tags });
    this.saveDraft();
  },

  onPublish() {
    const { images, formData, tags } = this.data;

    if (!validator.isNotEmpty(formData.name)) {
      wx.showToast({ title: '请输入菜品名称', icon: 'none' });
      return;
    }

    if (images.length === 0) {
      wx.showToast({ title: '请至少上传一张图片', icon: 'none' });
      return;
    }

    if (!validator.isNotEmpty(formData.category)) {
      wx.showToast({ title: '请选择菜系', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '发布中...' });

    const dishes = storage.get<Dish[]>('dish_list') || [];
    
    const newDish: Dish = {
      id: String(Date.now()),
      name: formData.name,
      images: images,
      category: formData.category,
      description: formData.description,
      steps: formData.description,
      tags: tags,
      rating: 0,
      ratingCount: 0,
      authorId: 'current_user',
      authorName: '我',
      authorAvatar: 'https://picsum.photos/100/100?random=user',
      createTime: Date.now(),
      updateTime: Date.now(),
      favoriteCount: 0
    };

    dishes.unshift(newDish);
    storage.set('dish_list', dishes);

    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({ title: '发布成功', icon: 'success' });
      
      storage.remove('publish_draft');
      
      setTimeout(() => {
        wx.switchTab({ url: '/pages/index/index' });
      }, 1500);
    }, 1000);
  }
});
