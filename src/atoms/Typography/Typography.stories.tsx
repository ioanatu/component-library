import type { Meta, StoryObj } from '@storybook/react';
import { Display, Headline, Body, Label, Eyebrow, Caption, Code } from '.';

/**
 * OFFSET typography. Two families with strictly separated jobs: Hanken Grotesk
 * carries all human language, JetBrains Mono carries anything a machine
 * produced or a machine will read.
 *
 * Seven components cover every text node in the product. Each takes a numeric
 * `level` — the step already carries its own size, line height, tracking and
 * measure, so you pick one prop rather than four values.
 */
const meta: Meta = {
  title: 'Atoms/Typography',
  parameters: {
    docs: {
      description: {
        component:
          'Pick a step, never a size. Line height and tracking are part of the step; a one-off font-size with the wrong leading is the most common way this system degrades.',
      },
    },
  },
  args: {
    label: 'Click here',
  },
};

export default meta;

export const Scale: StoryObj = {
  name: 'The scale',
  render: () => (
    <div style={{ display: 'grid', gap: 32, maxWidth: 760 }}>
      <Display level={2}>Display</Display>
      <Headline level={1}>Page title</Headline>
      <Headline level={2}>Section heading</Headline>
      <Headline level={3}>Card &amp; dialog title</Headline>
      <Body level={1} tone="muted">
        Lead paragraph — the one sentence that explains the screen before anyone reads the rest of
        it.
      </Body>
      <Body level={2}>
        Body. The default for all running text; 1.7 line height and a 72-character measure keep long
        passages readable at this weight.
      </Body>
      <Body level={3} tone="muted">
        Small — helper text, table cells, card body, captions. The floor for any sentence a user
        must read.
      </Body>
      <Eyebrow>Eyebrow &amp; code label</Eyebrow>
    </div>
  ),
};

export const Families: StoryObj = {
  name: 'Every family',
  render: () => (
    <div style={{ display: 'grid', gap: 40, maxWidth: 760 }}>
      <section>
        <Eyebrow level={2} style={{ marginBottom: 8 }}>
          Display · levels 1–2
        </Eyebrow>
        <Display level={1}>Fluid hero</Display>
        <Display level={2} as="p">
          Fixed 56
        </Display>
      </section>

      <section>
        <Eyebrow level={2} style={{ marginBottom: 8 }}>
          Headline · levels 1–3
        </Eyebrow>
        <Headline level={2} ruled>
          Ruled section heading
        </Headline>
      </section>

      <section>
        <Eyebrow level={2} style={{ marginBottom: 8 }}>
          Body · mono and clamping
        </Eyebrow>
        <Body level={2}>
          Request{' '}
          <Body as="span" mono>
            req_8f2a91
          </Body>{' '}
          completed in 240ms.
        </Body>
        <Body level={3} lines={2} style={{ marginTop: 12 }}>
          Clamped to two lines. Anything past the second line is hidden, which is only acceptable
          where the full text is reachable some other way — a tooltip, a detail view, an expand
          control.
        </Body>
      </section>

      <section>
        <Eyebrow level={2} style={{ marginBottom: 8 }}>
          Label &amp; Caption
        </Eyebrow>
        <Label htmlFor="story-card" required>
          Card number
        </Label>
        <input
          id="story-card"
          style={{ font: 'inherit', padding: '10px 12px', border: '2px solid var(--ink)' }}
        />
        <Caption level={1} style={{ marginTop: 8 }}>
          We never store the full number.
        </Caption>
        <Caption level={1} error style={{ marginTop: 8 }}>
          Enter a valid card number.
        </Caption>
      </section>

      <section>
        <Eyebrow level={2} style={{ marginBottom: 8 }}>
          Code
        </Eyebrow>
        <Body level={2}>
          Import from <Code>src/atoms/Typography</Code> — the barrel is the only public entry.
        </Body>
        <Code block level={1} style={{ marginTop: 12 }}>
          {`import { Headline, Body } from '@/atoms/Typography';

<Headline level={1}>Billing</Headline>
<Body level={1} tone="muted">Manage your plan and payment method.</Body>`}
        </Code>
      </section>
    </div>
  ),
};

export const Tones: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
      {(['default', 'muted', 'subtle', 'danger', 'success', 'warning', 'accent'] as const).map(
        (tone) => (
          <Body key={tone} level={2} tone={tone}>
            {tone} — full-opacity ink, so contrast holds on any surface.
          </Body>
        ),
      )}
    </div>
  ),
};
