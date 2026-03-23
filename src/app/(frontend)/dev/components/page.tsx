'use client';

import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

// ── Shared Controls ──────────────────────────────────────────────
import Button from '@/components/controls/button';
import Input from '@/components/controls/input';
import Checkbox from '@/components/controls/checkbox';
import RadioButton from '@/components/controls/radio-button';
import Select from '@/components/controls/select';
import Textarea from '@/components/controls/text-area';
import Toggle from '@/components/controls/toggle';
import PillSelector from '@/components/controls/pill-selector';
import Favorite from '@/components/controls/favorite';
import InlineEdit from '@/components/controls/inline-edit';
import { Dropdown, DropdownItem, DropdownTitle, DropdownDivider } from '@/components/controls/dropdown';

// ── Indicators ───────────────────────────────────────────────────
import Pill from '@/components/indicators/pill';
import Toast from '@/components/indicators/toast';
import Reviews from '@/components/indicators/reviews';

// ── Layout ───────────────────────────────────────────────────────
import CollapsibleCard from '@/components/layout/collapsible-card';
import Divider from '@/components/layout/divider';

// ── Feature Components ───────────────────────────────────────────
import ConditionBadge from '@/features/listings/components/condition-badge';
import ExpandableSection from '@/features/listings/components/expandable-section';

import styles from './components.module.scss';

// ═══════════════════════════════════════════════════════════════════
// Sidebar Navigation
// ═══════════════════════════════════════════════════════════════════

const NAV_SECTIONS = [
  {
    label: 'Foundation',
    links: [
      { id: 'colors', label: 'Color System' },
      { id: 'typography', label: 'Typography' },
      { id: 'spacing', label: 'Spacing & Layout' },
      { id: 'radius', label: 'Radius & Shadows' },
      { id: 'motion', label: 'Motion & Animation' },
      { id: 'zindex', label: 'Z-Index & Breakpoints' },
    ],
  },
  {
    label: 'Controls',
    links: [
      { id: 'buttons', label: 'Buttons' },
      { id: 'forms', label: 'Form Elements' },
      { id: 'toggles', label: 'Toggles & Selectors' },
      { id: 'dropdowns', label: 'Dropdowns' },
      { id: 'inline-edit', label: 'Inline Edit' },
      { id: 'favorites', label: 'Favorites' },
    ],
  },
  {
    label: 'Indicators',
    links: [
      { id: 'pills', label: 'Pills & Badges' },
      { id: 'conditions', label: 'Condition Badges' },
      { id: 'toasts', label: 'Toast Notifications' },
      { id: 'reviews', label: 'Rating Display' },
    ],
  },
  {
    label: 'Layout',
    links: [
      { id: 'collapsible', label: 'Collapsible Card' },
      { id: 'accordion', label: 'Expandable Section' },
      { id: 'dividers', label: 'Dividers' },
    ],
  },
];

function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarBrand}>
        <h2>Nessi</h2>
        <p>Component Showcase</p>
      </div>
      {NAV_SECTIONS.map((group) => (
        <div key={group.label} className={styles.sidebarGroup}>
          <div className={styles.sidebarLabel}>{group.label}</div>
          {group.links.map((link) => (
            <a key={link.id} href={`#${link.id}`} className={styles.sidebarLink}>
              {link.label}
            </a>
          ))}
        </div>
      ))}
    </aside>
  );
}

// ═══════════════════════════════════════════════════════════════════
// Color Token Data
// ═══════════════════════════════════════════════════════════════════

const COLOR_GROUPS = [
  {
    name: 'Green — Brand Primary',
    colors: [
      { label: '100', hex: '#D6E9E4' },
      { label: '200', hex: '#9ECABB' },
      { label: '300', hex: '#6BAD99' },
      { label: '400', hex: '#3D8C75' },
      { label: '500', hex: '#1E4A40', tag: 'PRIMARY' },
      { label: '600', hex: '#163831' },
      { label: '700', hex: '#0E2822' },
      { label: '800', hex: '#081812' },
      { label: '900', hex: '#030C09' },
    ],
  },
  {
    name: 'Orange — Brand Accent',
    colors: [
      { label: '100', hex: '#FBE9D9' },
      { label: '200', hex: '#F5C8A0' },
      { label: '300', hex: '#EEA86B' },
      { label: '400', hex: '#E89048' },
      { label: '500', hex: '#E27739', tag: 'PRIMARY' },
      { label: '600', hex: '#CC6830' },
      { label: '700', hex: '#B55A28' },
      { label: '800', hex: '#8A4018' },
      { label: '900', hex: '#5C2A0C' },
    ],
  },
  {
    name: 'Sand — App Background & Surfaces',
    colors: [
      { label: '100', hex: '#FAF7F2' },
      { label: '200', hex: '#F5EDDF' },
      { label: '300', hex: '#EDE0CB', tag: 'BG' },
      { label: '400', hex: '#E3D1B4' },
      { label: '500', hex: '#D9CCBA', tag: 'BORDER' },
      { label: '600', hex: '#C4B49E' },
      { label: '700', hex: '#A89278' },
      { label: '800', hex: '#7A6E62', tag: 'TEXT2' },
      { label: '900', hex: '#4A3F35' },
    ],
  },
  {
    name: 'Maroon — Reserved & Destructive',
    colors: [
      { label: '100', hex: '#F5D0D0' },
      { label: '200', hex: '#E8A0A0' },
      { label: '300', hex: '#D47070' },
      { label: '400', hex: '#B84040' },
      { label: '500', hex: '#681A19', tag: 'PRIMARY' },
      { label: '600', hex: '#551414' },
      { label: '700', hex: '#410F0F' },
      { label: '800', hex: '#2A0909' },
      { label: '900', hex: '#150404' },
    ],
  },
  {
    name: 'Neutral — Text & UI',
    colors: [
      { label: '100', hex: '#F8F8F7' },
      { label: '200', hex: '#EFEFED' },
      { label: '300', hex: '#E0DFDC' },
      { label: '400', hex: '#C8C6C1' },
      { label: '500', hex: '#A09D97' },
      { label: '600', hex: '#78756F' },
      { label: '700', hex: '#524F4A' },
      { label: '800', hex: '#2E2C28' },
      { label: '900', hex: '#1C1C1C', tag: 'TEXT' },
    ],
  },
];

