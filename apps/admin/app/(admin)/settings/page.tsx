'use client';

import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Field } from '@/components/ui/Field';
import { MoonInput } from '@/components/ui/Input';
import { MoonTextarea } from '@/components/ui/Textarea';
import { Toggle } from '@/components/ui/Toggle';
import { Btn } from '@/components/ui/Btn';
import {
  DEFAULT_ADMIN_SETTINGS,
  readAdminSettings,
  saveAdminSettings,
  type AdminSettings,
} from '@/lib/admin/adminSettings';

type SectionId = 'store' | 'shipping' | 'taxes' | 'payments' | 'notifications' | 'appearance';

const sections: Array<{ id: SectionId; icon: string; label: string; desc: string; status: 'Configurable' | 'Local' }> = [
  { id: 'store', icon: 'store', label: 'Store details', desc: 'Business name, address, and customer contact information.', status: 'Local' },
  { id: 'shipping', icon: 'local_shipping', label: 'Shipping zones', desc: 'Default checkout shipping controls for local testing.', status: 'Local' },
  { id: 'taxes', icon: 'account_balance', label: 'Taxes', desc: 'GST collection settings for checkout planning.', status: 'Local' },
  { id: 'payments', icon: 'credit_card', label: 'Payments', desc: 'Razorpay mode notes and test amount helper.', status: 'Local' },
  { id: 'notifications', icon: 'email', label: 'Notifications', desc: 'Order and stock notification preferences.', status: 'Local' },
  { id: 'appearance', icon: 'palette', label: 'Appearance', desc: 'Admin-visible brand settings and announcement text.', status: 'Local' },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SectionId>('store');
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_ADMIN_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(readAdminSettings());
  }, []);

  const activeMeta = useMemo(
    () => sections.find((section) => section.id === activeSection) ?? sections[0],
    [activeSection]
  );

  const setValue = <K extends keyof AdminSettings>(key: K, value: AdminSettings[K]) => {
    setSettings((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const save = () => {
    saveAdminSettings(settings);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="anim-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1120 }}>
      <PageHeader
        eyebrow="System"
        title="Settings"
        subtitle="Click a settings card to configure that part of the admin console."
        actions={[
          <Btn key="save" variant="primary" icon="save" onClick={save}>Save settings</Btn>,
        ]}
      />

      {saved ? (
        <div style={{ padding: 12, borderRadius: 10, border: '1px solid var(--sage)', color: 'var(--sage)' }}>
          Settings saved locally and applied to this admin browser.
        </div>
      ) : null}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {sections.map((section) => {
          const selected = section.id === activeSection;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              style={{
                textAlign: 'left',
                border: selected ? '1px solid var(--saffron)' : '1px solid var(--line)',
                borderRadius: 16,
                padding: 0,
                background: 'transparent',
                cursor: 'pointer',
                boxShadow: selected ? '0 0 0 3px color-mix(in oklab, var(--saffron) 18%, transparent)' : 'none',
              }}
            >
              <Card style={{ height: '100%', border: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 11,
                    background: selected ? 'var(--saffron-soft)' : 'var(--sage-soft)',
                    color: selected ? 'var(--saffron-ink)' : 'var(--sage)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon name={section.icon} size={22} />
                  </div>
                  <Pill tone={section.status === 'Configurable' ? 'sage' : 'neutral'} size="sm">{section.status}</Pill>
                </div>
                <div style={{ fontSize: 14.5, fontWeight: 500, color: 'var(--ink)', marginBottom: 6 }}>{section.label}</div>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5 }}>{section.desc}</p>
              </Card>
            </button>
          );
        })}
      </div>

      <Card title={activeMeta.label} subtitle={activeMeta.desc}>
        <div style={{ marginTop: 18, display: 'grid', gap: 18, maxWidth: 720 }}>
          {activeSection === 'store' ? (
            <>
              <Field label="Store name"><MoonInput value={settings.storeName} onChange={(event) => setValue('storeName', event.target.value)} /></Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="Support email"><MoonInput type="email" value={settings.supportEmail} onChange={(event) => setValue('supportEmail', event.target.value)} /></Field>
                <Field label="Support phone"><MoonInput value={settings.supportPhone} onChange={(event) => setValue('supportPhone', event.target.value)} /></Field>
              </div>
              <Field label="Business address"><MoonTextarea rows={3} value={settings.businessAddress} onChange={(event) => setValue('businessAddress', event.target.value)} /></Field>
            </>
          ) : null}

          {activeSection === 'shipping' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="Default shipping cost"><MoonInput type="number" min={0} value={settings.defaultShippingCost} onChange={(event) => setValue('defaultShippingCost', Number(event.target.value))} /></Field>
              <Field label="Free shipping threshold"><MoonInput type="number" min={0} value={settings.freeShippingThreshold} onChange={(event) => setValue('freeShippingThreshold', Number(event.target.value))} /></Field>
            </div>
          ) : null}

          {activeSection === 'taxes' ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Toggle checked={settings.gstEnabled} onChange={(value) => setValue('gstEnabled', value)} />
                <span style={{ fontSize: 13, color: 'var(--ink)' }}>Collect GST in checkout calculations</span>
              </div>
              <Field label="GST rate"><MoonInput type="number" min={0} max={100} value={settings.gstRate} onChange={(event) => setValue('gstRate', Number(event.target.value))} /></Field>
            </>
          ) : null}

          {activeSection === 'payments' ? (
            <>
              <Field label="Razorpay mode">
                <select
                  value={settings.razorpayMode}
                  onChange={(event) => setValue('razorpayMode', event.target.value as AdminSettings['razorpayMode'])}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--line)', background: 'var(--bg-sunk)', color: 'var(--ink)' }}
                >
                  <option value="live">Live</option>
                  <option value="test">Test</option>
                </select>
              </Field>
              <Field label="Payment test amount"><MoonInput type="number" min={1} value={settings.paymentTestAmount} onChange={(event) => setValue('paymentTestAmount', Number(event.target.value))} /></Field>
              <div style={{ color: 'var(--ink-2)', fontSize: 13, lineHeight: 1.6 }}>
                Razorpay keys still come from backend environment variables. These local settings do not switch the backend gateway mode.
              </div>
            </>
          ) : null}

          {activeSection === 'notifications' ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Toggle checked={settings.orderEmails} onChange={(value) => setValue('orderEmails', value)} />
                <span style={{ fontSize: 13, color: 'var(--ink)' }}>Send order confirmation emails</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Toggle checked={settings.lowStockAlerts} onChange={(value) => setValue('lowStockAlerts', value)} />
                <span style={{ fontSize: 13, color: 'var(--ink)' }}>Show low stock alerts</span>
              </div>
            </>
          ) : null}

          {activeSection === 'appearance' ? (
            <>
              <Field label="Accent color"><MoonInput type="color" value={settings.accentColor} onChange={(event) => setValue('accentColor', event.target.value)} style={{ height: 44, padding: 6 }} /></Field>
              <Field label="Announcement text"><MoonInput value={settings.announcementText} onChange={(event) => setValue('announcementText', event.target.value)} placeholder="Optional storefront announcement" /></Field>
              <div style={{ color: 'var(--ink-2)', fontSize: 13, lineHeight: 1.6 }}>
                Accent color is applied to the admin console after saving. Storefront announcement text is stored locally until backend settings are added.
              </div>
            </>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
