import type { ComboboxOption } from '../../src';

/* Amazon Location Service, Places API v2: https://docs.aws.amazon.com/location/latest/APIReference/API_geoplaces_Autocomplete.html */
const KEY: string | undefined = import.meta.env.STORYBOOK_AWS_LOCATION_API_KEY;
const REGION: string | undefined = import.meta.env.STORYBOOK_AWS_REGION;

export const addressSearchEnabled = Boolean(KEY && REGION);

export interface Address {
  line1: string;
  line2: string;
  city: string;
  postcode: string;
  country: string;
}

export interface AddressOption extends ComboboxOption {
  address: Address;
}

interface AmazonAddress {
  Label?: string;
  Country?: { Name?: string };
  Region?: { Name?: string };
  SubRegion?: { Name?: string };
  Locality?: string;
  PostalCode?: string;
  Street?: string;
}

/* "Core" returns the address parts with each result, so no second request is needed. */
export const searchAddresses = async (
  text: string,
  signal: AbortSignal,
): Promise<AddressOption[]> => {
  const response = await fetch(
    `https://places.geo.${REGION}.amazonaws.com/v2/autocomplete?key=${encodeURIComponent(KEY ?? '')}`,
    {
      method: 'POST',
      signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        QueryText: text,
        MaxResults: 5,
        Language: 'en',
        AdditionalFeatures: ['Core'],
      }),
    },
  );
  if (!response.ok) throw new Error(`Amazon Location ${response.status}`);
  const data: { ResultItems?: { PlaceId: string; Address?: AmazonAddress }[] } =
    await response.json();

  return (data.ResultItems ?? []).map(({ PlaceId, Address: address = {} }) => {
    /* The label puts the house number where the locale expects it. */
    const [first = address.Street ?? '', ...rest] = (address.Label ?? '').split(', ');
    return {
      value: PlaceId,
      label: first,
      description: rest.join(', '),
      address: {
        line1: first,
        line2: '',
        city: address.Locality ?? address.SubRegion?.Name ?? address.Region?.Name ?? '',
        postcode: address.PostalCode ?? '',
        country: address.Country?.Name ?? '',
      },
    };
  });
};
