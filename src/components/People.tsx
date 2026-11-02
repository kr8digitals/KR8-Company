import Link from 'next/link';
import Image from 'next/image';
import { Icon } from './ui';

export type Person = {
  name: string; role: string; bio: string; photo?: string; initials: string; creds?: string[];
};

export const FOUNDERS: Person[] = [
  {
    name: 'Kenneth Timothy Iziogo',
    role: 'Founder & CEO · known as Timfire',
    bio: 'Full-stack engineer, AI agent architect, brand designer, video director and linguistics scholar. Founded KR8 to build the ladder he wished existed when he opened his first creative software — and to remove the fee at the bottom of it.',
    photo: '/img/team-timfire.jpg',
    initials: 'KT',
    creds: ['Website Development', 'AI systems', 'Cohort accountability'],
  },
  {
    name: 'Stevenson',
    role: 'Co-founder · Media Director · Motion Verse',
    bio: 'Leads graphic design at KR8 under his studio, Motion Verse. Years of turning raw ideas into brand-ready visuals — and the same eye applied to every lesson he teaches.',
    photo: '/img/team-stevenson.jpg',
    initials: 'ST',
    creds: ['Graphic Design track', 'Brand & identity', 'Motion Verse'],
  },
  {
    name: 'Daniel',
    role: 'Co-founder · COO · known as Creative Expression',
    bio: 'Heads video editing and animation, running his own studio, Chigoma. Teaches students to edit with intention rather than software familiarity — why a cut lands, why a hook holds.',
    photo: '/img/team-daniel.jpg',
    initials: 'DN',
    creds: ['Video Editing track', 'Motion & post', 'Chigoma'],
  },
];

export default function People({ compact = false }: { compact?: boolean }) {
  return (
    <section className="section" id="team" style={{ borderTop: '1px solid var(--hair-soft)' }}>
      <div className="wrap">
        <div className="sec-head reveal up">
          <div>
            <div className="eyebrow">The team</div>
            <h2 className="section-title">Taught by people who sell the work</h2>
            <p className="section-lede">
              Three founders, one team, and a growing paid staff that delivers client contracts and runs
              the programmes together. Nobody here teaches something they do not practise.
            </p>
          </div>
          <Link href="/about/join-the-team" className="btn-link">We are hiring <Icon name="arrow" size={15} /></Link>
        </div>

        <div className="people-grid">
          {FOUNDERS.map((p, i) => (
            <article className="person reveal up" data-delay={i * 80} key={p.name}>
              <div className="person__img">
                {p.photo ? (
                  <Image src={p.photo} alt={`${p.name} — ${p.role}`} width={600} height={750} sizes="(max-width:640px) 100vw, 33vw" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                ) : (
                  <div className="person__initials">{p.initials}</div>
                )}
              </div>
              <div className="person__body">
                <div className="person__role">{p.role}</div>
                <div className="person__name">{p.name}</div>
                {!compact && <p className="person__bio">{p.bio}</p>}
                {p.creds && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
                    {p.creds.map((c) => <span className="pill" key={c}>{c}</span>)}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="reveal up" style={{ marginTop: 28, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <Link href="/about/join-the-team" className="btn-primary">Join the team <Icon name="arrow" size={17} /></Link>
          <span style={{ fontSize: 13.5, color: 'var(--t-muted)' }}>
            Paid roles: general manager, Tribe manager, social media, editors, designers, developers.
          </span>
        </div>
      </div>
    </section>
  );
}
