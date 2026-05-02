import type { ReactNode } from 'react';
import Footer from './Footer';

const navy = '#0D2F4A';

type LegalPageLayoutProps = {
  title: string;
  children: ReactNode;
};

/** En-tête et conteneur communs aux pages légales (fond blanc, typo alignée sur le site). */
export function LegalPageLayout({ title, children }: LegalPageLayoutProps) {
  return (
    <div className="bg-white min-h-screen">
      <main className="pt-[calc(68px+3rem)] pb-16 md:pb-24 px-6">
        <article className="max-w-3xl mx-auto">
          <h1
            className="text-3xl md:text-4xl font-black tracking-tight mb-10 md:mb-12"
            style={{ color: navy }}
          >
            {title}
          </h1>
          <div className="space-y-10 md:space-y-12">{children}</div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

type LegalSectionProps = {
  title: string;
  children: ReactNode;
};

/** Bloc titre de section + contenu (texte corps 16px, #1A1A1A). */
export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section aria-labelledby={slugifyId(title)}>
      <h2
        id={slugifyId(title)}
        className="text-xl md:text-2xl font-bold mb-4 tracking-tight"
        style={{ color: navy }}
      >
        {title}
      </h2>
      <div className="text-[16px] md:text-[17px] leading-[1.65] text-[#1A1A1A] font-normal space-y-3">
        {children}
      </div>
    </section>
  );
}

function slugifyId(title: string): string {
  const base = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `legal-${base}`;
}
