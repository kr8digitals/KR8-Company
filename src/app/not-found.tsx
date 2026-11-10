import { getEditableDocument } from '@/lib/editable-content';
import Link from 'next/link';
import { Icon } from '@/components/ui';
import { SectionAtmosphere } from '@/components/MobileExperience';

export default async function NotFound() {
  const editableContent = await getEditableDocument("app:not-found");

  return (
    <section className="kr8-subhero" style={{ minHeight: '76vh', display: 'flex', alignItems: 'center' }}>
      <SectionAtmosphere name="cta-horizon-flare" deskOpacity={0.32} mobOpacity={0.44} flare />
      <div className="wrap">
        <div style={{ maxWidth: 680 }}>
          <span className="kr8-pill">{editableContent.texts.text_ae86d1e408}</span>
          <h1 className="kr8-subhero__title">
            {editableContent.texts.text_6929b59ea9}{' '}
            <em>{editableContent.texts.text_883ce48e09}</em>
          </h1>
          <p className="kr8-subhero__lede">
            {editableContent.texts.text_680b9b6619}</p>
          <div className="kr8-subhero__actions">
            <Link href="/" className="btn-primary">
              {editableContent.texts.text_3449554599}<Icon name="arrow" size={17} />
            </Link>
            <Link href={editableContent.texts.field_3b1aeccb74} className="btn-ghost">
              {editableContent.texts.text_2093ef4e36}</Link>
            <Link href={editableContent.texts.field_271bdd2473} className="btn-ghost">
              {editableContent.texts.text_90e70a8ba3}</Link>
            <Link href={editableContent.texts.field_6d0f8c425c} className="btn-ghost">
              {editableContent.texts.text_5dab502bfb}</Link>
            <Link href={editableContent.texts.field_4eb9506365} className="btn-ghost">
              {editableContent.texts.text_98b67063cf}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
