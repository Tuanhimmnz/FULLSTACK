const windows1252Bytes: Record<string, number> = {
  '€': 0x80,
  '‚': 0x82,
  'ƒ': 0x83,
  '„': 0x84,
  '…': 0x85,
  '†': 0x86,
  '‡': 0x87,
  'ˆ': 0x88,
  '‰': 0x89,
  'Š': 0x8a,
  '‹': 0x8b,
  'Œ': 0x8c,
  'Ž': 0x8e,
  '‘': 0x91,
  '’': 0x92,
  '“': 0x93,
  '”': 0x94,
  '•': 0x95,
  '–': 0x96,
  '—': 0x97,
  '˜': 0x98,
  '™': 0x99,
  'š': 0x9a,
  '›': 0x9b,
  'œ': 0x9c,
  'ž': 0x9e,
  'Ÿ': 0x9f
};

const suspiciousMojibake = /(?:Ã|Ä|Æ|á[º»])/;
const tokenPattern = /[A-Za-z0-9_'".,:;!?()[\]{}+\-=@#%&*|/\\\u00a0-\u00ff\u0152-\u0178\u0192\u02c6\u02dc\u2018-\u201e\u2020-\u2026\u2030\u2039\u203a]+/g;

const knownTranslations: Record<string, string> = {
  'Task assigned': 'Bạn được giao công việc',
  'Worklog created': 'Đã ghi log thời gian',
  'Project members updated': 'Cập nhật thành viên dự án',
  'New project': 'Dự án mới',
  'Sprint started': 'Sprint đã bắt đầu',
  'Milestone completed': 'Milestone đã hoàn thành',
  'Created task': 'Tạo công việc',
  'Updated task': 'Cập nhật công việc',
  'Status changed': 'Đổi trạng thái công việc',
  'Created subtask': 'Tạo công việc con',
  'Updated subtask': 'Cập nhật công việc con',
  'Deleted subtask': 'Xóa công việc con',
  'Toggled subtask': 'Đổi trạng thái công việc con',
  'Logged': 'Log thời gian'
};

function toWindows1252Byte(char: string) {
  if (windows1252Bytes[char] !== undefined) return windows1252Bytes[char];
  const code = char.charCodeAt(0);
  return code <= 0xff ? code : undefined;
}

function repairToken(token: string) {
  if (!suspiciousMojibake.test(token)) return token;

  const bytes: number[] = [];
  for (const char of token) {
    const byte = toWindows1252Byte(char);
    if (byte === undefined) return token;
    bytes.push(byte);
  }

  try {
    const decoded = new TextDecoder('utf-8', { fatal: false }).decode(new Uint8Array(bytes));
    return decoded.includes('\uFFFD') ? token : decoded;
  } catch {
    return token;
  }
}

function translateKnownText(text: string) {
  let result = text;
  Object.entries(knownTranslations).forEach(([from, to]) => {
    result = result.replaceAll(from, to);
  });
  return result;
}

export function displayText(value?: string | null) {
  if (value === null || value === undefined) return '';
  const text = String(value);
  if (!suspiciousMojibake.test(text)) return translateKnownText(text);

  const repaired = text.replace(tokenPattern, repairToken);
  return translateKnownText(repaired);
}

export function displayTextList(values?: string[] | null) {
  return (values || []).map(displayText).filter(Boolean);
}
