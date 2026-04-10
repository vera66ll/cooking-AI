Component({
  properties: {
    images: {
      type: Array,
      value: []
    },
    maxCount: {
      type: Number,
      value: 9
    }
  },

  methods: {
    onChooseImage() {
      const maxCount = this.properties.maxCount;
      const currentCount = this.properties.images.length;
      const remainCount = maxCount - currentCount;

      wx.chooseMedia({
        count: remainCount,
        mediaType: ['image'],
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          const tempFiles = res.tempFiles.map(file => file.tempFilePath);
          const newImages = [...this.properties.images, ...tempFiles];
          this.setData({ images: newImages });
          this.triggerEvent('change', { images: newImages });
        }
      });
    },

    onDeleteImage(e: any) {
      const index = e.currentTarget.dataset.index;
      const images = this.properties.images.filter((_, i) => i !== index);
      this.setData({ images });
      this.triggerEvent('change', { images });
    },

    onPreviewImage(e: any) {
      const index = e.currentTarget.dataset.index;
      wx.previewImage({
        urls: this.properties.images as string[],
        current: this.properties.images[index]
      });
    }
  }
});