const SEMANTIC_COLORS = [
  {
    name: 'SUCCESS',
    shades: [
      { label: '100', hex: '#D4EDDA' },
      { label: '200', hex: '#A8D9BC' },
      { label: '500', hex: '#1A6B43' },
      { label: '700', hex: '#0F4028' },
    ],
    bg: '#D4EDDA',
    border: '#A8D9BC',
    text: '#1A6B43',
  },
  {
    name: 'WARNING',
    shades: [
      { label: '100', hex: '#FEF3DC' },
      { label: '200', hex: '#F5D08A' },
      { label: '500', hex: '#B86E0A' },
      { label: '700', hex: '#7A4706' },
    ],
    bg: '#FEF3DC',
    border: '#F5D08A',
    text: '#B86E0A',
  },
  {
    name: 'ERROR',
    shades: [
      { label: '100', hex: '#FDE8E8' },
      { label: '200', hex: '#F5B5B5' },
      { label: '500', hex: '#B91C1C' },
      { label: '700', hex: '#7A1010' },
    ],
    bg: '#FDE8E8',
    border: '#F5B5B5',
    text: '#B91C1C',
  },
  {
    name: 'INFO',
    shades: [
      { label: '100', hex: '#D6E9E4' },
      { label: '200', hex: '#9ECABB' },
      { label: '500', hex: '#1E4A40' },
      { label: '700', hex: '#0E2822' },
    ],
    bg: '#D6E9E4',
    border: '#9ECABB',
    text: '#1E4A40',
  },
];

const INTERACTIVE_STATES: {
  state: string;
  green?: string;
  orange?: string;
  shared?: string;
  notes: string;
}[] = [
  { state: 'Default', green: '--color-green-500', orange: '--color-orange-500', notes: 'Resting state' },
  { state: 'Hover', green: '--color-green-600', orange: '--color-orange-600', notes: 'cursor:pointer' },
  { state: 'Active/Pressed', green: '--color-green-700', orange: '--color-orange-700', notes: 'scale(0.98)' },
  { state: 'Focus', green: '--shadow-focus-green', orange: '--shadow-focus-orange', notes: 'outline:none + box-shadow' },
  { state: 'Disabled', shared: 'opacity:0.38, cursor:not-allowed', notes: 'Never change color, use opacity' },
  { state: 'Loading', shared: 'opacity:0.7, cursor:wait', notes: 'Spinner replaces label' },
  { state: 'Error', shared: '--color-error-500 border + --shadow-focus-error', notes: 'Inputs only' },
  { state: 'Success', shared: '--color-success-500 border', notes: 'Inputs: valid state' },
  { state: 'Selected', shared: '--color-green-500 border (2px) + --color-green-100 bg', notes: 'Cards, options, pills' },
];

// ═══════════════════════════════════════════════════════════════════
// Typography Scale
// ═══════════════════════════════════════════════════════════════════

const TYPE_SCALE = [
  { size: '48px', preview: 'Just Listed', spec: 'DM Serif Display w:400 lh:1.2', use: 'Hero editorial' },
  { size: '32px', preview: 'Condition', spec: 'DM Serif Display w:400 lh:1.25', use: 'Section titles' },
  { size: '28px', preview: '$140', spec: 'DM Sans Bold w:700 lh:1.25', use: 'Listing price' },
  { size: '22px', preview: 'Shimano Stradic FL 2500', spec: 'DM Sans SemiBold w:600 lh:1.25', use: 'Listing detail title' },
  { size: '17px', preview: "Caleb's Gear Lab", spec: 'DM Sans SemiBold w:600 lh:1.35', use: 'Shop name, modal title' },
  { size: '15px', preview: 'Used one season of light bass fishing.', spec: 'DM Sans Regular w:400 lh:1.5', use: 'Body copy, inputs' },
  { size: '14px', preview: 'Minor cosmetic scuff on the underside.', spec: 'DM Sans Regular w:400 lh:1.65', use: 'Long-form copy' },
  { size: '13px', preview: 'Ships from Tennessee, USA', spec: 'DM Sans Regular w:400 lh:1.5', use: 'Metadata, helper text' },
  { size: '12px', preview: 'LISTING TITLE', spec: 'DM Sans SemiBold Uppercase ls:+0.05em', use: 'Form labels, eyebrows' },
  { size: '11px', preview: 'RiverGuide Crafts · Ships from FL', spec: 'DM Sans Regular w:400 lh:1.5', use: 'Card seller line' },
  { size: '10px', preview: 'GEAR RATIO', spec: 'DM Sans SemiBold Uppercase ls:+0.07em', use: 'Spec keys, tab labels' },
  { size: '9px', preview: 'VERY GOOD', spec: 'DM Sans Medium Uppercase ls:+0.05em', use: 'Condition badges' },
];

