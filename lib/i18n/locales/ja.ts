import type { MsgKey } from "../index";

export const ja: Record<MsgKey, string> = {
  brand: "Boxuezhe",
  tagline: "新しいコメントは、ひとつ前のコメントにしか反論できない",
  backToList: "← トピック一覧へ戻る",
  cancel: "キャンセル",
  submitFailed: "送信に失敗しました。しばらくしてからもう一度お試しください。",

  ruleA: "ここに並列する意見はなく、あるのは",
  ruleStrong: "ひとつの連鎖",
  ruleC:
    "だけです。発言するには、すぐ上のコメントに反論してください。ルールは遊びの一部であり、段を飛ばした返信は認められません。",

  searchPlaceholder: "トピックのタイトルや概要を検索",
  searchBtn: "検索",
  clear: "クリア",
  homeTitle: "進行中の議論",
  homeSubtitle: "トピックを選び、連鎖の末尾にあなたの反論をつなげてください。",
  searchTitle: "「{q}」を検索",
  searchSub: "{n} 件のトピックが見つかりました。",
  emptySearch: "一致するトピックがありません。別のキーワードをお試しください。",
  emptyNone: "まだトピックがありません。最初の一本を立ててみましょう。",
  newTopic: "＋ 新しいトピック",
  comments: "{n} 件のコメント",
  lastActivity: "最終更新 {d}",
  startedAt: "{d} に開始",

  topicStarted: "{d} に開始",
  chainTitle: "コメントの連鎖",
  chainMeta: "全 {n} 環 · 上から下へ順にバトンをつなぐ",
  removedBadge: "削除済み",
  ring: "第 {n} 環",
  removedText: "このコメントはコミュニティ規約違反のため削除されました",
  voteHint:
    "この2つのボタンは議論の過程だけを評価し、あなたが意見に同意するかは評価しません。同意できないなら、連鎖で反論してください。",
  qualityHint:
    "このトピックには十分な投票があります。ラベルは同じトピック内での相対比較です：意見の正しさではなく論証を評価し、並び順は変えません。",
  voteUp: "論理は通っている",
  voteDown: "論理に穴がある",
  qualitySolid: "論証がより充実",
  qualityFlawed: "論証に補足が必要",
  reportToggle: "このコメントを報告",
  reportedNote: "報告済み、対応待ち",
  reportTitle: "報告の理由を選択",
  reportSubmit: "報告を送信",
  reportBusy: "送信中…",
  reportIllegal: "違法・規約違反の内容",
  reportSpam: "広告・勧誘",
  reportAttack: "人格攻撃",
  reportOther: "その他",
  translateBtn: "日本語に翻訳",
  translateHide: "翻訳を閉じる",
  translating: "翻訳中…",
  translateFailed: "翻訳に失敗しました。しばらくしてからお試しください。",

  targetTail: "あなたの反論の対象は、連鎖の末尾にある唯一のコメントです：",
  targetTailRemoved:
    "あなたの反論の対象は連鎖の末尾のコメントですが、削除されています（{removed}）。それでもその後に続き、位置は保たれます。",
  targetFirst: "このトピックにはまだコメントがありません。あなたが第1環になります。",
  authorLabel: "あなたのニックネーム",
  authorPlaceholder: "最大20文字",
  typeGroup: "反論の種類を選択",
  typeFull: "全面的な反論",
  typeFullDesc: "主張全体が成立しない、前提も含めて。",
  typePartial: "部分的な反論",
  typePartialDesc: "一部には同意するが、一箇所は反論が必要。",
  reasonHeading: "反論の理由（固定の書き出し以外）",
  countRange: "{n} / {max}、最低 {min}",
  lockedTag: "固定の書き出し · 変更不可",
  reasonPlaceholder:
    "書き出しの後に続く内容だけを書いてください。上のどこが成立しないのか、なぜかを明確に。",
  quoteLabel: "どの部分に反論しますか？（引用または要約、必須）",
  quotePlaceholder:
    "例：前のコメントの「以後の引き締めはすべて裏切りと見なされる」という箇所",
  footHint:
    "あなたの反論は連鎖の末尾につながり、次のコメントが反論できる唯一の対象になります。",
  replySubmit: "この環をつなぐ",

  errAuthorRequired: "ニックネームを入力してください。",
  errAuthorMax: "ニックネームは最大 {max} 文字です。",
  errTypeRequired: "先に「全面的な反論」か「部分的な反論」を選んでください。",
  errReasonEmpty: "反論の理由は空にできません。",
  errReasonMin: "反論の理由は最低 {min} 文字必要です（現在 {n} 文字）。",
  errReasonMax: "反論の理由は最大 {max} 文字です（現在 {n} 文字）。",
  errQuoteRequired: "部分的な反論では、反論する部分を具体的に示す必要があります。",
  errQuoteMax: "引用は {max} 文字以内にしてください（現在 {n} 文字）。",
  errTitleMin: "タイトルは最低 {min} 文字必要です（現在 {n} 文字）。",
  errTitleMax: "タイトルは最大 {max} 文字です（現在 {n} 文字）。",
  errSummaryMax: "概要は最大 {max} 文字です（現在 {n} 文字）。",
  errBodyMin: "本文は最低 {min} 文字必要です（現在 {n} 文字）。",
  errBodyMax: "本文は最大 {max} 文字です（現在 {n} 文字）。",
  errPwdMin: "削除パスワードは最低 {min} 文字必要です（現在 {n} 文字）。",
  errPwdMax: "削除パスワードは最大 {max} 文字です。",
  errDeletePwdMin: "削除パスワードは最低 {min} 文字必要です。",

  newTopicTitle: "新しいトピックを立てる",
  newTopicSubtitle:
    "トピックは質問箱ではなく、連鎖で反論し合える争点です。各立場を明確に書き、どちらが正しいかを決めつけないでください。",

  formTitleLabel: "トピックのタイトル（議論を呼ぶものに）",
  formTitlePlaceholder:
    "例：「アルゴリズム推薦は人を過激にする」という説は成り立つか？",
  formSummaryLabel: "一行概要（空欄可、本文の冒頭から自動取得）",
  formSummaryPlaceholder: "争点を一行で",
  formBodyLabel: "トピック本文（背景と双方の立場）",
  formBodyPlaceholder:
    "二、三の立場と、争点がどこにあるかを書いてください。段落の間は空行で区切ります。",
  formPwdLabel:
    "削除パスワード（任意、{min}〜{max} 文字。空欄ならこのブラウザだけが削除可能）",
  formPwdPlaceholder:
    "自分だけが知るパスワードを設定すると、どのブラウザからでも削除できます",
  formFootHint:
    "トピックは公開後に編集できません。最初のコメントはトピックページでつなげます。",
  formSubmit: "トピックを公開",
  formBusy: "公開中…",

  browserDelete: "このトピックを削除（このブラウザ）",
  browserHint: "このブラウザが作成したトピックなので、直接削除できます。",
  deleteBusy: "削除中…",
  pwdLink: "削除パスワードで削除",
  pwdHint:
    "トピック作成時に削除パスワードを設定した場合、ここに入力すると削除できます：",
  pwdPlaceholder: "削除パスワードを入力",
  confirmDelete: "削除を確定",
  confirmDeleteText:
    "削除するとトピックとコメント連鎖全体が消え、復元できません。削除しますか？",
  deleteFailed: "削除に失敗しました。しばらくしてからお試しください。",
  voteFailed: "投票に失敗しました。しばらくしてからお試しください。",
  reportFailed: "報告に失敗しました。しばらくしてからお試しください。",
};
