import crypto from "node:crypto";

/**
 * 管理员密钥的统一规则：
 *  - 前端只让管理员输入明文密码
 *  - 服务端把它算成 md5 哈希，之后所有 RPC 调用都只传这个哈希
 *  - 数据库里存的也是同一个哈希（见 supabase/admin.sql）
 *  - 浏览器 cookie 里存的也是哈希，不是明文密码
 */
export const ADMIN_COOKIE = "rr_admin";

const SALT = "boxuezhe-admin-v1:";

export function hashAdminPassword(password: string): string {
  return crypto
    .createHash("md5")
    .update(`${SALT}${password}`)
    .digest("hex");
}
