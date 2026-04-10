// components/logout-confirm/logout-confirm.ts
Component({
  properties: {
    visible: {
      type: Boolean,
      value: false
    }
  },

  methods: {
    /**
     * 点击遮罩层关闭
     */
    onMaskTap() {
      this.triggerEvent('cancel');
    },

    /**
     * 阻止事件冒泡
     */
    stopPropagation() {
      // 空函数，仅用于阻止事件冒泡
    },

    /**
     * 取消按钮
     */
    onCancel() {
      this.triggerEvent('cancel');
    },

    /**
     * 确认按钮
     */
    onConfirm() {
      this.triggerEvent('confirm');
    }
  }
});
