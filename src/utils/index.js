/**
 * @description 路径修改
 * @param {*} path 
 * @returns 
 */
export function withBase(path) {
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}