// ═══════════════════════════════════════════════════════════════════
// Spacing Scale
// ═══════════════════════════════════════════════════════════════════

const SPACING_SCALE = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64];

// ═══════════════════════════════════════════════════════════════════
// Radius Scale
// ═══════════════════════════════════════════════════════════════════

const RADIUS_SCALE = [
  { value: '4px', use: 'Micro tags' },
  { value: '6px', use: 'Sm button' },
  { value: '8px', use: 'Photo/thumb' },
  { value: '10px', use: 'Cards, inputs' },
  { value: '12px', use: 'Sheet top' },
  { value: '16px', use: 'Modal' },
  { value: '24px', use: 'Sheet edge' },
  { value: '999px', use: 'All pills' },
  { value: '50%', use: 'Avatar, FAB' },
];

// ═══════════════════════════════════════════════════════════════════
// Shadow Scale
// ═══════════════════════════════════════════════════════════════════

const SHADOW_SCALE = [
  { name: 'xs', value: '0 1px 2px rgba(0,0,0,0.06)', use: 'Filter chips' },
  { name: 'sm', value: '0 2px 8px rgba(0,0,0,0.08)', use: 'Seller card' },
  { name: 'md', value: '0 4px 16px rgba(0,0,0,0.10)', use: 'Toast' },
  { name: 'lg', value: '0 8px 32px rgba(0,0,0,0.12)', use: 'Bottom sheet' },
  { name: 'xl', value: '0 16px 48px rgba(0,0,0,0.15)', use: 'Modal' },
  { name: 'sell', value: '0 4px 12px rgba(226,119,57,0.45)', use: 'Sell FAB' },
  { name: 'focus-green', value: '0 0 0 3px rgba(30,74,64,0.28)', use: 'Primary focus' },
  { name: 'focus-error', value: '0 0 0 3px rgba(185,28,28,0.22)', use: 'Error focus' },
];

// ═══════════════════════════════════════════════════════════════════
// Motion Tokens
// ═══════════════════════════════════════════════════════════════════

const MOTION_DURATIONS = [
  { token: '--duration-100', value: '100ms', use: 'Button hover, icon color, tab active' },
  { token: '--duration-200', value: '180ms', use: 'Default — card hover, input focus, toggle' },
  { token: '--duration-300', value: '300ms', use: 'Page transitions, bottom sheet open' },
  { token: '--duration-400', value: '450ms', use: 'Modal entrance, toast slide-in' },
  { token: '--duration-500', value: '600ms', use: 'Skeleton shimmer, progress bars' },
];

const MOTION_EASINGS = [
  { token: '--ease-out', value: 'cubic-bezier(0.16, 1, 0.3, 1)', use: 'Default UI. Fast start, smooth finish.' },
  { token: '--ease-in', value: 'cubic-bezier(0.4, 0, 1, 1)', use: 'Exit/dismissal only. Starts slow, accelerates.' },
  { token: '--ease-spring', value: 'cubic-bezier(0.34, 1.56, 0.64, 1)', use: 'Micro-interactions with overshoot.' },
  { token: 'ease-linear', value: 'linear', use: 'Progress bars, spinners. Mechanical.' },
];

// ═══════════════════════════════════════════════════════════════════
// Z-Index & Breakpoints
// ═══════════════════════════════════════════════════════════════════

const ZINDEX_SCALE = [
  { z: '0', name: 'base', use: 'Normal flow' },
  { z: '10', name: 'raised', use: 'Card hover' },
  { z: '100', name: 'sticky', use: 'Top nav, filter strip' },
  { z: '300', name: 'nav-bottom', use: 'Bottom tab bar' },
  { z: '400', name: 'sheet-backdrop', use: 'Sheet dim backdrop' },
  { z: '410', name: 'sheet', use: 'Bottom sheet panel' },
  { z: '500', name: 'modal-backdrop', use: 'Modal dim backdrop' },
  { z: '510', name: 'modal', use: 'Modal panel' },
  { z: '600', name: 'toast', use: 'Toasts — above modals' },
  { z: '700', name: 'tooltip', use: 'Always topmost' },
];

