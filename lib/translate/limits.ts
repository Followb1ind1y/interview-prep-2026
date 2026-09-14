/** 纯常量单独放：客户端只需要这两个数，从 types.ts 引会把 zod 整个打进浏览器 */
export const MAX_TEXT_LENGTH = 1200
/**
 * 上下文只是给模型判断词义用，不需要整段。
 * 实测每多一个 token 都是每次调用都要重发的成本，400 字符足够定位词义。
 */
export const MAX_CONTEXT_LENGTH = 400
