import { Dish } from '../../types/index';

Component({
  properties: {
    dish: {
      type: Object,
      value: {}
    },
    isFavorite: {
      type: Boolean,
      value: false
    }
  },

  methods: {
    onCardTap() {
      this.triggerEvent('cardtap', { dish: this.properties.dish });
    },

    onFavoriteTap() {
      this.triggerEvent('favoritetap', { dish: this.properties.dish });
    }
  }
});