const BREAKPOINTS = [
  { value: '320px', name: 'xs', use: 'Small phones. All layouts must work.' },
  { value: '375px', name: 'sm', use: 'Primary design target (iPhone 14). 3-col grid.' },
  { value: '768px', name: 'md', use: 'Tablet. 4-col grid. Sidebar layouts emerge.' },
  { value: '1024px', name: 'lg', use: 'Desktop. Top nav replaces bottom nav.' },
  { value: '1280px', name: 'xl', use: 'Large desktop. Max content 1200px centered.' },
];

// ═══════════════════════════════════════════════════════════════════
// Form Wrapper — provides react-hook-form context for form controls
// ═══════════════════════════════════════════════════════════════════

function FormDemo() {
  const methods = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      bio: '',
      condition: 'good',
      category: '',
      agreeTerms: false,
    },
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className={styles.formGrid}>
          <div className={styles.formItem}>
            <Input
              name="name"
              label="Listing Title"
              placeholder="e.g. Shimano Stradic FL 2500"
              isRequired
            />
          </div>
          <div className={styles.formItem}>
            <Input
              name="email"
              label="Email"
              type="email"
              placeholder="you@nessi.com"
              autoComplete="email"
            />
          </div>
          <div className={styles.formItem}>
            <Input
              name="password"
              label="Password"
              type="password"
              placeholder="Enter password"
              showPasswordStrength
            />
          </div>
          <div className={styles.formItem}>
            <Select
              name="category"
              label="Category"
              placeholder="Select category..."
              options={[
                { value: 'rods', label: 'Rods' },
                { value: 'reels', label: 'Reels' },
                { value: 'lures', label: 'Lures & Baits' },
                { value: 'flies', label: 'Flies' },
                { value: 'tackle', label: 'Tackle & Accessories' },
              ]}
            />
          </div>
          <div className={`${styles.formItem} ${styles.formItemFull}`}>
            <Textarea
              name="bio"
              label="Description"
              placeholder="Tell buyers what they need to know..."
            />
          </div>
          <div className={`${styles.formItem} ${styles.formItemFull}`}>
            <RadioButton
              name="condition"
              label="Condition"
              options={[
                { value: 'new_with_tags', label: 'New with Tags' },
                { value: 'like_new', label: 'Like New' },
                { value: 'good', label: 'Good' },
                { value: 'fair', label: 'Fair' },
              ]}
            />
          </div>
          <div className={styles.formItem}>
            <Checkbox name="agreeTerms" label="I agree to the terms and conditions" />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

// ═══════════════════════════════════════════════════════════════════
// Main Showcase Component
// ═══════════════════════════════════════════════════════════════════

