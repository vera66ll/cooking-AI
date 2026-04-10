Component({
  properties: {
    rating: {
      type: Number,
      value: 0
    },
    showText: {
      type: Boolean,
      value: true
    },
    readonly: {
      type: Boolean,
      value: false
    }
  },

  methods: {
    onStarTap(e: any) {
      if (this.properties.readonly) return;
      
      const rating = e.currentTarget.dataset.rating;
      this.triggerEvent('change', { rating });
    }
  }
});
