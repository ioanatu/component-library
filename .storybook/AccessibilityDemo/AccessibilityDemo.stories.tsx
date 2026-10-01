import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  createContext,
  type CSSProperties,
  type ReactNode,
  type SubmitEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  ButtonNew,
  Card,
  Checkbox,
  CheckboxGroup,
  Combobox,
  type ComboboxOption,
  Input,
  Radio,
  RadioGroup,
  Select,
  Table,
  TextArea,
  Toggle,
} from '../../src';
import { Body, Code, Eyebrow, Headline } from '../../src/Typography';
import {
  type Address,
  type AddressOption,
  addressSearchEnabled,
  searchAddresses,
} from './addressSearch';

const SALUTATIONS = [
  { value: 'mr', label: 'Mr' },
  { value: 'mrs', label: 'Mrs' },
  { value: 'miss', label: 'Miss' },
  { value: 'ms', label: 'Ms' },
  { value: 'mx', label: 'Mx' },
  { value: 'dr', label: 'Dr' },
  { value: 'none', label: 'Prefer not to say' },
];

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

interface Values extends Address {
  salutation: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  document: string | null;
  format: string | null;
  details: string;
  contact: string[];
  consent: boolean;
}

const EMPTY: Values = {
  salutation: null,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  postcode: '',
  country: '',
  document: null,
  format: null,
  details: '',
  contact: [],
  consent: false,
};

const required = (key: keyof Values, message: string) => (values: Values) =>
  String(values[key] ?? '').trim() ? undefined : message;

/* In reading order: the first failing rule is where focus goes on submit. */
const RULES = {
  firstName: required('firstName', 'Enter your first name.'),
  lastName: required('lastName', 'Enter your last name.'),
  email: (values: Values) => {
    const email = values.email.trim();
    if (!email) return 'Enter your email address.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return 'Enter an email address in the correct format, like name@example.com.';
  },
  phone: (values: Values) => {
    const phone = values.phone.trim();
    if (!phone)
      return values.contact.includes('phone')
        ? 'Enter a phone number, or untick Phone under how we contact you.'
        : undefined;
    if (!/^\+?[\d\s()-]{7,}$/.test(phone))
      return 'Enter a phone number using digits, spaces and an optional +, like +44 20 7946 0958.';
  },
  line1: required('line1', 'Enter the first line of your address.'),
  city: required('city', 'Enter your town or city.'),
  postcode: required('postcode', 'Enter your postcode.'),
  country: required('country', 'Enter your country.'),
  document: required('document', 'Choose the document you need.'),
  format: required('format', 'Choose a format.'),
  consent: (values: Values) =>
    values.consent ? undefined : 'Confirm that we can use your details for this request.',
};

type Field = keyof typeof RULES;
type Errors = Partial<Record<Field, string>>;
const FIELDS = Object.keys(RULES) as Field[];

const validate = (values: Values): Errors =>
  Object.fromEntries(
    FIELDS.map((field) => [field, RULES[field](values)]).filter(([, message]) => message),
  );

const ID = {
  salutation: 'a11y-salutation',
  lookup: 'a11y-lookup',
  line2: 'a11y-line2',
  details: 'a11y-details',
};

const TARGET: Record<Field, string> = {
  firstName: 'a11y-firstName',
  lastName: 'a11y-lastName',
  email: 'a11y-email',
  phone: 'a11y-phone',
  line1: 'a11y-line1',
  city: 'a11y-city',
  postcode: 'a11y-postcode',
  country: 'a11y-country',
  document: 'a11y-document-trigger',
  format: `a11y-format-${FORMATS[0].value}`,
  consent: 'a11y-consent',
};

/* Two fields side by side, wrapping to one column when narrow so 400% zoom still reflows. */
const ROW: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 14rem), 1fr))',
  gap: 20,
  alignItems: 'start',
};

const labelOf = (list: { value: string; label: string }[], value: string | null) =>
  list.find((item) => item.value === value)?.label ?? '';

const NotesContext = createContext(false);

function Note({ criterion, children }: { criterion: string; children: ReactNode }) {
  if (!useContext(NotesContext)) return null;
  return (
    <Alert tone="info" title={criterion}>
      <Body level={3} unbounded>
        {children}
      </Body>
    </Alert>
  );
}

function AccessibleForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [stage, setStage] = useState<'form' | 'review' | 'sent'>('form');
  const formHeadingRef = useRef<HTMLHeadingElement>(null);
  const reviewHeadingRef = useRef<HTMLHeadingElement>(null);
  const sentRef = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  const [edited, setEdited] = useState<ReadonlySet<keyof Values>>(new Set());

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AddressOption[]>([]);
  const [searching, setSearching] = useState(false);
  const [lookupFailed, setLookupFailed] = useState(false);
  const [filled, setFilled] = useState(false);
  const skipSearch = useRef(false);

  useEffect(() => {
    if (!moved.current) return;
    if (stage === 'review') reviewHeadingRef.current?.focus();
    else if (stage === 'sent') sentRef.current?.focus();
    else formHeadingRef.current?.focus();
  }, [stage]);

  useEffect(() => {
    if (skipSearch.current) {
      skipSearch.current = false;
      return;
    }
    if (!addressSearchEnabled || query.trim().length < 3) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      searchAddresses(query, controller.signal)
        .then((options) => {
          setSuggestions(options);
          setLookupFailed(false);
        })
        .catch((error: Error) => {
          if (error.name === 'AbortError') return;
          setSuggestions([]);
          setLookupFailed(true);
        })
        .finally(() => {
          if (!controller.signal.aborted) setSearching(false);
        });
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  /* Clears any error the change has fixed, but never adds one while typing. */
  const apply = (next: Values) => {
    setValues(next);
    setErrors((current) => {
      const out = { ...current };
      for (const field of Object.keys(current) as Field[])
        if (!RULES[field](next)) delete out[field];
      return out;
    });
  };

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setEdited((current) => new Set(current).add(key));
    apply({ ...values, [key]: value });
  };

  const blur = (field: Field) => () => {
    if (!edited.has(field)) return;
    const message = RULES[field](values);
    setErrors((current) => {
      const out = { ...current };
      if (message) out[field] = message;
      else delete out[field];
      return out;
    });
  };

  const changeQuery = (text: string) => {
    setQuery(text);
    setFilled(false);
    const searchable = addressSearchEnabled && text.trim().length >= 3;
    setSearching(searchable);
    if (!searchable) setSuggestions([]);
  };

  const pickAddress = (option: ComboboxOption) => {
    const picked = suggestions.find((suggestion) => suggestion.value === option.value);
    if (!picked) return;
    skipSearch.current = true;
    setQuery([picked.label, picked.description].filter(Boolean).join(', '));
    setSuggestions([]);
    setEdited(
      (current) => new Set([...current, ...(Object.keys(picked.address) as (keyof Address)[])]),
    );
    apply({ ...values, ...picked.address });
    setFilled(true);
  };

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    moved.current = true;
    const first = FIELDS.find((field) => found[field]);
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
    setQuery('');
    setFilled(false);
    setEdited(new Set());
    setStage('form');
  };

  const textField = (field: Field & keyof Values) => ({
    id: TARGET[field],
    name: field,
    fullWidth: true,
    value: values[field] as string,
    error: errors[field],
    onChange: (event: { target: { value: string } }) => set(field, event.target.value),
    onBlur: blur(field),
  });

  if (stage === 'sent')
    return (
      <div style={{ display: 'grid', gap: 20 }}>
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
        <Note criterion="WCAG 4.1.3 Status messages">
          Focus moves to the confirmation, so it is read out straight away.
        </Note>
      </div>
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
            [
              'Name',
              [
                values.salutation === 'none' ? '' : labelOf(SALUTATIONS, values.salutation),
                values.firstName,
                values.lastName,
              ]
                .filter(Boolean)
                .join(' '),
            ],
            ['Email address', values.email],
            ['Phone number', values.phone || 'Not given'],
            [
              'Address',
              [values.line1, values.line2, values.city, values.postcode, values.country]
                .filter(Boolean)
                .join(', '),
            ],
            ['Document', labelOf(DOCUMENTS, values.document)],
            ['Format', labelOf(FORMATS, values.format)],
            ['Anything else', values.details || 'Nothing added'],
            [
              'How we contact you',
              ['email', ...values.contact].map((value) => labelOf(CONTACTS, value)).join(', '),
            ],
          ]}
        />

        <Note criterion="WCAG 3.3.6 Error prevention (all)">
          Every answer is shown back before anything is sent, and each one can still be changed.
        </Note>

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

      <Note criterion="WCAG 3.3.2 Labels or instructions">
        Every field has a visible label tied to it in code. Required fields show an asterisk and
        carry the required state, so it is never shown by colour alone.
      </Note>
      <Note criterion="WCAG 2.4.13 Focus appearance">
        Every control shows a 3px ring when it has keyboard focus.
      </Note>

      <section style={{ display: 'grid', gap: 20 }} aria-labelledby="a11y-about">
        <Headline id="a11y-about" level={3}>
          About you
        </Headline>
        <Select
          id={ID.salutation}
          label="Title"
          name="salutation"
          placeholder="Choose a title"
          optional
          options={SALUTATIONS}
          value={values.salutation}
          onChange={(value) => set('salutation', value)}
        />
        <div style={ROW}>
          <Input
            {...textField('firstName')}
            label="First name"
            autoComplete="given-name"
            required
          />
          <Input {...textField('lastName')} label="Last name" autoComplete="family-name" required />
        </div>
        <Input
          {...textField('email')}
          label="Email address"
          type="email"
          autoComplete="email"
          spellCheck={false}
          required
          helper="We send the confirmation here."
        />
        <Input
          {...textField('phone')}
          label="Phone number"
          type="tel"
          autoComplete="tel"
          optional
          helper="Only needed if you would like a call."
        />
        <Note criterion="WCAG 1.3.5 Identify input purpose">
          Personal fields carry autocomplete tokens such as <Code level={2}>given-name</Code> and{' '}
          <Code level={2}>email</Code>, so browsers can fill them in and assistive tech can tell
          what they are for.
        </Note>
        <Note criterion="WCAG 3.3.1 and 3.3.3 Error identification and suggestion">
          A field is checked when you leave it after typing, and again on submit. Each message says
          how to fix the problem and is read out with its field.
        </Note>
      </section>

      <section style={{ display: 'grid', gap: 20 }} aria-labelledby="a11y-address">
        <Headline id="a11y-address" level={3}>
          Your address
        </Headline>
        {addressSearchEnabled ? (
          <>
            <Combobox
              id={ID.lookup}
              label="Find your address"
              optional
              fullWidth
              minChars={3}
              inputValue={query}
              onInputChange={changeQuery}
              options={suggestions}
              onSelect={pickAddress}
              loading={searching}
              loadingLabel="Searching for addresses"
              emptyMessage="No addresses found. Try your postcode, or fill in the fields below."
              resultsLabel={(count) =>
                `${count} ${count === 1 ? 'address' : 'addresses'} found. Use the arrow keys to choose.`
              }
              helper={
                lookupFailed
                  ? 'Address search is not working right now. Fill in the fields below.'
                  : 'Type your street and house number, then choose from the list.'
              }
            />
            <div role="status">
              {filled ? (
                <Alert tone="success" title="Address added">
                  <Body level={3} unbounded>
                    Check the fields below and change anything that is wrong.
                  </Body>
                </Alert>
              ) : null}
            </div>
            <Note criterion="WCAG 4.1.2 Name, role, value">
              Address search is a combobox: arrow keys move through the results, Enter picks one,
              Escape closes the list, and the number of results is read out. The fields below always
              work without it.
            </Note>
          </>
        ) : (
          <Body level={3} tone="muted">
            Address search is off: no Amazon Location API key is set. Fill in the fields below.
          </Body>
        )}
        <Input
          {...textField('line1')}
          label="Address line 1"
          autoComplete="address-line1"
          required
        />
        <Input
          id={ID.line2}
          name="line2"
          label="Address line 2"
          autoComplete="address-line2"
          optional
          fullWidth
          value={values.line2}
          onChange={(event) => set('line2', event.target.value)}
        />
        <div style={ROW}>
          <Input
            {...textField('city')}
            label="Town or city"
            autoComplete="address-level2"
            required
          />
          <Input
            {...textField('postcode')}
            label="Postcode"
            autoComplete="postal-code"
            spellCheck={false}
            required
          />
        </div>
        <Input {...textField('country')} label="Country" autoComplete="country-name" required />
      </section>

      <section style={{ display: 'grid', gap: 20 }} aria-labelledby="a11y-request">
        <Headline id="a11y-request" level={3}>
          Your request
        </Headline>
        <Select
          id="a11y-document"
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
              id={`a11y-format-${format.value}`}
              value={format.value}
              label={format.label}
            />
          ))}
        </RadioGroup>
        <Note criterion="WCAG 1.3.1 Info and relationships">
          Related options sit in a fieldset with a legend, so each option is read with its question.
        </Note>
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
        <Note criterion="WCAG 3.3.5 Help">
          Hints explain the format and why a detail is asked, before anyone has to guess.
        </Note>
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
          id={TARGET.consent}
          name="consent"
          label="You can use my details to handle this request"
          required
          checked={values.consent}
          error={errors.consent}
          onChange={(event) => set('consent', event.target.checked)}
        />
        <Note criterion="WCAG 2.5.5 Target size (enhanced)">
          Every checkbox, radio and button is at least 44 by 44 pixels.
        </Note>
      </section>

      <div>
        <ButtonNew type="submit">Review request</ButtonNew>
      </div>
    </form>
  );
}

function DemoPage() {
  const [notes, setNotes] = useState(false);

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
          <Toggle
            label="Show accessibility notes"
            helper="Adds a note beside each feature, naming the WCAG criterion it meets."
            checked={notes}
            onChange={(event) => setNotes(event.target.checked)}
          />
        </header>

        <NotesContext.Provider value={notes}>
          <Note criterion="WCAG 1.4.3 Contrast (minimum)">
            All text meets 4.5:1. Body text also reaches the AAA level of 7:1; hints, error text and
            the blue button do not.
          </Note>
          <Card elevation="md" padding="lg">
            <AccessibleForm />
          </Card>
        </NotesContext.Provider>

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
              <strong>Errors:</strong> type a wrong email and press Tab; the message appears and is
              read out. Then submit the empty form: focus moves to the first field with an error.
            </li>
            <li>
              <strong>Address search:</strong> type three letters of a street. The number of results
              is read out; arrow keys and Enter pick one and fill in the fields.
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
