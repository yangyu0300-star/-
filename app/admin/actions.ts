"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import { ADMIN_COOKIE, hashAdminPassword } from "@/lib/admin";

async function requireAdminKey(): Promise<string | null> {
  const store = await cookies();
  const key = store.get(ADMIN_COOKIE)?.value;
  if (!key) return null;

  const { data, error } = await supabase.rpc("admin_check", { p_key: key });
  if (error || !data) return null;
  return key;
}

export async function adminLogin(input: { password: string }) {
  const password = input.password.trim();

  if (password.length < 6 || password.length > 64) {
    return { ok: false as const, error: "管理员密码需 6–64 位。" };
  }

  const key = hashAdminPassword(password);
  const { data, error } = await supabase.rpc("admin_check", { p_key: key });

  if (error) {
    return { ok: false as const, error: `校验失败：${error.message}` };
  }
  if (!data) {
    return { ok: false as const, error: "密码不对。" };
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE, key, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
  });

  revalidatePath("/admin");
  return { ok: true as const };
}

export async function adminLogout() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  revalidatePath("/admin");
  return { ok: true as const };
}

export async function adminAct(input: {
  reportId: string;
  commentId: string;
  action: "remove" | "restore" | "dismiss";
}) {
  const key = await requireAdminKey();
  if (!key) {
    return { ok: false as const, error: "登录已失效，请重新登录。" };
  }
  if (!input.commentId) {
    return { ok: false as const, error: "评论编号无效。" };
  }

  if (input.action === "dismiss") {
    if (!input.reportId) {
      return { ok: false as const, error: "举报编号无效。" };
    }
    const { error } = await supabase.rpc("admin_delete_report", {
      p_key: key,
      p_report_id: input.reportId,
    });
    if (error) {
      return { ok: false as const, error: `忽略举报失败：${error.message}` };
    }
    revalidatePath("/admin");
    return { ok: true as const };
  }

  const nextStatus = input.action === "remove" ? "removed" : "visible";
  const { data, error } = await supabase.rpc("admin_set_comment_status", {
    p_key: key,
    p_comment_id: input.commentId,
    p_status: nextStatus,
  });

  if (error) {
    return { ok: false as const, error: `操作失败：${error.message}` };
  }
  if (!data) {
    return { ok: false as const, error: "这条评论可能已被删除。" };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  return { ok: true as const };
}
