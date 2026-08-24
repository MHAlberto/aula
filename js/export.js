const esc = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
export function download(name, content, type) {
  const blob = new Blob([content], { type }); const url = URL.createObjectURL(blob); const link = document.createElement('a');
  link.href = url; link.download = name; link.rel = 'noopener'; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 500);
}
export function exportCsv(rows) {
  const headers = ['Clase','Alumno','Matricula','Fecha','Estado','Nota','Periodo','FechaInicioPeriodo','FechaFinPeriodo'];
  return '\ufeff' + [headers, ...rows.map(row => headers.map(header => esc(row[header])))] .map(row => row.join(',')).join('\r\n');
}
export function exportBackup(data) { return JSON.stringify({ app: 'Aula', version: 1, exportedAt: new Date().toISOString(), ...data }, null, 2); }
export function parseCsv(text) {
  const lines = text.replace(/^\ufeff/, '').split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const parse = (line) => { const values=[]; let value='', quoted=false; for(let i=0;i<line.length;i++){const ch=line[i]; if(ch==='"'&&line[i+1]==='"'&&quoted){value+='"';i++;} else if(ch==='"'){quoted=!quoted;} else if(ch===','&&!quoted){values.push(value);value='';} else value+=ch;} values.push(value); return values; };
  const headers = parse(lines[0]).map(v => v.trim().toLowerCase());
  return lines.slice(1).map(line => Object.fromEntries(parse(line).map((v, i) => [headers[i], v]))).filter(row => Object.values(row).some(Boolean));
}
