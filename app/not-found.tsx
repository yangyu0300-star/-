import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell">
      <div className="fallback">
        <p className="fallback-code">404</p>
        <h1>这个页面不存在</h1>
        <p>话题可能已被删除，或者链接不正确。</p>
        <p className="fallback-alt">This page doesn&apos;t exist.</p>
        <div className="fallback-actions">
          <Link className="submit" href="/">
            回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
