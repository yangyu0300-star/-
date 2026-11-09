import type { MsgKey } from "../index";

export const ko: Record<MsgKey, string> = {
  brand: "Boxuezhe",
  tagline: "새 댓글은 바로 위 댓글만 반박할 수 있습니다",
  backToList: "← 주제 목록으로",
  cancel: "취소",
  submitFailed: "전송에 실패했습니다. 잠시 후 다시 시도해 주세요.",

  ruleA: "여기에는 나란한 의견이 없고, 오직 ",
  ruleStrong: "하나의 사슬",
  ruleC:
    "만 있습니다. 발언하려면 바로 위 댓글을 반박해야 합니다. 규칙은 게임의 일부이며, 단계를 건너뛰는 답글은 허용되지 않습니다.",

  searchPlaceholder: "주제 제목 또는 요약 검색",
  searchBtn: "검색",
  clear: "지우기",
  homeTitle: "진행 중인 논쟁",
  homeSubtitle: "주제를 고르고 사슬 끝에 당신의 반박을 이어 주세요.",
  searchTitle: "‘{q}’ 검색",
  searchSub: "{n}개의 주제를 찾았습니다.",
  emptySearch: "일치하는 주제가 없습니다. 다른 키워드를 시도해 보세요.",
  emptyNone: "아직 주제가 없습니다. 첫 주제를 만들어 보세요.",
  newTopic: "+ 새 주제 만들기",
  comments: "댓글 {n}개",
  lastActivity: "마지막 활동 {d}",
  startedAt: "{d} 시작",

  topicStarted: "{d} 시작",
  chainTitle: "댓글 사슬",
  chainMeta: "총 {n}고리 · 위에서 아래로 차례로 이어짐",
  removedBadge: "삭제됨",
  ring: "{n}번째 고리",
  removedText: "이 댓글은 커뮤니티 규칙 위반으로 삭제되었습니다",
  voteHint:
    "이 두 버튼은 논증 과정만 평가하며, 당신이 그 관점에 동의하는지는 평가하지 않습니다. 동의하지 않는다면 사슬에서 반박하세요.",
  qualityHint:
    "이 주제에는 투표가 충분합니다. 라벨은 같은 주제 안에서의 상대 비교입니다: 관점의 정오가 아니라 논증을 평가하며, 순서를 바꾸지 않습니다.",
  voteUp: "논리가 탄탄함",
  voteDown: "논리에 허점이 있음",
  qualitySolid: "논증이 더 충실함",
  qualityFlawed: "논증에 보완이 필요",
  reportToggle: "이 댓글 신고",
  reportedNote: "신고됨, 처리 대기 중",
  reportTitle: "신고 이유 선택",
  reportSubmit: "신고 제출",
  reportBusy: "제출 중…",
  reportIllegal: "불법·규칙 위반 내용",
  reportSpam: "광고·유도",
  reportAttack: "인신공격",
  reportOther: "기타",
  translateBtn: "한국어로 번역",
  translateHide: "번역 접기",
  translating: "번역 중…",
  translateFailed: "번역에 실패했습니다. 잠시 후 다시 시도해 주세요.",
  openingFull: "저는 앞선 댓글의 결론에 동의하지 않습니다: ",
  openingPartial: "일부에는 동의하지만, 다음 내용에는 동의하지 않습니다: ",
  chainBlocked: "마지막 고리는 당신이 작성했습니다. 다른 사람이 반박한 후에야 다시 이을 수 있습니다.",

  targetTail: "당신의 반박 대상은 사슬 맨 끝의 유일한 댓글입니다:",
  targetTailRemoved:
    "당신의 반박 대상은 사슬 맨 끝의 댓글이지만 삭제되었습니다({removed}). 그래도 그 뒤에 이어지며 위치는 유지됩니다.",
  targetFirst: "이 주제에는 아직 댓글이 없습니다. 당신이 1번째 고리가 됩니다.",
  authorLabel: "닉네임",
  authorPlaceholder: "최대 20자",
  typeGroup: "반박 유형 선택",
  typeFull: "전면 반박",
  typeFullDesc: "전제까지 포함해 주장 전체가 성립하지 않음.",
  typePartial: "부분 반박",
  typePartialDesc: "일부는 동의하지만 한 지점은 반박해야 함.",
  reasonHeading: "반박 이유(고정 도입 문구 이후)",
  countRange: "{n} / {max}, 최소 {min}",
  lockedTag: "고정 도입 문구 · 수정 불가",
  reasonPlaceholder:
    "도입 문구 이후 내용만 작성하세요. 위의 무엇이 왜 성립하지 않는지 분명히 쓰세요.",
  quoteLabel: "어느 부분을 반박하나요? (인용 또는 요약, 필수)",
  quotePlaceholder:
    "예: 앞 댓글의 ‘이후 모든 강화는 배신으로 보일 것’이라는 부분",
  footHint:
    "당신의 반박은 사슬 끝에 이어져 다음 댓글이 반박할 유일한 대상이 됩니다.",
  replySubmit: "이 고리 잇기",

  errAuthorRequired: "닉네임을 입력해 주세요.",
  errAuthorMax: "닉네임은 최대 {max}자입니다.",
  errTypeRequired: "먼저 ‘전면 반박’ 또는 ‘부분 반박’을 선택하세요.",
  errReasonEmpty: "반박 이유는 비어 있을 수 없습니다.",
  errReasonMin: "반박 이유는 최소 {min}자 필요합니다(현재 {n}자).",
  errReasonMax: "반박 이유는 최대 {max}자입니다(현재 {n}자).",
  errQuoteRequired: "부분 반박은 반박할 부분을 구체적으로 밝혀야 합니다.",
  errQuoteMax: "인용은 {max}자 이내로 해 주세요(현재 {n}자).",
  errTitleMin: "제목은 최소 {min}자 필요합니다(현재 {n}자).",
  errTitleMax: "제목은 최대 {max}자입니다(현재 {n}자).",
  errSummaryMax: "요약은 최대 {max}자입니다(현재 {n}자).",
  errBodyMin: "본문은 최소 {min}자 필요합니다(현재 {n}자).",
  errBodyMax: "본문은 최대 {max}자입니다(현재 {n}자).",
  errPwdMin: "삭제 비밀번호는 최소 {min}자 필요합니다(현재 {n}자).",
  errPwdMax: "삭제 비밀번호는 최대 {max}자입니다.",
  errDeletePwdMin: "삭제 비밀번호는 최소 {min}자 필요합니다.",

  newTopicTitle: "새 주제 만들기",
  newTopicSubtitle:
    "주제는 질문함이 아니라 사슬로 반박을 이어갈 수 있는 쟁점입니다. 각 입장을 분명히 쓰고, 어느 쪽이 맞는지 미리 단정하지 마세요.",

  formTitleLabel: "주제 제목(논쟁을 불러일으킬 것)",
  formTitlePlaceholder:
    "예: ‘알고리즘 추천이 사람을 더 극단적으로 만든다’는 말이 성립할까?",
  formSummaryLabel: "한 줄 요약(비워 두면 본문 앞부분 자동 사용)",
  formSummaryPlaceholder: "쟁점을 한 줄로",
  formBodyLabel: "주제 본문(배경과 양측 입장)",
  formBodyPlaceholder:
    "두세 가지 입장과 논쟁의 초점을 적어 주세요. 문단 사이는 빈 줄로 구분합니다.",
  formPwdLabel:
    "삭제 비밀번호(선택, {min}–{max}자; 비워 두면 이 브라우저에서만 삭제 가능)",
  formPwdPlaceholder:
    "나만 아는 비밀번호를 설정하면 어떤 브라우저에서도 삭제할 수 있습니다",
  formFootHint:
    "주제는 게시 후 수정할 수 없습니다. 첫 댓글은 주제 페이지에서 이어 갑니다.",
  formSubmit: "주제 게시",
  formBusy: "게시 중…",

  browserDelete: "이 주제 삭제(이 브라우저)",
  browserHint: "이 브라우저가 만든 주제라 바로 삭제할 수 있습니다.",
  deleteBusy: "삭제 중…",
  pwdLink: "삭제 비밀번호로 삭제",
  pwdHint:
    "주제 생성 시 삭제 비밀번호를 설정했다면 여기에 입력해 삭제할 수 있습니다:",
  pwdPlaceholder: "삭제 비밀번호 입력",
  confirmDelete: "삭제 확정",
  confirmDeleteText:
    "삭제하면 주제와 댓글 사슬 전체가 사라지며 복구할 수 없습니다. 삭제할까요?",
  deleteFailed: "삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.",
  voteFailed: "투표에 실패했습니다. 잠시 후 다시 시도해 주세요.",
  reportFailed: "신고에 실패했습니다. 잠시 후 다시 시도해 주세요.",
};
