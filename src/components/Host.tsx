'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { track } from '@/lib/track';
import type { Chip, HostState, HostReply } from '@/lib/host-brain';
import site from '../../data/site.json';

type Msg = {
  id: string;
  who: 'host' | 'user' | 'team';
  name?: string;
  text: string;
  chips?: Chip[];
  links?: { label: string; href: string; outbound?: boolean }[];
  at: number;
};

const HOST = site.host;
const QUALIFIERS: Chip[] = (site.host.qualifiers as { id: string; label: string; next: string }[]).map((q) => ({
  label: q.label,
  value: q.id,
}));
const STORE_KEY = 'kr8.host.v1';
const MEM_KEY = 'kr8.visitor.v1';

export default function Host() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [welcome, setWelcome] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [muted, setMuted] = useState(true); // audio is opt-in: browsers block autoplay
  const [voiceOn, setVoiceOn] = useState(false);
  const [listening, setListening] = useState(false);
  const [visitor, setVisitor] = useState<{ id: string; name?: string } | null>(null);
  const [state, setState] = useState<HostState>('start');
  const bodyRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<any>(null);
  const spokeRef = useRef<Set<string>>(new Set());

  // ---- restore ---------------------------------------------------------
  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        setMsgs(s.msgs || []);
        setState(s.state || 'start');
        setMuted(s.muted ?? true);
        setVisitor(s.visitor || null);
        if (s.visitor) setMuted(s.muted ?? true);
      }
      const mem = localStorage.getItem(MEM_KEY);
      if (mem) setVisitor(JSON.parse(mem));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ msgs: msgs.slice(-60), state, muted, visitor }));
    } catch { /* quota */ }
  }, [msgs, state, muted, visitor, mounted]);

  // ---- welcome pop-up, once per session, after the page has settled ----
  useEffect(() => {
    if (!mounted) return;
    const dismissed = sessionStorage.getItem('kr8.welcome.dismissed') === '1';
    if (dismissed) return;
    // The hero now runs a directed sequence of its own. The welcome waits until
    // the visitor has moved past it, so the two never fight for the same corner.
    let done = false;
    const arm = () => {
      if (done) return;
      done = true;
      setWelcome(true);
      track('host_welcome_shown');
    };
    const onScroll = () => { if (window.scrollY > window.innerHeight * 0.75) arm(); };
    window.addEventListener('scroll', onScroll, { passive: true });
    const t = setTimeout(arm, 45000);
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(t); };
  }, [mounted]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs, busy]);

  // ---- speech ----------------------------------------------------------
  const speak = useCallback((text: string, id: string) => {
    if (typeof window === 'undefined') return;
    if (!('speechSynthesis' in window)) return;
    if (muted || !voiceOn) return;
    if (spokeRef.current.has(id)) return;
    spokeRef.current.add(id);
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text.replace(/\s+/g, ' ').slice(0, 420));
      u.rate = HOST.voice.rate || 1;
      u.pitch = 1.04;
      const voices = window.speechSynthesis.getVoices();
      const pick =
        voices.find((v) => /female|samantha|zira|google uk english female/i.test(v.name)) ||
        voices.find((v) => v.lang?.startsWith('en-NG')) ||
        voices.find((v) => v.lang?.startsWith('en'));
      if (pick) u.voice = pick;
      window.speechSynthesis.speak(u);
    } catch { /* speech is a bonus, never a requirement */ }
  }, [muted, voiceOn]);

  const stopSpeaking = () => {
    try { window.speechSynthesis?.cancel(); } catch { /* noop */ }
    setVoiceOn(false);
  };

  // ---- conversation ----------------------------------------------------
  const push = (m: Msg) => setMsgs((prev) => [...prev, m]);

  const send = useCallback(async (text: string, opts?: { silent?: boolean }) => {
    const clean = text.trim();
    if (!clean || busy) return;
    setInput('');
    if (!opts?.silent) {
      push({ id: `u${Date.now()}`, who: 'user', text: clean, at: Date.now() });
      track('host_user_message', { len: clean.length });
    }
    setBusy(true);
    try {
      const res = await fetch('/api/host', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: clean, state, visitorId: visitor?.id, name: visitor?.name }),
      });
      const data: HostReply & { visitorId: string } = await res.json();
      if (data.visitorId && data.visitorId !== visitor?.id) {
        const v = { id: data.visitorId, name: visitor?.name };
        setVisitor(v);
        try { localStorage.setItem(MEM_KEY, JSON.stringify(v)); } catch { /* noop */ }
      }
      setState(data.state);
      const id = `h${Date.now()}`;
      push({ id, who: 'host', text: data.say, chips: data.chips, links: data.links, at: Date.now() });
      if (data.handoff) {
        track('host_handoff', { state: data.state });
        setTimeout(() => {
          push({
            id: `t${Date.now()}`,
            who: 'team',
            name: 'KR8 team',
            text: 'A team member has been notified and will join this conversation. You can keep typing — everything here reaches them.',
            at: Date.now(),
          });
        }, 1200);
      }
      speak(data.say, id);
    } catch {
      push({
        id: `e${Date.now()}`,
        who: 'host',
        text: `I could not reach the team's server just then. Everything else on the site still works — or you can message us on WhatsApp and I promise a human replies.`,
        chips: [{ label: 'Open WhatsApp', value: '__whatsapp' }],
        at: Date.now(),
      });
    } finally {
      setBusy(false);
    }
  }, [busy, state, visitor, speak]);

  const openPanel = (choice = 'launcher') => {
    setOpen(true);
    setWelcome(false);
    sessionStorage.setItem('kr8.welcome.dismissed', '1');
    track('host_open', { choice });
  };

  const chooseQualifier = (id: string) => {
    push({ id: `u${Date.now()}`, who: 'user', text: labelFor(id), at: Date.now() });
    setBusy(true);
    fetch('/api/host', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: id, state: 'start', qualifier: id, visitorId: visitor?.id }),
    }).then((r) => r.json()).then((data) => {
      setState(data.state);
      const mid = `h${Date.now()}`;
      push({ id: mid, who: 'host', text: data.say, chips: data.chips, links: data.links, at: Date.now() });
      speak(data.say, mid);
    }).catch(() => {
      push({ id: `e${Date.now()}`, who: 'host', text: 'The server is unreachable at the moment. Try the quote form — it always works.', at: Date.now() });
    }).finally(() => setBusy(false));
  };

  const onChip = (c: Chip) => {
    if (c.value === '__whatsapp') {
      window.open(`https://wa.me/${site.company.whatsapp}?text=${encodeURIComponent("Hi KR8 Digitals — I was on your site and would like to talk.")}`, '_blank', 'noopener');
      return;
    }
    if (c.value === '__quote') { setOpen(false); router.push('/contact'); return; }
    if (c.value === '__apply') { window.open(site.ecosystem.academy.applyUrl, '_blank', 'noopener'); track('outbound_click', { href: 'academy_apply', label: 'host' }); return; }
    if (c.value === '__tracks') { window.open(`${site.ecosystem.academy.url}/tracks`, '_blank', 'noopener'); return; }
    if (c.value === '__roles') { setOpen(false); router.push('/about/join-the-team'); return; }
    if (c.value === '__joining') { setOpen(false); router.push('/about/join-the-team#how'); return; }
    if (c.value === '__tribe') { setOpen(false); router.push('/programs#tribe-waitlist'); return; }
    if (c.value === '__tribepage') { setOpen(false); router.push('/programs#tribe'); return; }
    if (c.value === '__partners') { setOpen(false); router.push('/partners'); return; }
    if (c.value === '__work') { setOpen(false); router.push('/services/website-design#work'); return; }
    if (c.value === '__human') { send('Can I speak to a real person please'); return; }
    if (['business', 'learner', 'job', 'community', 'exploring'].includes(c.value)) { chooseQualifier(c.value); return; }
    send(c.label);
  };

  // ---- voice input -----------------------------------------------------
  const toggleMic = () => {
    if (typeof window === 'undefined') return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setListening(false); return; }
    if (listening) { recRef.current?.stop(); setListening(false); return; }
    try {
      const rec = new SR();
      rec.lang = 'en-NG';
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.onresult = (e: any) => {
        const said = e.results?.[0]?.[0]?.transcript;
        if (said) send(said);
      };
      rec.onend = () => setListening(false);
      rec.onerror = () => setListening(false);
      rec.start();
      recRef.current = rec;
      setListening(true);
      track('host_voice_input');
    } catch { setListening(false); }
  };

  const clearChat = () => {
    setMsgs([]);
    setState('start');
    try { localStorage.removeItem(STORE_KEY); } catch { /* noop */ }
    push({ id: `h${Date.now()}`, who: 'host', text: `Cleared. Nothing from before is stored on your device now. Where would you like to start?`, chips: QUALIFIERS, at: Date.now() });
    track('host_chat_deleted');
  };

  if (!mounted) return null;

  return (
    <>
      {!open && (
        <button className="host-launcher" onClick={() => openPanel()} aria-label={`Ask ${HOST.name} — open the chat panel`}>
          <span className="host-launcher__ava"><Avatar size={18} /></span>
          <span className="host-launcher__label">Ask {HOST.name}</span>
          <span className="host-launcher__dot" />
        </button>
      )}

      {welcome && !open && (
        <div className={`host-welcome${welcome ? ' is-open' : ''}`} role="dialog" aria-label={`${HOST.name} welcome`}>
          <button className="host-welcome__close" aria-label="Dismiss" onClick={() => { setWelcome(false); sessionStorage.setItem('kr8.welcome.dismissed', '1'); }}>
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
          <div className="host-welcome__top">
            <span className="host-welcome__ava"><Avatar size={17} /></span>
            <div className="host-welcome__txt">
              <b>{HOST.name} · KR8 Digitals</b>
              {HOST.shortGreeting}
            </div>
          </div>
          <div className="host-welcome__actions">
            <button className="yes" onClick={() => openPanel('welcome')}>Help me find it</button>
            <button className="no" onClick={() => { setWelcome(false); sessionStorage.setItem('kr8.welcome.dismissed', '1'); track('host_welcome_dismissed'); }}>Just browsing</button>
          </div>
        </div>
      )}

      <div className={`host-panel${open ? ' is-open' : ''}`} role="dialog" aria-label={`${HOST.name}, KR8 Digitals guide`} aria-hidden={!open}>
        <div className="host-head">
          <span className="host-head__ava"><Avatar size={20} /></span>
          <div className="host-head__meta">
            <div className="host-head__name">{HOST.name}</div>
            <div className="host-head__status"><i /> KR8 Digitals guide · replies instantly</div>
          </div>
          <button className="host-icon-btn" aria-pressed={voiceOn} aria-label={voiceOn ? 'Turn voice off' : 'Turn voice on'} title={voiceOn ? 'Voice on' : 'Voice off'}
            onClick={() => { if (voiceOn) stopSpeaking(); else { setVoiceOn(true); setMuted(false); } }}>
            {voiceOn ? <IconVolOn /> : <IconVolOff />}
          </button>
          <button className="host-icon-btn" aria-label="Delete this conversation" title="Delete conversation" onClick={clearChat}><IconTrash /></button>
          <button className="host-icon-btn" aria-label="Close" onClick={() => { stopSpeaking(); setOpen(false); }}><IconClose /></button>
        </div>

        <div className="host-body" ref={bodyRef}>
          {msgs.length === 0 && (
            <>
              <div className="host-msg host-msg--bot">{HOST.greeting}</div>
              <div className="host-chips">
                {QUALIFIERS.map((q) => (
                  <button key={q.value} className="host-chip" onClick={() => onChip(q)}>{q.label}</button>
                ))}
              </div>
            </>
          )}
          {msgs.map((m) => (
            <div key={m.id} className={`host-msg host-msg--${m.who === 'host' ? 'bot' : m.who}`}>
              {m.who === 'team' && <div className="host-msg__who">{m.name}</div>}
              {m.text}
              {m.chips && m.chips.length > 0 && (
                <div className="host-chips" style={{ marginTop: 10 }}>
                  {m.chips.map((c) => (
                    <button key={c.value + c.label} className="host-chip" onClick={() => onChip(c)}>{c.label}</button>
                  ))}
                </div>
              )}
              {m.links && m.links.length > 0 && (
                <div style={{ marginTop: 9, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {m.links.map((l) =>
                    l.outbound ? (
                      <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#ff8ec4', fontWeight: 600 }}>
                        {l.label} ↗
                      </a>
                    ) : (
                      <Link key={l.href} href={l.href} style={{ fontSize: 13, color: '#ff8ec4', fontWeight: 600 }} onClick={() => setOpen(false)}>
                        {l.label} →
                      </Link>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
          {busy && (
            <div className="host-msg host-msg--bot">
              <span className="host-typing"><i /><i /><i /></span>
            </div>
          )}
        </div>

        <form className="host-compose" onSubmit={(e) => { e.preventDefault(); send(input); }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type, or use the microphone…"
            aria-label="Message"
            maxLength={600}
          />
          <button type="button" className="host-icon-btn" aria-pressed={listening} aria-label="Speak instead of typing" onClick={toggleMic} style={{ width: 36, height: 36, flex: 'none' }}>
            {listening ? <IconMicOn /> : <IconMic />}
          </button>
          <button type="submit" className="host-send" aria-label="Send" disabled={!input.trim() || busy}>
            <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden><path d="M1 8l14-6-5 14-2.4-5.2L1 8z" fill="currentColor" /></svg>
          </button>
        </form>
        <div className="host-foot">
          {HOST.name} is KR8 Digitals&apos; digital assistant, not a person. Chats are saved so the team can follow up — <button onClick={clearChat} style={{ textDecoration: 'underline' }}>delete</button> them any time.
        </div>
      </div>
    </>
  );
}

function labelFor(id: string) {
  const q = QUALIFIERS.find((x) => x.value === id);
  return q?.label || id;
}

function Avatar({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden fill="none">
      <circle cx="12" cy="12" r="9.2" stroke="rgba(255,255,255,.55)" strokeWidth="1.4" strokeDasharray="2.6 3.4" />
      <circle cx="12" cy="12" r="3.6" stroke="#fff" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="1.1" fill="#fff" />
    </svg>
  );
}
function IconVolOn() { return <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden><path d="M3 7.5h3l4-3.5v12l-4-3.5H3zM13.5 6.2a4.6 4.6 0 010 7.6l-.9-1.1a3.2 3.2 0 000-5.4z" /></svg>; }
function IconVolOff() { return <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden><path d="M3 7.5h3l4-3.5v12l-4-3.5H3zM13 8l3 4m0-4l-3 4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" /></svg>; }
function IconTrash() { return <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><path d="M3.5 5.5h13M8 5.5V3.8h4v1.7M5.5 5.5l.8 10a1.4 1.4 0 001.4 1.3h4.6a1.4 1.4 0 001.4-1.3l.8-10" strokeLinecap="round" /></svg>; }
function IconClose() { return <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><path d="M3 3l10 10M13 3L3 13" strokeLinecap="round" /></svg>; }
function IconMic() { return <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><rect x="7.4" y="2.8" width="5.2" height="9" rx="2.6" /><path d="M4.5 9.5a5.5 5.5 0 0011 0M10 15v2.4" strokeLinecap="round" /></svg>; }
function IconMicOn() { return <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor" aria-hidden><rect x="7.4" y="2.8" width="5.2" height="9" rx="2.6" /><path d="M4.5 9.5a5.5 5.5 0 0011 0" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" /><path d="M10 15v2.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>; }
