/**
 * CloudBase 云开发工具类
 * 封装常用的云开发操作
 */

interface CloudResponse<T = any> {
  code: number;
  message: string;
  data: T | null;
}

export class CloudBase {
  /**
   * 调用云函数
   */
  static async callFunction(name: string, data: any = {}): Promise<CloudResponse> {
    try {
      const result = await wx.cloud.callFunction({
        name,
        data
      });
      
      return result.result as CloudResponse;
    } catch (error) {
      console.error(`调用云函数 ${name} 失败:`, error);
      return {
        code: 500,
        message: '网络请求失败',
        data: null
      };
    }
  }

  /**
   * 用户登录
   */
  static async userLogin(userInfo?: any): Promise<CloudResponse> {
    return this.callFunction('userLogin', { userInfo });
  }

  /**
   * 获取用户信息
   */
  static async getUserInfo(): Promise<CloudResponse> {
    return this.callFunction('getUserInfo');
  }

  /**
   * 更新用户信息
   */
  static async updateUserInfo(data: { nickName?: string; avatarUrl?: string }): Promise<CloudResponse> {
    return this.callFunction('updateUserInfo', data);
  }

  /**
   * 初始化数据库
   */
  static async initDatabase(): Promise<CloudResponse> {
    return this.callFunction('initDatabase');
  }

  /**
   * 检查云开发是否已初始化
   */
  static isInitialized(): boolean {
    try {
      wx.cloud.callFunction({ name: 'test' });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 上传文件到云存储
   */
  static async uploadFile(cloudPath: string, filePath: string): Promise<string> {
    try {
      const result = await wx.cloud.uploadFile({
        cloudPath,
        filePath
      });
      return result.fileID;
    } catch (error) {
      console.error('文件上传失败:', error);
      throw error;
    }
  }

  /**
   * 从云存储下载文件
   */
  static async downloadFile(fileID: string): Promise<string> {
    try {
      const result = await wx.cloud.downloadFile({
        fileID
      });
      return result.tempFilePath;
    } catch (error) {
      console.error('文件下载失败:', error);
      throw error;
    }
  }

  /**
   * 删除云存储文件
   */
  static async deleteFile(fileID: string): Promise<void> {
    try {
      await wx.cloud.deleteFile({
        fileList: [fileID]
      });
    } catch (error) {
      console.error('文件删除失败:', error);
      throw error;
    }
  }
}
