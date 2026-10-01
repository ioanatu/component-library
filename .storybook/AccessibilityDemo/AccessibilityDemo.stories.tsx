import type { Meta, StoryObj } from '@storybook/react-vite';
import { type SubmitEvent, useEffect, useRef, useState } from 'react';
import {
  Alert,
  ButtonNew,
  Card,
  Checkbox,
  CheckboxGroup,
  Input,
  Radio,
  RadioGroup,
  Select,
  Table,
  TextArea,
} from '../../src';
import { Body, Code, Eyebrow, Headline } from '../../src/Typography';

const DOCUMENTS = [
  { value: 'council-tax', label: 'Council tax bill' },
  { value: 'planning', label: 'Planning application' },
  { value: 'library', label: 'Library membership terms' },
  { value: 'bins', label: 'Bin collection calendar' },
];

const FORMATS = [
  { value: 'large-print', label: 'Large print' },
  { value: 'braille', label: 'Braille' },
  { value: 'audio', label: 'Audio recording' },
  { value: 'easy-read', label: 'Easy read' },
];

const CONTACTS = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'post', label: 'Post' },
];

const ID = {
  name: 'a11y-name',
  email: 'a11y-email',
  phone: 'a11y-phone',
  document: 'a11y-document',
  format: 'a11y-format',
  details: 'a11y-details',
  consent: 'a11y-consent',
};

/* What takes focus when a field has an error, in reading order. */
const TARGET: Record<Field, string> = {
  name: ID.name,
  email: ID.email,
  phone: ID.phone,
  document: `${ID.document}-trigger`,
  format: `${ID.format}-${FORMATS[0].value}`,
  consent: ID.consent,
};

interface Values {
  name: string;
  email: string;
  phone: string;
  document: string | null;
  format: string | null;
  details: string;
  contact: string[];
  consent: boolean;
}

type Field = 'name' | 'email' | 'phone' | 'document' | 'format' | 'consent';
type Errors = Partial<Record<Field, string>>;

const EMPTY: Values = {
  name: '',
  email: '',
  phone: '',
  document: null,
  format: null,
  details: '',
  contact: [],
  consent: false,
};

const validate = (values: Values): Errors => {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = 'Enter your full name.';
  if (!values.email.trim()) errors.email = 'Enter your email address.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = 'Enter an email address in the correct format, like name@example.com.';
  if (values.contact.includes('phone') && !values.phone.trim())
    errors.phone = 'Enter a phone number, or untick Phone under how we contact you.';
  if (!values.document) errors.document = 'Choose the document you need.';
  if (!values.format) errors.format = 'Choose a format.';
  if (!values.consent) errors.consent = 'Confirm that we can use your details for this request.';
  return errors;
};

const labelOf = (list: { value: string; label: string }[], value: string | null) =>
  list.find((item) => item.value === value)?.label ?? '';

function AccessibleForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [stage, setStage] = useState<'form' | 'review' | 'sent'>('form');
  const formHeadingRef = useRef<HTMLHeadingElement>(null);
  const reviewHeadingRef = useRef<HTMLHeadingElement>(null);
  const sentRef = useRef<HTMLDivElement>(null);
  const moved = useRef(false);

  useEffect(() => {
    if (!moved.current) return;
    if (stage === 'review') reviewHeadingRef.current?.focus();
    else if (stage === 'sent') sentRef.current?.focus();
    else formHeadingRef.current?.focus();
  }, [stage]);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[key as Field];
      return next;
    });
  };

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    moved.current = true;
    const first = (Object.keys(TARGET) as Field[]).find((field) => found[field]);
    if (first) document.getElementById(TARGET[first])?.focus();
    else setStage('review');
  };

  const toggleContact = (value: string, checked: boolean) =>
    set(
      'contact',
      checked ? [...values.contact, value] : values.contact.filter((item) => item !== value),
    );

  const reset = () => {
    setValues(EMPTY);
    setStage('form');
  };

  if (stage === 'sent')
    return (
      <Alert ref={sentRef} tone="success" title="Request sent" headingLevel={2} tabIndex={-1}>
        <Body level={2} unbounded>
          We will send the {labelOf(DOCUMENTS, values.document).toLowerCase()} in{' '}
          {labelOf(FORMATS, values.format).toLowerCase()} within 5 working days. A confirmation is
          on its way to {values.email}.
        </Body>
        <div>
          <ButtonNew variant="secondary" onClick={reset}>
            Make another request
          </ButtonNew>
        </div>
      </Alert>
    );

  if (stage === 'review')
    return (
      <div style={{ display: 'grid', gap: 24 }}>
        <div style={{ display: 'grid', gap: 8 }}>
          <Headline ref={reviewHeadingRef} level={2} tabIndex={-1}>
            Check your answers
          </Headline>
          <Body level={2} tone="muted">
            Nothing is sent until you choose Send request.
          </Body>
        </div>

        <Table<[string, string]>
          caption="Your request"
          hideColumnHeaders
          zebra={false}
          minWidth={0}
          rowHeader="question"
          rowKey={([question]) => question}
          columns={[
            {
              key: 'question',
              label: 'Question',
              width: '40%',
              cell: ([question]) => (
                <Body as="span" level={2} weight="medium" unbounded>
                  {question}
                </Body>
              ),
            },
            {
              key: 'answer',
              label: 'Answer',
              width: '60%',
              cell: ([, answer]) => (
                <Body as="span" level={2} unbounded>
                  {answer}
                </Body>
              ),
            },
          ]}
          rows={[
            ['Full name', values.name],
            ['Email address', values.email],
            ['Phone number', values.phone || 'Not given'],
            ['Document', labelOf(DOCUMENTS, values.document)],
            ['Format', labelOf(FORMATS, values.format)],
            ['Anything else', values.details || 'Nothing added'],
            [
              'How we contact you',
              ['email', ...values.contact].map((value) => labelOf(CONTACTS, value)).join(', '),
            ],
          ]}
        />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          <ButtonNew onClick={() => setStage('sent')}>Send request</ButtonNew>
          <ButtonNew variant="secondary" onClick={() => setStage('form')}>
            Change answers
          </ButtonNew>
        </div>
      </div>
    );

  return (
    <form noValidate onSubmit={submit} style={{ display: 'grid', gap: 32 }}>
      <div style={{ display: 'grid', gap: 8 }}>
        <Headline ref={formHeadingRef} level={2} tabIndex={-1}>
          Request a document in another format
        </Headline>
        <Body level={2} tone="muted">
          Fields marked with an asterisk (*) are required.
        </Body>
      </div>

      <section style={{ display: 'grid', gap: 20 }} aria-labelledby="a11y-about">
        <Headline id="a11y-about" level={3}>
          About you
        </Headline>
        <Input
          id={ID.name}
          label="Full name"
          name="name"
          autoComplete="name"
          required
          fullWidth
          value={values.name}
          error={errors.name}
          onChange={(event) => set('name', event.target.value)}
        />
        <Input
          id={ID.email}
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          spellCheck={false}
          required
          fullWidth
          helper="We send the confirmation here."
          value={values.email}
          error={errors.email}
          onChange={(event) => set('email', event.target.value)}
        />
        <Input
          id={ID.phone}
          label="Phone number"
          name="phone"
          type="tel"
          autoComplete="tel"
          optional
          fullWidth
          helper="Only needed if you would like a call."
          value={values.phone}
          error={errors.phone}
          onChange={(event) => set('phone', event.target.value)}
        />
      </section>

      <section style={{ display: 'grid', gap: 20 }} aria-labelledby="a11y-request">
        <Headline id="a11y-request" level={3}>
          Your request
        </Headline>
        <Select
          id={ID.document}
          label="Document"
          name="document"
          placeholder="Choose a document"
          options={DOCUMENTS}
          required
          fullWidth
          value={values.document}
          error={errors.document}
          onChange={(value) => set('document', value)}
        />
        <RadioGroup
          label="Format"
          name="format"
          required
          value={values.format}
          error={errors.format}
          onChange={(value) => set('format', value)}
        >
          {FORMATS.map((format) => (
            <Radio
              key={format.value}
              id={`${ID.format}-${format.value}`}
              value={format.value}
              label={format.label}
            />
          ))}
        </RadioGroup>
        <TextArea
          id={ID.details}
          label="Anything else we should know"
          name="details"
          optional
          fullWidth
          maxLength={500}
          showCount
          helper="For example, a braille grade or a preferred audio speed."
          value={values.details}
          onChange={(event) => set('details', event.target.value)}
        />
      </section>

      <section style={{ display: 'grid', gap: 20 }} aria-labelledby="a11y-contact">
        <Headline id="a11y-contact" level={3}>
          How we contact you
        </Headline>
        <CheckboxGroup
          label="Other ways we may contact you"
          name="contact"
          helper="We always email. Choose any others you are happy with."
        >
          {CONTACTS.filter((contact) => contact.value !== 'email').map((contact) => (
            <Checkbox
              key={contact.value}
              value={contact.value}
              label={contact.label}
              checked={values.contact.includes(contact.value)}
              onChange={(event) => toggleContact(contact.value, event.target.checked)}
            />
          ))}
        </CheckboxGroup>
        <Checkbox
          id={ID.consent}
          name="consent"
          label="You can use my details to handle this request"
          required
          checked={values.consent}
          error={errors.consent}
          onChange={(event) => set('consent', event.target.checked)}
        />
      </section>

      <div>
        <ButtonNew type="submit">Review request</ButtonNew>
      </div>
    </form>
  );
}