export default function ComponentShowcase() {
  // Toggle state
  const [toggleA, setToggleA] = useState(true);
  const [toggleB, setToggleB] = useState(false);
  const [toggleC, setToggleC] = useState(true);

  // Pill selector state
  const [selectedPills, setSelectedPills] = useState<string[]>(['reels']);

  // Toast state
  const [toastSuccess, setToastSuccess] = useState(true);
  const [toastError, setToastError] = useState(true);

  // Inline edit state
  const [editValue, setEditValue] = useState('Shimano Stradic FL 2500');

  // Dev-only gate
  if (process.env.NODE_ENV === 'production') {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Not Available</h1>
        <p>Component showcase is only available in development.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Sidebar />

      <main className={styles.main}>
        <div className={styles.devBanner}>
          DEV ONLY — Component Showcase — All working Nessi components in one place
        </div>

        {/* ════════════════════════════════════════════════════════════
            FOUNDATION: Colors
            ════════════════════════════════════════════════════════════ */}
        <section id="colors" className={styles.section}>
          <div className={styles.sectionCategory}>Foundation</div>
          <h2 className={styles.sectionTitle}>Color System</h2>
          <p className={styles.sectionDesc}>
            Every token follows <code>--color-&#123;name&#125;-&#123;scale&#125;</code> where scale
            runs 100-900. Scale 500 is always the brand value.
          </p>

          {COLOR_GROUPS.map((group) => (
            <div key={group.name} className={styles.colorGroup}>
              <h3 className={styles.colorGroupTitle}>{group.name}</h3>
              <div className={styles.colorRow}>
                {group.colors.map((color) => (
                  <div key={color.label} className={styles.colorSwatch}>
                    <div className={styles.swatchBox} style={{ background: color.hex }} />
                    {color.tag && <div className={styles.swatchLabel}>{color.tag}</div>}
                    <div className={styles.swatchLabel}>{color.label}</div>
                    <div className={styles.swatchValue}>{color.hex}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className={styles.colorGroup}>
            <h3 className={styles.colorGroupTitle}>Semantic Color Set</h3>
            <div className={styles.semanticGrid}>
              {SEMANTIC_COLORS.map((semantic) => (
                <div
                  key={semantic.name}
                  className={styles.semanticCard}
                  style={{
                    background: semantic.bg,
                    borderColor: semantic.border,
                  }}
                >
                  <div className={styles.semanticName} style={{ color: semantic.text }}>
                    {semantic.name}
                  </div>
                  <div className={styles.semanticSwatches}>
                    {semantic.shades.map((shade) => (
                      <div
                        key={shade.label}
                        className={styles.semanticSwatch}
                        style={{
                          background: shade.hex,
                          borderColor:
                            shade.label === '100' ? semantic.border : 'transparent',
                        }}
                      />
                    ))}
                  </div>
                  <div className={styles.semanticLabels} style={{ color: semantic.text }}>
                    {semantic.shades.map((s) => s.label).join(' / ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.colorGroup}>
            <h3 className={styles.colorGroupTitle}>Interactive State Mapping</h3>
            <table className={styles.stateTable}>
              <thead>
                <tr>
                  <th>State</th>
                  <th>Green Token</th>
                  <th>Orange Token</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {INTERACTIVE_STATES.map((row, i) => (
                  <tr key={row.state} className={i % 2 === 1 ? styles.stateRowAlt : undefined}>
                    <td className={styles.stateCell}>{row.state}</td>
                    {row.shared ? (
                      <td className={styles.stateToken} colSpan={2}>
                        {row.shared}
                      </td>
                    ) : (
                      <>
                        <td className={styles.stateToken}>{row.green}</td>
                        <td className={styles.stateToken}>{row.orange}</td>
                      </>
                    )}
                    <td className={styles.stateNotes}>{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            FOUNDATION: Typography
            ════════════════════════════════════════════════════════════ */}
        <section id="typography" className={styles.section}>
          <div className={styles.sectionCategory}>Foundation</div>
          <h2 className={styles.sectionTitle}>Typography</h2>
          <p className={styles.sectionDesc}>
            Two fonts. <strong>DM Sans</strong> for all functional UI. <strong>DM Serif Display</strong>{' '}
            for editorial moments only. If you are unsure, it&apos;s DM Sans.
          </p>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Full Type Scale</h3>
            {TYPE_SCALE.map((row) => (
              <div key={row.size} className={styles.typeRow}>
                <span className={styles.typeSize}>{row.size}</span>
                <span className={styles.typePreview} style={{ fontSize: row.size }}>
                  {row.preview}
                </span>
                <span className={styles.typeSpec}>{row.spec}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            FOUNDATION: Spacing
            ════════════════════════════════════════════════════════════ */}
        <section id="spacing" className={styles.section}>
          <div className={styles.sectionCategory}>Foundation</div>
          <h2 className={styles.sectionTitle}>Spacing & Layout</h2>
          <p className={styles.sectionDesc}>
            4px base grid. All spacing values are multiples of 4. Use tokens — never hardcode pixel
            values in component CSS.
          </p>

          <div className={styles.spacingRow}>
            {SPACING_SCALE.map((px) => (
              <div key={px} className={styles.spacingItem}>
                <div className={styles.spacingBox} style={{ width: px, height: px }} />
                <span className={styles.spacingLabel}>{px}px</span>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            FOUNDATION: Radius & Shadows
            ════════════════════════════════════════════════════════════ */}
        <section id="radius" className={styles.section}>
          <div className={styles.sectionCategory}>Foundation</div>
          <h2 className={styles.sectionTitle}>Radius & Shadows</h2>
          <p className={styles.sectionDesc}>
            Consistent tokens. Warm, subtle shadows — never cool blue-grey. Radius is proportional
            to component size.
          </p>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Border Radius</h3>
            <div className={styles.radiusRow}>
              {RADIUS_SCALE.map((r) => (
                <div key={r.value} className={styles.radiusItem}>
                  <div className={styles.radiusBox} style={{ borderRadius: r.value }} />
                  <div className={styles.radiusLabel}>{r.value}</div>
                  <div className={styles.radiusUse}>{r.use}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Shadow Scale</h3>
            <div className={styles.shadowRow}>
              {SHADOW_SCALE.map((s) => (
                <div key={s.name} className={styles.shadowItem}>
                  <div className={styles.shadowBox} style={{ boxShadow: s.value }} />
                  <div className={styles.shadowLabel}>{s.name}</div>
                  <div className={styles.shadowValue}>{s.use}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            FOUNDATION: Motion
            ════════════════════════════════════════════════════════════ */}
        <section id="motion" className={styles.section}>
          <div className={styles.sectionCategory}>Foundation</div>
          <h2 className={styles.sectionTitle}>Motion & Animation</h2>
          <p className={styles.sectionDesc}>
            Nessi moves fast and feels physical. Animations should feel like the gear — purposeful,
            quick, no flourish.
          </p>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Duration Tokens</h3>
            <table className={styles.tokenTable}>
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Value</th>
                  <th>Use</th>
                </tr>
              </thead>
              <tbody>
                {MOTION_DURATIONS.map((d) => (
                  <tr key={d.token}>
                    <td>{d.token}</td>
                    <td>{d.value}</td>
                    <td>{d.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Easing Tokens</h3>
            <table className={styles.tokenTable}>
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Value</th>
                  <th>Use</th>
                </tr>
              </thead>
              <tbody>
                {MOTION_EASINGS.map((e) => (
                  <tr key={e.token}>
                    <td>{e.token}</td>
                    <td>{e.value}</td>
                    <td>{e.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            FOUNDATION: Z-Index & Breakpoints
            ════════════════════════════════════════════════════════════ */}
        <section id="zindex" className={styles.section}>
          <div className={styles.sectionCategory}>Foundation</div>
          <h2 className={styles.sectionTitle}>Z-Index & Breakpoints</h2>
          <p className={styles.sectionDesc}>
            Stacking order is explicit — never use arbitrary z-index values. Breakpoints are
            viewport-width only, never device type.
          </p>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Z-Index Stacking Order</h3>
            <table className={styles.tokenTable}>
              <thead>
                <tr>
                  <th>Z</th>
                  <th>Name</th>
                  <th>Use</th>
                </tr>
              </thead>
              <tbody>
                {ZINDEX_SCALE.map((z) => (
                  <tr key={z.z}>
                    <td>{z.z}</td>
                    <td>{z.name}</td>
                    <td>{z.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Breakpoints</h3>
            <table className={styles.tokenTable}>
              <thead>
                <tr>
                  <th>Width</th>
                  <th>Name</th>
                  <th>Use</th>
                </tr>
              </thead>
              <tbody>
                {BREAKPOINTS.map((bp) => (
                  <tr key={bp.value}>
                    <td>{bp.value}</td>
                    <td>{bp.name}</td>
                    <td>{bp.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            CONTROLS: Buttons
            ════════════════════════════════════════════════════════════ */}
        <section id="buttons" className={styles.section}>
          <div className={styles.sectionCategory}>Controls</div>
          <h2 className={styles.sectionTitle}>Buttons</h2>
          <p className={styles.sectionDesc}>
            All button variants and states. Hover to see interactive transitions.
          </p>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Primary (Green)</h3>
            <div className={styles.buttonRow}>
              <Button>Default</Button>
              <Button disabled>Disabled</Button>
              <Button loading>Loading</Button>
            </div>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Secondary</h3>
            <div className={styles.buttonRow}>
              <Button style="secondary">Secondary</Button>
              <Button style="secondary" disabled>Disabled</Button>
              <Button style="secondary" loading>Loading</Button>
            </div>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Danger</h3>
            <div className={styles.buttonRow}>
              <Button style="danger">Delete</Button>
              <Button style="danger" disabled>Disabled</Button>
              <Button style="danger" loading>Deleting</Button>
            </div>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Dark</h3>
            <div className={styles.buttonRow}>
              <Button style="dark">Dark</Button>
              <Button style="dark" outline>Dark Outline</Button>
              <Button style="dark" disabled>Disabled</Button>
            </div>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Light</h3>
            <div className={styles.darkSurface}>
              <Button style="light">Light</Button>
              <Button style="light" outline>Light Outline</Button>
              <Button style="light" disabled>Disabled</Button>
            </div>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Outline Variants</h3>
            <div className={styles.buttonRow}>
              <Button outline>Primary Outline</Button>
              <Button style="secondary" outline>Secondary Outline</Button>
              <Button style="danger" outline>Danger Outline</Button>
            </div>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Full Width</h3>
            <div style={{ maxWidth: 320 }}>
              <Button fullWidth marginBottom>Buy Now — full width</Button>
              <Button style="secondary" fullWidth>Make Offer</Button>
            </div>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Round</h3>
            <div className={styles.buttonRow}>
              <Button round>Round Primary</Button>
              <Button style="secondary" round>Round Secondary</Button>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            CONTROLS: Form Elements
            ════════════════════════════════════════════════════════════ */}
        <section id="forms" className={styles.section}>
          <div className={styles.sectionCategory}>Controls</div>
          <h2 className={styles.sectionTitle}>Form Elements</h2>
          <p className={styles.sectionDesc}>
            48px height, <code>--c-fill</code> background, 1px <code>--c-border</code>, 10px
            radius. Validation on blur. Focus: green border + white bg + shadow ring.
          </p>

          <FormDemo />
        </section>

        {/* ════════════════════════════════════════════════════════════
            CONTROLS: Toggles & Selectors
            ════════════════════════════════════════════════════════════ */}
        <section id="toggles" className={styles.section}>
          <div className={styles.sectionCategory}>Controls</div>
          <h2 className={styles.sectionTitle}>Toggles & Selectors</h2>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Toggle Switch</h3>
            <div className={styles.toggleRow}>
              <div className={styles.toggleItem}>
                <Toggle id="toggle-a" checked={toggleA} onChange={setToggleA} ariaLabel="Offers enabled" />
                <span className={styles.toggleLabel}>Offers enabled</span>
              </div>
              <div className={styles.toggleItem}>
                <Toggle id="toggle-b" checked={toggleB} onChange={setToggleB} ariaLabel="Free shipping" />
                <span className={styles.toggleLabel}>Free shipping</span>
              </div>
              <div className={styles.toggleItem}>
                <Toggle id="toggle-c" checked={toggleC} onChange={setToggleC} ariaLabel="Price drop alerts" />
                <span className={styles.toggleLabel}>Price drop alerts</span>
              </div>
              <div className={styles.toggleItem}>
                <Toggle id="toggle-disabled" checked={false} onChange={() => {}} disabled ariaLabel="Disabled toggle" />
                <span className={styles.toggleLabel}>Disabled</span>
              </div>
            </div>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Pill Selector</h3>
            <PillSelector
              label="Categories"
              options={[
                { value: 'rods', label: 'Rods' },
                { value: 'reels', label: 'Reels' },
                { value: 'lures', label: 'Lures & Baits' },
                { value: 'flies', label: 'Flies' },
                { value: 'tackle', label: 'Tackle' },
              ]}
              selected={selectedPills}
              onChange={setSelectedPills}
            />
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            CONTROLS: Dropdowns
            ════════════════════════════════════════════════════════════ */}
        <section id="dropdowns" className={styles.section}>
          <div className={styles.sectionCategory}>Controls</div>
          <h2 className={styles.sectionTitle}>Dropdowns</h2>
          <p className={styles.sectionDesc}>
            Composable dropdown menu with keyboard navigation (Arrow keys, Escape, Home/End).
          </p>

          <div className={styles.componentRow}>
            <Dropdown label="Actions" ariaLabel="Listing actions">
              <DropdownTitle>Listing</DropdownTitle>
              <DropdownItem>Edit listing</DropdownItem>
              <DropdownItem>Mark as sold</DropdownItem>
              <DropdownDivider />
              <DropdownItem>Delete listing</DropdownItem>
            </Dropdown>

            <Dropdown label="Sort by" ariaLabel="Sort listings">
              <DropdownItem>Newest first</DropdownItem>
              <DropdownItem>Price: Low to High</DropdownItem>
              <DropdownItem>Price: High to Low</DropdownItem>
              <DropdownItem>Most viewed</DropdownItem>
            </Dropdown>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            CONTROLS: Inline Edit
            ════════════════════════════════════════════════════════════ */}
        <section id="inline-edit" className={styles.section}>
          <div className={styles.sectionCategory}>Controls</div>
          <h2 className={styles.sectionTitle}>Inline Edit</h2>
          <p className={styles.sectionDesc}>
            Click-to-edit field with save/cancel actions and keyboard support (Enter, Escape).
          </p>

          <div className={styles.inlineEditDemo}>
            <InlineEdit
              value={editValue}
              onSave={async (v) => setEditValue(v)}
              placeholder="Enter listing title"
              ariaLabel="Listing title"
              maxLength={80}
            />
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            CONTROLS: Favorites
            ════════════════════════════════════════════════════════════ */}
        <section id="favorites" className={styles.section}>
          <div className={styles.sectionCategory}>Controls</div>
          <h2 className={styles.sectionTitle}>Favorites</h2>
          <p className={styles.sectionDesc}>Watchlist heart toggle. Click to toggle state.</p>

          <div className={styles.componentRow}>
            <div className={styles.componentItem}>
              <Favorite />
              <span className={styles.componentLabel}>Unfavorited</span>
            </div>
            <div className={styles.componentItem}>
              <Favorite initialFavorite />
              <span className={styles.componentLabel}>Favorited</span>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            INDICATORS: Pills & Badges
            ════════════════════════════════════════════════════════════ */}
        <section id="pills" className={styles.section}>
          <div className={styles.sectionCategory}>Indicators</div>
          <h2 className={styles.sectionTitle}>Pills & Badges</h2>
          <p className={styles.sectionDesc}>
            All pills: 999px radius. DM Sans Medium, uppercase, +0.05em tracking.
          </p>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Status Pills</h3>
            <div className={styles.pillRow}>
              <Pill color="primary">Active</Pill>
              <Pill color="warning">Pending Sale</Pill>
              <Pill color="success">Sold</Pill>
              <Pill color="secondary">Draft</Pill>
              <Pill color="error">Archived</Pill>
              <Pill>Default</Pill>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            INDICATORS: Condition Badges
            ════════════════════════════════════════════════════════════ */}
        <section id="conditions" className={styles.section}>
          <div className={styles.sectionCategory}>Indicators</div>
          <h2 className={styles.sectionTitle}>Condition Badges</h2>
          <p className={styles.sectionDesc}>
            6 tiers with WCAG AA colors. Hover/tap for description popover.
          </p>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Small (photo overlay)</h3>
            <div className={styles.pillRow}>
              <ConditionBadge condition="new_with_tags" size="sm" />
              <ConditionBadge condition="new_without_tags" size="sm" />
              <ConditionBadge condition="like_new" size="sm" />
              <ConditionBadge condition="good" size="sm" />
              <ConditionBadge condition="fair" size="sm" />
              <ConditionBadge condition="poor" size="sm" />
            </div>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Medium (condition section)</h3>
            <div className={styles.pillRow}>
              <ConditionBadge condition="new_with_tags" size="md" />
              <ConditionBadge condition="new_without_tags" size="md" />
              <ConditionBadge condition="like_new" size="md" />
              <ConditionBadge condition="good" size="md" />
              <ConditionBadge condition="fair" size="md" />
              <ConditionBadge condition="poor" size="md" />
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            INDICATORS: Toast Notifications
            ════════════════════════════════════════════════════════════ */}
        <section id="toasts" className={styles.section}>
          <div className={styles.sectionCategory}>Indicators</div>
          <h2 className={styles.sectionTitle}>Toast Notifications</h2>
          <p className={styles.sectionDesc}>
            Non-blocking. Top-center mobile, bottom-right desktop. Auto-dismiss 4s.
          </p>

          <div className={styles.buttonRow} style={{ marginBottom: 16 }}>
            <Button onClick={() => { setToastSuccess(true); setToastError(true); }}>
              Show Toasts
            </Button>
          </div>

          <Toast
            message="Listing published"
            description="Your Shimano reel is now live and searchable."
            type="success"
            visible={toastSuccess}
            onDismiss={() => setToastSuccess(false)}
            duration={60000}
          />
          <Toast
            message="Payment failed"
            description="Card was declined — check your details and try again."
            type="error"
            visible={toastError}
            onDismiss={() => setToastError(false)}
            duration={60000}
          />
        </section>

        {/* ════════════════════════════════════════════════════════════
            INDICATORS: Rating Display
            ════════════════════════════════════════════════════════════ */}
        <section id="reviews" className={styles.section}>
          <div className={styles.sectionCategory}>Indicators</div>
          <h2 className={styles.sectionTitle}>Rating Display</h2>
          <p className={styles.sectionDesc}>
            Stars in <code>--c-orange</code>. Empty stars in <code>--c-border</code>. Never show a
            rating for fewer than 3 completed transactions.
          </p>

          <div className={styles.componentRow}>
            <div className={styles.componentItem}>
              <Reviews count={124} average={4.9} />
              <span className={styles.componentLabel}>Standard</span>
            </div>
            <div className={styles.componentItem}>
              <Reviews count={48} average={5.0} />
              <span className={styles.componentLabel}>Perfect</span>
            </div>
            <div className={styles.componentItem}>
              <Reviews count={12} average={4.0} />
              <span className={styles.componentLabel}>Below avg</span>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            LAYOUT: Collapsible Card
            ════════════════════════════════════════════════════════════ */}
        <section id="collapsible" className={styles.section}>
          <div className={styles.sectionCategory}>Layout</div>
          <h2 className={styles.sectionTitle}>Collapsible Card</h2>
          <p className={styles.sectionDesc}>
            Expandable card with chevron toggle and CSS animation.
          </p>

          <div style={{ maxWidth: 480 }}>
            <CollapsibleCard title="Specs & Details" defaultExpanded>
              <table className={styles.tokenTable}>
                <tbody>
                  <tr><td>Gear Ratio</td><td>6.0:1</td></tr>
                  <tr><td>Weight</td><td>7.9 oz</td></tr>
                  <tr><td>Max Drag</td><td>20 lb</td></tr>
                  <tr><td>Line Cap</td><td>8/170 (Mono)</td></tr>
                  <tr><td>Ball Bearings</td><td>6+1</td></tr>
                </tbody>
              </table>
            </CollapsibleCard>

            <div style={{ marginTop: 12 }}>
              <CollapsibleCard title="Shipping & Returns">
                <p style={{ fontSize: 14, color: 'var(--c-text-2)' }}>
                  Ships within 2 business days. Buyer pays shipping. Returns accepted within 7 days
                  if item is not as described.
                </p>
              </CollapsibleCard>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            LAYOUT: Expandable Section
            ════════════════════════════════════════════════════════════ */}
        <section id="accordion" className={styles.section}>
          <div className={styles.sectionCategory}>Layout</div>
          <h2 className={styles.sectionTitle}>Expandable Section</h2>
          <p className={styles.sectionDesc}>
            Two modes: accordion (chevron toggle) and text truncation (&quot;Read more&quot;).
          </p>

          <div style={{ maxWidth: 480 }}>
            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>Accordion Mode</h3>
              <ExpandableSection title="Seller Policy" defaultExpanded={false}>
                <p style={{ fontSize: 14, color: 'var(--c-text-2)' }}>
                  All sales are final. Items are described honestly and photos show accurate
                  condition. If something arrives damaged in shipping, contact me within 48 hours
                  and I&apos;ll work it out.
                </p>
              </ExpandableSection>
            </div>

            <div className={styles.subsection}>
              <h3 className={styles.subsectionTitle}>Truncation Mode</h3>
              <ExpandableSection title="Description" maxCollapsedLines={3}>
                <p style={{ fontSize: 14, color: 'var(--c-text)' }}>
                  Used one season of light bass fishing on Lake Okeechobee. Mechanically flawless —
                  drag is silky smooth, bail snaps clean, no line roller issues. Minor cosmetic scuff
                  on the underside of the body from setting it on a dock — purely cosmetic and does
                  not affect function at all. Comes with the original box and spare spool. Great reel
                  for anyone who wants a Stradic without paying full retail. I&apos;m upgrading to the
                  Stella so this one needs a new home.
                </p>
              </ExpandableSection>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            LAYOUT: Dividers
            ════════════════════════════════════════════════════════════ */}
        <section id="dividers" className={styles.section}>
          <div className={styles.sectionCategory}>Layout</div>
          <h2 className={styles.sectionTitle}>Dividers</h2>
          <p className={styles.sectionDesc}>
            Horizontal divider with centered text label.
          </p>

          <div style={{ maxWidth: 480 }}>
            <Divider text="or" />
            <div style={{ marginTop: 16 }}>
              <Divider text="More from this seller" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
