'use client';
import { formatEditableText } from '@/lib/content-format';
import { useEditableContent } from '@/components/EditableContentProvider';
import { usePublicContent } from '@/components/PublicContentProvider';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import site from '../../data/site.json';
import {
  getPageDossier,
  selectProactiveQuestion,
  type PageProactiveQuestion,
} from '@/lib/riya-page-dossiers';

type MsgLink = { label: string; href: string; outbound?: boolean };

type Msg = {
  id: string;
  who: 'bot' | 'you' | 'team';
  name?: string;
  text: string;
  links?: MsgLink[];
  submissionRef?: string;
  intent?: string;
  rated?: 'up' | 'down';
  createdAt?: string;
};

type Chip = { label: string; value: string };

const VID_KEY = 'kr8_vid';
const VOICE_KEY = 'kr8_riya_voice';
const PROACTIVE_MUTE_KEY = 'kr8_riya_proactive_muted';
const PROACTIVE_META_KEY = 'kr8_riya_proactive_meta_v3';

function getVid() {
  try {
    let v = localStorage.getItem(VID_KEY);
    if (!v) {
      v = 'v_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
      localStorage.setItem(VID_KEY, v);
    }
    return v;
  } catch {
    return 'v_anon';
  }
}

function decodeHtmlEntities(input: string): string {
  return String(input || '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function renderInlineRich(segment: string, keyPrefix: string) {
  const clean = decodeHtmlEntities(segment);
  const tokens = clean.split(/(\*\*[^*]+\*\*|\*[^*\n]+\*)/g);
  return tokens.map((tok, i) => {
    if (tok.startsWith('**') && tok.endsWith('**') && tok.length > 4) {
      return (
        <strong key={`${keyPrefix}-b-${i}`} style={{ color: 'inherit', fontWeight: 700 }}>
          {tok.slice(2, -2)}
        </strong>
      );
    }
    if (tok.startsWith('*') && tok.endsWith('*') && tok.length > 2) {
      return (
        <em key={`${keyPrefix}-i-${i}`} style={{ color: 'inherit', opacity: 0.92 }}>
          {tok.slice(1, -1)}
        </em>
      );
    }
    return <span key={`${keyPrefix}-t-${i}`}>{tok}</span>;
  });
}

function renderFormattedText(text: string) {
  const lines = decodeHtmlEntities(text).split('\n');
  return lines.map((line, li) => (
    <span key={li}>
      {renderInlineRich(line, `l${li}`)}
      {li < lines.length - 1 && <br />}
    </span>
  ));
}

export default function Host() {
  const editableContent = useEditableContent("components:Host");

  const publicData = usePublicContent();
  const site = publicData.site;

  const pathname = usePathname() || '/';
  const router = useRouter();
  const hide = pathname.startsWith('/admin');

  const [open, setOpen] = useState(false);
  const [nudge, setNudge] = useState<PageProactiveQuestion | null>(null);
  const [proactiveMuted, setProactiveMuted] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [hasRealHistory, setHasRealHistory] = useState(false);
  const [chips, setChips] = useState<Chip[]>(() => getPageDossier(pathname).defaultChips);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState('');
  const [voice, setVoice] = useState(false);
  const [listening, setListening] = useState(false);
  const [canSR, setCanSR] = useState(false);
  const [handoffActive, setHandoffActive] = useState(false);

  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastPoll = useRef<string>('');
  const vidRef = useRef<string>('');
  const recRef = useRef<any>(null);

  // Refs for live visitor activity (avoiding effect re-triggers on scroll!)
  const activeSectionRef = useRef<string>('');
  const scrollRatioRef = useRef<number>(0);
  const lastInteractedLabelRef = useRef<string>('');
  const pagesSeenRef = useRef<string[]>([]);
  const dismissedPathsRef = useRef<Set<string>>(new Set());

  function markPathDismissed(path: string) {
    dismissedPathsRef.current.add(path);
    try {
      const raw = sessionStorage.getItem(PROACTIVE_META_KEY);
      const parsed = raw ? JSON.parse(raw) : { visits: {}, dismissed: {} };
      parsed.dismissed = parsed.dismissed || {};
      parsed.dismissed[path] = true;
      sessionStorage.setItem(PROACTIVE_META_KEY, JSON.stringify(parsed));
    } catch {}
  }

  // Boot persistent preferences & load visitor's own conversation history
  useEffect(() => {
    if (hide) return;
    vidRef.current = getVid();
    try {
      setVoice(localStorage.getItem(VOICE_KEY) === '1');
      setProactiveMuted(localStorage.getItem(PROACTIVE_MUTE_KEY) === '1');
      setCanSR(Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition));
      const raw = sessionStorage.getItem(PROACTIVE_META_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.dismissed) {
          Object.keys(parsed.dismissed).forEach((k) => dismissedPathsRef.current.add(k));
        }
      }
    } catch {}

    const dossier = getPageDossier(pathname);
    fetch(`/api/host?visitorId=${encodeURIComponent(vidRef.current)}&pagePath=${encodeURIComponent(pathname)}`)
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.messages) && d.messages.length) {
          setMsgs(d.messages);
          setHasRealHistory(true);
          lastPoll.current = d.messages[d.messages.length - 1]?.createdAt || '';
          if (d.handoff) setHandoffActive(true);
        } else {
          setMsgs([
            {
              id: 'riya-seed',
              who: 'bot',
              name: 'RIYA',
              text: dossier.chatOpener,
            },
          ]);
        }
        setChips(dossier.defaultChips);
      })
      .catch(() => {
        setMsgs([{ id: 'riya-seed', who: 'bot', name: 'RIYA', text: dossier.chatOpener }]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hide]);

  // Keep seed opener & chips sensitive to the exact current page until visitor starts chatting
  useEffect(() => {
    if (hide) return;
    if (!pagesSeenRef.current.includes(pathname)) {
      pagesSeenRef.current = [...pagesSeenRef.current.slice(-5), pathname];
    }
    const dossier = getPageDossier(pathname);
    if (!hasRealHistory) {
      setMsgs((prev) => {
        if (prev.length <= 1 && prev[0]?.id?.startsWith('riya-seed')) {
          return [{ id: 'riya-seed', who: 'bot', name: 'RIYA', text: dossier.chatOpener }];
        }
        return prev;
      });
      setChips(dossier.defaultChips);
    }
  }, [pathname, hide, hasRealHistory]);

  // Passive activity sensors: visible section, scroll depth & clicked filter/card labels
  useEffect(() => {
    if (hide || typeof window === 'undefined') return;
    activeSectionRef.current = '';
    scrollRatioRef.current = 0;

    const onScroll = () => {
      const docH = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollRatioRef.current = Math.min(1, Math.max(0, window.scrollY / docH));
    };
    const onClickTrack = (ev: MouseEvent) => {
      const el = (ev.target as HTMLElement | null)?.closest('button, a');
      if (!el || el.closest('.host-panel') || el.closest('.host-welcome') || el.closest('.host-launcher')) return;
      const txt = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 48);
      if (txt) lastInteractedLabelRef.current = txt;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('click', onClickTrack, { passive: true });

    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      const sections = Array.from(document.querySelectorAll('section[id], div[id]')).filter(
        (el) => el.id && !el.id.startsWith('radix')
      );
      if (sections.length) {
        io = new IntersectionObserver(
          (entries) => {
            const visible = entries.find((e) => e.isIntersecting);
            if (visible?.target?.id) activeSectionRef.current = visible.target.id;
          },
          { threshold: 0.3 }
        );
        sections.forEach((s) => io!.observe(s));
      }
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('click', onClickTrack);
      if (io) io.disconnect();
    };
  }, [pathname, hide]);

  // Page-Sensitive, Activity-Aware Question Popup (Differs on Every Page & Always Closes Cleanly!)
  useEffect(() => {
    setNudge(null);
    if (hide || open || proactiveMuted) return;
    if (dismissedPathsRef.current.has(pathname)) return;

    let visitsForPath = 1;
    try {
      const raw = sessionStorage.getItem(PROACTIVE_META_KEY);
      const parsed = raw ? JSON.parse(raw) : { visits: {}, dismissed: {} };
      if (parsed.dismissed?.[pathname]) {
        dismissedPathsRef.current.add(pathname);
        return;
      }
      parsed.visits = parsed.visits || {};
      parsed.visits[pathname] = (Number(parsed.visits[pathname]) || 0) + 1;
      visitsForPath = parsed.visits[pathname];
      sessionStorage.setItem(PROACTIVE_META_KEY, JSON.stringify(parsed));
    } catch {}

    const delayMs = visitsForPath >= 2 ? 6_500 : 8_000;
    const dwellTimer = setTimeout(() => {
      if (dismissedPathsRef.current.has(pathname)) return;
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') return;

      const selected = selectProactiveQuestion({
        pathname,
        activeSection: activeSectionRef.current,
        scrollRatio: scrollRatioRef.current,
        visits: visitsForPath,
      });
      setNudge(selected);

      fetch('/api/host', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'proactive_event',
          state: 'shown',
          trigger: selected.id,
          visitorId: vidRef.current,
          page: pathname,
          activeSection: activeSectionRef.current,
        }),
      }).catch(() => {});
    }, delayMs);

    // Form hesitation helper (respects dismissedPathsRef so it never re-opens after close!)
    let formTimer: ReturnType<typeof setTimeout> | null = null;
    const onFocusIn = (ev: FocusEvent) => {
      const target = ev.target as HTMLElement | null;
      const form = target?.closest('form');
      if (!form || target?.closest('.host-panel') || open || proactiveMuted) return;
      if (dismissedPathsRef.current.has(pathname)) return;
      if (formTimer) clearTimeout(formTimer);
      formTimer = setTimeout(() => {
        if (dismissedPathsRef.current.has(pathname)) return;
        const activeTag = document.activeElement?.tagName?.toLowerCase();
        if (activeTag === 'input' || activeTag === 'textarea') return;
        setNudge({
          id: 'form_hesitation',
          title: 'Paused on the form?',
          question:
            'Not sure what to fill in or want to ask a quick question before submitting? Tell me in plain words!',
          ctaLabel: 'Ask RIYA first',
          quickReplies: [
            { label: 'What happens after I submit?', value: `What happens after I submit the form on ${pathname}?` },
            { label: 'Help me describe my request', value: 'Can you help me figure out the right option before I submit?' },
          ],
        });
      }, 24_000);
    };
    const onSubmit = () => {
      if (formTimer) clearTimeout(formTimer);
    };

    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('submit', onSubmit);

    return () => {
      clearTimeout(dwellTimer);
      if (formTimer) clearTimeout(formTimer);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('submit', onSubmit);
    };
  }, [pathname, hide, open, proactiveMuted]);

  // Poll for live human team replies when panel is open
  useEffect(() => {
    if (!open || hide) return;
    const iv = setInterval(() => {
      const q = new URLSearchParams({ visitorId: vidRef.current, pagePath: pathname });
      if (lastPoll.current) q.set('since', lastPoll.current);
      fetch(`/api/host?${q}`)
        .then((r) => r.json())
        .then((d) => {
          if (Array.isArray(d.messages) && d.messages.length) {
            const fresh = d.messages.filter((m: any) => m.who === 'team');
            if (fresh.length) {
              setMsgs((prev) => {
                const have = new Set(prev.map((x) => x.id));
                const add = fresh.filter((m: any) => !have.has(m.id));
                return add.length ? [...prev, ...add] : prev;
              });
              speak(fresh[fresh.length - 1].text);
            }
            lastPoll.current = d.messages[d.messages.length - 1].createdAt;
          }
        })
        .catch(() => {});
    }, 5000);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, hide, pathname]);

  // Global event bridge + Escape key to close EITHER popup or panel immediately
  useEffect(() => {
    const onOpen = (e: Event) => {
      const q = (e as CustomEvent).detail?.qualifier as string | undefined;
      const prompt = (e as CustomEvent).detail?.prompt as string | undefined;
      setNudge(null);
      markPathDismissed(pathname);
      setOpen(true);
      if (prompt) send({ message: prompt });
      else if (q) send({ qualifier: q });
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (open) closePanel();
        else if (nudge) dismissNudge(false);
      }
    };
    window.addEventListener('kr8:host-open', onOpen);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('kr8:host-open', onOpen);
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, nudge, pathname]);

  // Smooth scroll to newest message
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, typing, open]);

  function closePanel() {
    setOpen(false);
    setNudge(null);
    markPathDismissed(pathname);
  }

  function speak(text: string) {
    if (!voice || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(decodeHtmlEntities(text).replace(/\*\*/g, ''));
      u.rate = 1.02;
      window.speechSynthesis.speak(u);
    } catch {}
  }

  function buildActivitySummary(): string {
    const parts: string[] = [];
    if (activeSectionRef.current) parts.push(`section:#${activeSectionRef.current}`);
    if (scrollRatioRef.current > 0.1) parts.push(`scrolled:${Math.round(scrollRatioRef.current * 100)}%`);
    if (lastInteractedLabelRef.current) parts.push(`clicked:"${lastInteractedLabelRef.current}"`);
    if (pagesSeenRef.current.length > 1) parts.push(`journey:${pagesSeenRef.current.join('→')}`);
    return parts.join(', ');
  }

  async function send(payload: { message?: string; qualifier?: string }) {
    setHasRealHistory(true);
    markPathDismissed(pathname);
    if (payload.message) {
      setMsgs((m) => [...m, { id: 'u' + Date.now(), who: 'you', text: payload.message! }]);
    }
    setChips([]);
    setTyping(true);
    try {
      const r = await fetch('/api/host', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          visitorId: vidRef.current,
          page: pathname,
          pageTitle: typeof document !== 'undefined' ? document.title : '',
          activeSection: activeSectionRef.current,
          visitorActivity: buildActivitySummary(),
        }),
      });
      const d = await r.json();
      setTyping(false);
      if (d?.reply?.say) {
        setMsgs((m) => [
          ...m,
          {
            id: d.messageId || 'b' + Date.now(),
            who: 'bot',
            name: 'RIYA',
            text: d.reply.say,
            links: d.reply.links || [],
            submissionRef: d.reply.submissionRef,
            intent: d.reply.intent,
          },
        ]);
        setChips(d.reply.chips || []);
        if (d.reply.handoff) setHandoffActive(true);
        lastPoll.current = new Date().toISOString();
        speak(d.reply.say);
      }
    } catch {
      setTyping(false);
      setMsgs((m) => [
        ...m,
        {
          id: 'e' + Date.now(),
          who: 'bot',
          name: 'RIYA',
          text: 'Quick connection hiccup — try sending that once more, or message our team straight on WhatsApp (+234 812 568 7509).',
        },
      ]);
    }
  }

  async function rateMessage(msgId: string, helpful: boolean, intent?: string) {
    setMsgs((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, rated: helpful ? 'up' : 'down' } : m))
    );
    fetch('/api/host', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'rate',
        visitorId: vidRef.current,
        messageId: msgId,
        helpful,
        intent: intent || '',
        page: pathname,
      }),
    }).catch(() => {});
  }

  async function resetConversation() {
    await fetch('/api/host', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'clear_memory',
        visitorId: vidRef.current,
        page: pathname,
      }),
    }).catch(() => {});
    const dossier = getPageDossier(pathname);
    setHandoffActive(false);
    setHasRealHistory(false);
    setMsgs([
      {
        id: 'riya-seed-' + Date.now(),
        who: 'bot',
        name: 'RIYA',
        text: dossier.chatOpener,
      },
    ]);
    setChips(dossier.defaultChips);
  }

  function dismissNudge(muteAll = false) {
    const trig = nudge?.id || 'manual';
    setNudge(null);
    markPathDismissed(pathname);
    if (muteAll) {
      setProactiveMuted(true);
      try {
        localStorage.setItem(PROACTIVE_MUTE_KEY, '1');
      } catch {}
    }
    fetch('/api/host', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'proactive_event',
        state: muteAll ? 'muted' : 'dismissed',
        trigger: trig,
        visitorId: vidRef.current,
        page: pathname,
      }),
    }).catch(() => {});
  }

  function engageNudge() {
    if (!nudge) return;
    const currentNudge = nudge;
    setNudge(null);
    markPathDismissed(pathname);
    setOpen(true);

    // Continue seamlessly from the exact page question RIYA just asked!
    setMsgs((prev) => {
      if (prev.length <= 1 && prev[0]?.id?.startsWith('riya-seed')) {
        return [
          {
            id: 'riya-seed-nudge-' + Date.now(),
            who: 'bot',
            name: 'RIYA',
            text: `**${currentNudge.title}**\n${currentNudge.question}`,
          },
        ];
      }
      return [
        ...prev,
        {
          id: 'riya-nudge-' + Date.now(),
          who: 'bot',
          name: 'RIYA',
          text: currentNudge.question,
        },
      ];
    });
    setChips(currentNudge.quickReplies);
    setTimeout(() => inputRef.current?.focus(), 120);

    fetch('/api/host', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'proactive_event',
        state: 'engaged',
        trigger: currentNudge.id,
        visitorId: vidRef.current,
        page: pathname,
      }),
    }).catch(() => {});
  }

  function onChip(val: string) {
    if (['business', 'learner', 'job', 'community'].includes(val)) return send({ qualifier: val });
    if (val === '__quote') {
      closePanel();
      router.push('/contact');
      return;
    }
    if (val === '__apply') {
      window.open(`${site.ecosystem.academy.url}/apply`, '_blank', 'noopener');
      return;
    }
    if (val === '__whatsapp') {
      window.open(`https://wa.me/${site.company.whatsapp}`, '_blank', 'noopener');
      return;
    }
    if (val === '__roles') {
      closePanel();
      router.push('/about/join-the-team');
      return;
    }
    if (val === '__partners') {
      closePanel();
      router.push('/partners#propose');
      return;
    }
    if (val === '__human') {
      return send({ message: 'Please connect me with a human team member.' });
    }
    send({ message: val });
  }

  function toggleVoice() {
    const next = !voice;
    setVoice(next);
    try {
      localStorage.setItem(VOICE_KEY, next ? '1' : '0');
      if (!next && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    } catch {}
  }

  function toggleListen() {
    if (!canSR) return;
    if (listening && recRef.current) {
      recRef.current.stop();
      setListening(false);
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const r = new SR();
    r.lang = 'en-US';
    r.interimResults = false;
    r.onresult = (ev: any) => {
      const t = ev.results?.[0]?.[0]?.transcript;
      if (t) send({ message: t });
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    recRef.current = r;
    setListening(true);
    r.start();
  }

  if (hide) return null;

  return (
    <>
      {/* Mobile tap-outside backdrop so tapping outside always closes RIYA cleanly */}
      <div
        className={`host-backdrop ${open ? 'is-open' : ''}`}
        onClick={closePanel}
        aria-hidden="true"
      />

      {/* Page-Specific, Activity-Sensitive Question Popup */}
      <div
        className={`host-welcome ${nudge && !open ? 'is-open' : ''}`}
        role="dialog"
        aria-label={editableContent.texts.field_9b49c8b6d8}
      >
        <button
          type="button"
          className="host-welcome__close"
          onClick={(e) => {
            e.stopPropagation();
            dismissNudge(false);
          }}
          aria-label={editableContent.texts.field_0032f27178}
          title={editableContent.texts.field_7d9eb7acb1}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="host-welcome__top">
          <div className="host-welcome__ava" aria-hidden>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <path d="M12 3l2.4 5.2L20 9.3l-4.2 3.9L17 19l-5-2.8L7 19l1.2-5.8L4 9.3l5.6-1.1z" />
            </svg>
          </div>
          <div className="host-welcome__txt">
            <b>{nudge?.title || editableContent.texts.copy_fde6973405}</b>
            <span>{nudge?.question}</span>
          </div>
        </div>

        <div className="host-welcome__actions">
          <button type="button" className="yes" onClick={engageNudge}>
            {nudge?.ctaLabel || editableContent.texts.copy_b9a10f72be}
          </button>
          <button type="button" className="no" onClick={() => dismissNudge(false)}>
            {editableContent.texts.text_7d9eb7acb1}</button>
        </div>
        <div style={{ marginTop: 8, textAlign: 'right' }}>
          <button
            type="button"
            onClick={() => dismissNudge(true)}
            style={{
              fontSize: 11,
              color: 'var(--t-faint)',
              textDecoration: 'underline',
              textUnderlineOffset: 2,
              cursor: 'pointer',
              background: 'transparent',
              border: 0,
              padding: '2px 4px',
            }}
          >
            {editableContent.texts.text_8b83aa5cce}</button>
        </div>
      </div>

      {/* Floating RIYA Launcher */}
      {!open && (
        <button
          type="button"
          className="host-launcher"
          onClick={() => {
            setNudge(null);
            markPathDismissed(pathname);
            setOpen(true);
            setTimeout(() => inputRef.current?.focus(), 120);
          }}
          aria-label={editableContent.texts.field_b2202e1ccf}
        >
          <span className="host-launcher__ava" style={{ position: 'relative' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <path d="M12 3l2.4 5.2L20 9.3l-4.2 3.9L17 19l-5-2.8L7 19l1.2-5.8L4 9.3l5.6-1.1z" />
            </svg>
            <span className="host-launcher__dot" />
          </span>
          <span>{editableContent.texts.text_1e54860406}</span>
        </button>
      )}

      {/* RIYA Conversational Panel */}
      <aside className={`host-panel ${open ? 'is-open' : ''}`} aria-label={editableContent.texts.field_7211d51abf}>
        <div className="host-head">
          <div className="host-head__ava" style={{ fontWeight: 800, fontSize: 11.5, letterSpacing: '0.04em' }}>
            {editableContent.texts.text_e7932a8be5}</div>
          <div className="host-head__meta">
            <div className="host-head__name">{editableContent.texts.text_e7932a8be5}</div>
            <div className="host-head__status">
              <i />
              {handoffActive ? editableContent.texts.copy_2a81a2a415 : editableContent.texts.copy_f848a203d7}
            </div>
          </div>
          <button
            type="button"
            className="host-icon-btn"
            onClick={resetConversation}
            title={editableContent.texts.field_9a6cc8a492}
            aria-label={editableContent.texts.field_9a6cc8a492}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
              <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
          <button
            type="button"
            className="host-icon-btn"
            aria-pressed={voice}
            onClick={toggleVoice}
            title={voice ? editableContent.texts.copy_2f084475a4 : editableContent.texts.copy_70e09074f6}
            aria-label={editableContent.texts.field_1735e49e5a}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              {voice ? <path d="M15.5 8.5a5 5 0 010 7M19 5a10 10 0 010 14" /> : <path d="M22 9l-6 6M16 9l6 6" />}
            </svg>
          </button>
          <button
            type="button"
            className="host-close-pill"
            onClick={closePanel}
            aria-label={editableContent.texts.field_38b8a80946}
            title={editableContent.texts.field_014372dcd1}
          >
            <span>{editableContent.texts.text_7d9eb7acb1}</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="host-body" ref={bodyRef}>
          {msgs.map((m) => (
            <div
              key={m.id}
              className={`host-msg ${
                m.who === 'you' ? 'host-msg--user' : m.who === 'team' ? 'host-msg--team' : 'host-msg--bot'
              }`}
            >
              {m.who === 'team' && <div className="host-msg__who">{m.name || editableContent.texts.copy_28478a9c3f} {editableContent.texts.text_296aeb8bc7}</div>}
              <div>{renderFormattedText(m.text)}</div>

              {m.submissionRef && (
                <div
                  style={{
                    marginTop: 8,
                    padding: '6px 10px',
                    borderRadius: 8,
                    background: 'var(--status-ok-bg)',
                    border: '1px solid var(--status-ok-bd)',
                    fontSize: 11.5,
                    color: 'var(--status-ok-fg)',
                    fontWeight: 600,
                  }}
                >
                  {editableContent.texts.text_81de0636d7}{m.submissionRef}
                </div>
              )}

              {Array.isArray(m.links) && m.links.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                  {m.links.map((l, idx) => (
                    <span key={l.href + l.label}>
                      {l.outbound || l.href.startsWith('http') ? (
                        <a
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-block',
                            fontSize: 11.5,
                            fontWeight: 600,
                            padding: '4px 10px',
                            borderRadius: 999,
                            background: 'rgba(255,45,155,0.14)',
                            border: '1px solid rgba(255,45,155,0.38)',
                            color: 'var(--t-strong)',
                          }}
                        >
                          {decodeHtmlEntities(l.label)}
                        </a>
                      ) : (
                        <Link
                          href={l.href}
                          onClick={closePanel}
                          style={{
                            display: 'inline-block',
                            fontSize: 11.5,
                            fontWeight: 600,
                            padding: '4px 10px',
                            borderRadius: 999,
                            background: 'rgba(124,58,237,0.14)',
                            border: '1px solid rgba(124,58,237,0.32)',
                            color: 'var(--t-strong)',
                          }}
                        >
                          {decodeHtmlEntities(l.label)} →
                        </Link>
                      )}
                      {idx < (m.links?.length || 0) - 1 ? '  ' : ''}
                    </span>
                  ))}
                </div>
              )}

              {m.who === 'bot' && !m.id.startsWith('riya-seed') && !m.id.startsWith('riya-nudge') && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: 6,
                    marginTop: 8,
                    opacity: 0.85,
                    fontSize: 11,
                  }}
                >
                  {m.rated ? (
                    <span style={{ color: 'var(--status-ok-fg)', fontWeight: 600 }}>{editableContent.texts.text_f2082eaee3}</span>
                  ) : (
                    <>
                      <span style={{ color: 'var(--t-faint)' }}>{editableContent.texts.text_03b310b916}</span>
                      <button
                        type="button"
                        onClick={() => rateMessage(m.id, true, m.intent)}
                        aria-label={editableContent.texts.field_21a0a39579}
                        style={{
                          padding: '1px 7px',
                          borderRadius: 4,
                          border: '1px solid var(--border-strong)',
                          color: 'var(--t-body)',
                          cursor: 'pointer',
                        }}
                      >
                        {editableContent.texts.text_85a39ab345}</button>{' '}
                      <button
                        type="button"
                        onClick={() => rateMessage(m.id, false, m.intent)}
                        aria-label={editableContent.texts.field_8405f0bafa}
                        style={{
                          padding: '1px 7px',
                          borderRadius: 4,
                          border: '1px solid var(--border-strong)',
                          color: 'var(--t-body)',
                          cursor: 'pointer',
                        }}
                      >
                        {editableContent.texts.text_1ea442a134}</button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}

          {typing && (
            <div className="host-msg host-msg--bot" aria-label={editableContent.texts.field_d219199740}>
              <span className="host-typing">
                <i />
                <i />
                <i />
              </span>
            </div>
          )}

          {chips.length > 0 && !typing && (
            <div className="host-chips">
              {chips.map((c) => (
                <button key={c.label} type="button" className="host-chip" onClick={() => onChip(c.value)}>
                  {decodeHtmlEntities(c.label)}
                </button>
              ))}
            </div>
          )}
        </div>

        <form
          className="host-compose"
          onSubmit={(e) => {
            e.preventDefault();
            const v = input.trim();
            if (!v || typing) return;
            setInput('');
            send({ message: v });
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={editableContent.texts.field_c18700f6ac}
            aria-label={editableContent.texts.field_f137002dc9}
          />
          {canSR && (
            <button
              type="button"
              className="host-icon-btn"
              aria-pressed={listening}
              onClick={toggleListen}
              title={editableContent.texts.field_baf16278df}
              aria-label={editableContent.texts.field_8748f23993}
              style={{ alignSelf: 'center' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="9" y="3" width="6" height="12" rx="3" />
                <path d="M5 11a7 7 0 0014 0M12 18v3" />
              </svg>
            </button>
          )}
          <button type="submit" className="host-send" disabled={!input.trim() || typing} aria-label={editableContent.texts.field_93a26b1eaf}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </form>

        <div className="host-foot">
          {editableContent.texts.text_3250b13cf3}<Link href={editableContent.texts.field_0ece7f7c30} onClick={closePanel}>{editableContent.texts.text_54a57c3147}</Link> ·{' '}
          <a href={formatEditableText("https://wa.me/{0}", [site.company.whatsapp])} target="_blank" rel="noopener noreferrer">
            {editableContent.texts.text_6a40edf1fc}</a>
        </div>
      </aside>
    </>
  );
}