function DemoPage() {
  return (
    <div
      data-targets="large"
      lang="en"
      style={{ minHeight: '100vh', padding: '48px 16px', background: 'var(--page)' }}
    >
      <main style={{ display: 'grid', gap: 40, maxWidth: '72ch', margin: '0 auto' }}>
        <header style={{ display: 'grid', gap: 12 }}>
          <Eyebrow>About</Eyebrow>
          <Headline level={1}>Accessibility demo</Headline>
          <Body level={1} tone="muted">
            A form built only from this library, meeting WCAG 2.2 AAA except enhanced contrast.
          </Body>
        </header>

        <Card elevation="md" padding="lg">
          <AccessibleForm />
        </Card>

        <section style={{ display: 'grid', gap: 12 }} aria-labelledby="a11y-why">
          <Headline id="a11y-why" level={2}>
            Why it is accessible
          </Headline>
          <Body as="ul" level={2} style={{ display: 'grid', gap: 8, paddingInlineStart: 20 }}>
            <li>
              <strong>Labels:</strong> every field has a visible label tied to it in code. Required
              fields carry an asterisk and the <Code level={2}>required</Code> state, not colour
              alone.
            </li>
            <li>
              <strong>Contrast:</strong> all text meets AA (4.5:1). Body text reaches AAA's 7:1;
              hints, error text and the blue button do not.
            </li>
            <li>
              <strong>Targets:</strong> every control is at least 44 × 44px.
            </li>
            <li>
              <strong>Errors:</strong> on submit, focus moves to the first field with a problem.
              Each message says how to fix it and is linked to its field.
            </li>
            <li>
              <strong>Error prevention:</strong> answers are checked on a review step before
              anything is sent, and can be changed.
            </li>
            <li>
              <strong>Help:</strong> hints explain formats and why a detail is asked.
            </li>
            <li>
              <strong>Structure:</strong> headings, fieldsets with legends, one column, lines under
              80 characters, autocomplete on personal details, no time limits, and motion that
              respects reduced-motion settings.
            </li>
          </Body>
        </section>

        <section style={{ display: 'grid', gap: 12 }} aria-labelledby="a11y-test">
          <Headline id="a11y-test" level={2}>
            Test it yourself
          </Headline>
          <Body as="ol" level={2} style={{ display: 'grid', gap: 8, paddingInlineStart: 20 }}>
            <li>
              <strong>Keyboard:</strong> put the mouse away. Tab and Shift+Tab move between fields,
              Space ticks a box, arrow keys choose a format, Enter submits. Focus should always be
              visible and follow the reading order.
            </li>
            <li>
              <strong>Errors:</strong> submit the empty form. Focus moves to the first field with an
              error, and each error is read with its field.
            </li>
            <li>
              <strong>Screen reader:</strong> turn on VoiceOver (Cmd+F5 on macOS) or NVDA (Windows).
              Each field should read its label, required state, hint and any error.
            </li>
            <li>
              <strong>Automated:</strong> open the Accessibility tab in the addons panel. This page
              runs axe with the AAA rules switched on; expect only enhanced-contrast findings.
            </li>
            <li>
              <strong>Zoom:</strong> zoom to 400%. Content should reflow into one column with no
              sideways scrolling.
            </li>
            <li>
              <strong>Colour:</strong> pick a filter from the vision simulator in the toolbar.
              Errors and states should still be clear from their icons and text.
            </li>
          </Body>
          <Body level={3} tone="muted">
            Automated tools find only part of the issues. The manual checks cover the rest.
          </Body>
        </section>
      </main>
    </div>
  );
}

const meta: Meta = {
  title: 'ABOUT/Accessibility Demo',
  component: DemoPage,
  parameters: {
    layout: 'fullscreen',
    a11y: {
      options: {
        runOnly: {
          type: 'tag',
          values: [
            'wcag2a',
            'wcag2aa',
            'wcag2aaa',
            'wcag21a',
            'wcag21aa',
            'wcag22aa',
            'best-practice',
          ],
        },
      },
    },
  },
};

export default meta;

export const AccessibilityDemo: StoryObj = {};
