import type { Meta, StoryObj } from '@storybook/react-vite';
import { Body, Caption, Code, Display, Eyebrow, Headline, Label } from '.';
import Input from '../../Input/Input';

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
      <Headline level={4}>Subsection title</Headline>
      <Headline level={5}>Dense card title</Headline>
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 32,
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
      }}
    >
      <div style={{ width: 600 }}>
        <section style={{ marginBottom: 60 }}>
          <Eyebrow level={2} style={{ marginBottom: 8 }}>
            Display · levels 1–2
          </Eyebrow>
          <Display level={1}>Fluid hero</Display>
          <Display level={2} as="p">
            Fixed 56
          </Display>
        </section>

        <section style={{ marginBottom: 60 }}>
          <Eyebrow level={2} style={{ marginBottom: 8 }}>
            Headline · levels 1–5
          </Eyebrow>
          <Headline level={1}>Section heading</Headline>
          <Headline level={2}>Section heading</Headline>
          <Headline level={3}>Section heading</Headline>
          <Headline level={4}>Section heading</Headline>
          <Headline level={5}>Section heading</Headline>
        </section>

        <section style={{ marginBottom: 60 }}>
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
          <Eyebrow level={2} style={{ marginTop: 40 }}>
            Body · level 1-3
          </Eyebrow>
          <Body level={1} style={{ marginTop: 12 }}>
            Body level 1
          </Body>
          <Body level={2}>Body level 2</Body>
          <Body level={3}>Body level 3</Body>
        </section>
      </div>

      <div style={{ width: 600 }}>
        <section style={{ marginBottom: 60 }}>
          <Eyebrow level={2} style={{ marginBottom: 8 }}>
            Label &amp; Caption
          </Eyebrow>
          <Label htmlFor="story-card" required>
            Card number
          </Label>
          <div style={{ width: 300 }}>
            <Input id="story-card" label={''} />
          </div>
          <Caption level={1} style={{ marginTop: 8 }}>
            We never store the full number.
          </Caption>
          <Caption level={1} error>
            Enter a valid card number.
          </Caption>
        </section>

        <section style={{ marginBottom: 60 }}>
          <Eyebrow level={2} style={{ marginBottom: 8 }}>
            Code
          </Eyebrow>
          <Body level={2}>
            Import from <Code level={2}>src/atoms/Typography</Code> — the barrel is the only public
            entry.
          </Body>
          <Code block level={1} style={{ marginTop: 12 }}>
            {`// Code level 1
import { Headline, Body } from '@/atoms/Typography';

<Headline level={1}>Billing</Headline>`}
          </Code>
          <Code block level={2} style={{ marginTop: 12 }}>
            {`// Code level 2
import { Headline, Body } from '@/atoms/Typography';

<Headline level={1}>Billing</Headline>`}
          </Code>
        </section>

        <section style={{ marginBottom: 60 }}>
          <Eyebrow level={2} style={{ marginBottom: 18 }}>
            Eyebrow levels & code
          </Eyebrow>
          <Eyebrow level={1} style={{ marginBottom: 4 }}>
            Eyebrow level one
          </Eyebrow>
          <Eyebrow level={2} style={{ marginBottom: 8 }}>
            Eyebrow level two
          </Eyebrow>
          <br />
          <Code level={1}>src/atoms/Typography</Code>
          <br />
          <br />
          <Code level={2}>src/atoms/Typography</Code>
        </section>
      </div>
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
