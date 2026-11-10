/** Structure and URL validation shared by admin writes and regression tests. */
export function validShape(value: any, template: any): boolean {
  if (Array.isArray(template)) return Array.isArray(value) && value.length <= 500
    && (!template.length || value.every(v => template.some(example => validShape(v, example))));
  if (template !== null && typeof template === 'object') return value !== null && typeof value === 'object' && !Array.isArray(value)
    && Object.keys(value).every(key => Object.hasOwn(template, key))
    && Object.entries(template).every(([key, v]) => validShape(value[key], v));
  return template === null ? value === null || ['number','string'].includes(typeof value)
    : typeof value === typeof template && (typeof value !== 'number' || Number.isFinite(value));
}
export function assertSafeContent(value: unknown): void {
  if (typeof value === 'string') {
    if (value.length > 30000) throw new Error('A content field is too long');
    // Control characters can obscure a dangerous scheme in rendered URLs.
    if (/^(javascript|data|vbscript):/i.test(value.replace(/[\u0000-\u0020\u007f]/g, ''))) throw new Error('Unsafe URL scheme');
  }
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      if (['__proto__','constructor','prototype'].includes(key)) throw new Error('Reserved content key');
      assertSafeContent(child);
    }
  }
}
