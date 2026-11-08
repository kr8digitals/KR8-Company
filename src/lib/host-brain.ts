import { buildQualifierOpener, runRiyaTurn, type RiyaTurnOutput } from './riya-engine';

export type HostReply = {
  say: string;
  chips?: { label: string; value: string }[];
  links?: { label: string; href: string; outbound?: boolean }[];
  handoff?: boolean;
  intent?: string;
};

export function opener(qualifier: string, pagePath = '/'): HostReply {
  const out = buildQualifierOpener(qualifier, pagePath);
  return {
    say: out.say,
    chips: out.chips,
    links: out.links,
    handoff: out.handoff,
    intent: out.intent,
  };
}

export async function reply(message: string, pagePath = '/'): Promise<RiyaTurnOutput> {
  return runRiyaTurn({
    message,
    visitorId: 'direct',
    sessionId: 'direct',
    pagePath,
  });
}
