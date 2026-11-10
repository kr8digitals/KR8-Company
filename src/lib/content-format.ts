/** Text templates keep live values out of editable source code: {0}, {1}, … */
export function formatEditableText(template: string, values: unknown[]): string {
  return template.replace(/\{(\d+)\}/g, (match, index) => Number(index) < values.length ? String(values[Number(index)] ?? '') : match);
}
