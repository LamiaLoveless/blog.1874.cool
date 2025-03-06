// 0.12.0及以上版本用法
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { matterMarkdownAdapter } = require("@elog/cli");

/**
 * 自定义文档插件
 * @param {DocDetail} doc doc的类型定义为 DocDetail
 * @param {ImageClient} imageClient 图床下载器，可用于图片上传
 * @return {Promise<DocDetail>} 返回处理后的文档对象
 */
const format = async (doc, imageClient) => {
  // 处理 draft 字段
  doc.properties.draft = doc.properties.status.name !== "Done";

  // 处理 hidden 字段
  doc.properties.hidden = !!doc.properties.hidden;

  // 处理 comment 字段
  doc.properties.comment = !!doc.properties.comment; // 确保 comment 是布尔值

  // 删除 status 字段
  delete doc.properties.status;

  // 处理 cover 字段
  const cover = doc.properties.cover;
  if (cover) {
    // 将 cover 字段中的 notion 图片下载到本地
    // 只有启用图床平台 image.enable=true 时，imageClient 才能用，否则请自行实现图片上传
    // cover 链接替换为本地图片
    doc.properties.cover = await imageClient.uploadImageFromUrl(cover, doc);
  }

  // 使用 matterMarkdownAdapter 处理文档内容
  doc.body = matterMarkdownAdapter(doc);
  return doc;
};

module.exports = {
  format,
};