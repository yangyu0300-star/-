// 合规文档多语言版本。中文是原文，英文全量翻译，其余 6 语言由机器翻译兜底后人工润色。
// 结构：每个文档的 section 是一组有序的段落（title + body）。

export interface LegalSection {
  title: string;
  body: string;
}

export interface LegalDoc {
  updatedAt: string; // 上次更新日期（中文 "2026-11-10"）
  preamble: string;  // 文档开头的说明性文字
  sections: LegalSection[];
}

export interface LegalPack {
  community: LegalDoc;
  privacy: LegalDoc;
  terms: LegalDoc;
}
