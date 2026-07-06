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
  'Ÿ': 0x9f,
  'Ă': 0xc3,
  'ă': 0xe3
};

const suspiciousMojibake = /(?:Ã|Â|Ä|Ă|Æ|á[º»]|â€|gá»|vÃ|Dá»|tháº|thá»|Kiá)/;
const tokenPattern = /[A-Za-z0-9_'".,:;!?()[\]{}+\-=@#%&*|/\\\u00a0-\u00ff\u0100-\u017f\u0192\u02c6\u02dc\u2018-\u201e\u2020-\u2026\u2030\u2039\u203a]+/g;

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

const rawTextKeys = new Set([
  'id',
  'email',
  'token',
  'password',
  'avatarUrl',
  'userAvatar',
  'createdAt',
  'updatedAt',
  'dueDate',
  'startDate',
  'endDate',
  'color',
  'status',
  'priority',
  'projectId',
  'taskId',
  'userId',
  'actorId',
  'creatorId',
  'assigneeId',
  'entityId'
]);

function toByte(char: string) {
  if (windows1252Bytes[char] !== undefined) return windows1252Bytes[char];
  const code = char.charCodeAt(0);
  return code <= 0xff ? code : undefined;
}

function repairLossyVietnamese(text: string) {
  return text
    .replace(/Ä|Ä�/g, 'Đ')
    .replace(/Ä‘/g, 'đ')
    .replace(/gá»�i/g, 'gọi')
    .replace(/gá»�/g, 'gọ')
    .replace(/\bvÃ(?=\s|$|[,.!?:;])/g, 'và')
    .replace(/\bgÃ(?=\s|$|[,.!?:;])/g, 'gì')
    .replace(/\bÃang\b/g, 'Đang')
    .replace(/\bÄang\b/g, 'Đang');
}

function repairToken(token: string) {
  if (!suspiciousMojibake.test(token)) return token;

  const bytes: number[] = [];
  for (const char of token) {
    const byte = toByte(char);
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
  result = result.replace(/(.+?) logged ([0-9.]+)h on "([^"]+)"/g, '$1 đã log $2 giờ cho "$3"');
  result = result.replace(/(.+?) assigned task "([^"]+)"/g, '$1 đã giao công việc "$2"');
  result = result.replace(/(.+?) created project ([^.]+)\./g, '$1 đã tạo dự án $2.');
  result = result.replace(/(.+?) updated project members\./g, '$1 đã cập nhật thành viên dự án.');
  result = result.replace(/(.+?) created sprint ([^.]+)\./g, '$1 đã tạo sprint $2.');
  result = result.replace(/(.+?) completed milestone ([^.]+)\./g, '$1 đã hoàn thành milestone $2.');
  return result;
}

export function displayText(value?: string | null) {
  if (value === null || value === undefined) return '';
  const text = repairLossyVietnamese(String(value));
  if (!suspiciousMojibake.test(text)) return translateKnownText(text);

  const repaired = repairLossyVietnamese(text.replace(tokenPattern, repairToken));
  return translateKnownText(repaired);
}

export function displayTextList(values?: string[] | null) {
  return (values || []).map(displayText).filter(Boolean);
}

export function repairApiText<T>(value: T, key = ''): T {
  if (typeof value === 'string') {
    return (rawTextKeys.has(key) ? value : displayText(value)) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => repairApiText(item, key)) as T;
  }

  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).reduce<Record<string, unknown>>((result, [childKey, childValue]) => {
      result[childKey] = repairApiText(childValue, childKey);
      return result;
    }, {}) as T;
  }

  return value;
}

export function renderMarkdown(text?: string | null): string {
  if (!text) return '';
  
  // Escape HTML to prevent XSS
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
    
  // Bold: **text** -> <strong>text</strong>
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Italics: *text* -> <em>text</em>
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Code block: ```code```
  html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-[11px] overflow-x-auto my-2 border border-slate-800"><code>$1</code></pre>');
  
  // Inline code: `code`
  html = html.replace(/`([^`]+)`/g, '<code class="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono text-xs text-rose-500 font-bold">$1</code>');
  
  // Split into lines for list processing
  const lines = html.split('\n');
  let inUl = false;
  let inOl = false;
  let resultLines: string[] = [];
  
  for (let line of lines) {
    const trimmed = line.trim();
    
    // Unordered list item
    const ulMatch = line.match(/^(\s*)([\*\-])\s+(.+)$/);
    if (ulMatch) {
      if (inOl) {
        resultLines.push('</ol>');
        inOl = false;
      }
      if (!inUl) {
        resultLines.push('<ul class="list-disc pl-5 my-2 space-y-1">');
        inUl = true;
      }
      resultLines.push(`<li>${ulMatch[3]}</li>`);
      continue;
    }
    
    // Ordered list item
    const olMatch = line.match(/^(\s*)(\d+)\.\s+(.+)$/);
    if (olMatch) {
      if (inUl) {
        resultLines.push('</ul>');
        inUl = false;
      }
      if (!inOl) {
        resultLines.push('<ol class="list-decimal pl-5 my-2 space-y-1">');
        inOl = true;
      }
      resultLines.push(`<li>${olMatch[3]}</li>`);
      continue;
    }
    
    // Reset lists
    if (trimmed === '' || (!ulMatch && !olMatch)) {
      if (inUl) {
        resultLines.push('</ul>');
        inUl = false;
      }
      if (inOl) {
        resultLines.push('</ol>');
        inOl = false;
      }
    }
    
    if (trimmed !== '') {
      if (!inUl && !inOl && !line.startsWith('<pre')) {
        if (trimmed.startsWith('### ')) {
          resultLines.push(`<h4 class="font-bold text-sm text-indigo-400 mt-3 mb-1">${trimmed.slice(4)}</h4>`);
        } else if (trimmed.startsWith('## ')) {
          resultLines.push(`<h3 class="font-bold text-base text-indigo-400 mt-4 mb-2">${trimmed.slice(3)}</h3>`);
        } else if (trimmed.startsWith('# ')) {
          resultLines.push(`<h2 class="font-black text-lg text-indigo-400 mt-5 mb-2">${trimmed.slice(2)}</h2>`);
        } else {
          resultLines.push(`<p class="my-1.5 leading-relaxed">${line}</p>`);
        }
      } else {
        resultLines.push(line);
      }
    } else {
      resultLines.push('');
    }
  }
  
  if (inUl) resultLines.push('</ul>');
  if (inOl) resultLines.push('</ol>');
  
  return resultLines.join('\n');
}

