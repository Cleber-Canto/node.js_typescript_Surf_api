/** @jsx jsx */
/** @jsxFrag React.Fragment **/
import React from 'react';
import { jsx } from '@emotion/core';
import { ListForecast } from '../components/list-forecast';
import {
  useAddBeachToForecast,
  useForecast,
  useBeaches,
} from '../utils/forecast-hooks';
import { useAsync } from '../utils/use-async';
import { Map } from '../components/map';
import {
  FormField,
  SelectField,
  PrimaryButton,
  ErrorMessage,
  FullPageLoading,
} from '../components/misc';

function RegisterBeachForm({ onSubmit, submitButton, styles }) {
  const { isLoading, isError, error, run } = useAsync();

  function handleSubmit(event) {
    event.preventDefault();
    const { name, lat, lng, position } = event.target.elements;
    run(
      onSubmit({
        name: name.value,
        lat: parseFloat(lat.value),
        lng: parseFloat(lng.value),
        position: position.value,
      })
    );

    if (!isLoading && !isError) {
      event.target.reset();
    }
  }

  return (
    <div
      css={{
        boxSizing: 'border-box',
        ...styles,
      }}
    >
      <h4 css={{ fontWeight: '500' }}>Add new beach</h4>
      <form
        onSubmit={handleSubmit}
        css={{
          backgroundColor: '#eee',
          padding: '1em',
        }}
      >
        <FormField
          label="Beach name"
          id="name"
          type="text"
          name="name"
          placeholder="Barra da Tijuca"
          required={true}
        />
        <FormField
          inline
          label="Latitude"
          id="lat"
          type="text"
          name="lat"
          placeholder="-23.000372"
          required={true}
        />
        <FormField
          inline
          label="Longitude"
          id="lng"
          type="text"
          name="lng"
          placeholder="-43.365894"
          required={true}
        />
        <SelectField
          inline
          label="Position"
          id="position"
          type="select"
          options={['North', 'South', 'East', 'West']}
          name="position"
        />

        <div css={{ display: 'flex', justifyContent: 'center' }}>
          {React.cloneElement(
            submitButton,
            { type: 'submit', isLoading },
            ...(Array.isArray(submitButton.props.children)
              ? submitButton.props.children
              : [submitButton.props.children])
          )}
        </div>
        {isError ? <ErrorMessage error={error} /> : null}
      </form>
    </div>
  );
}

function ForecastScreen() {
  const beaches = useBeaches();
  const [handleAddBeach] = useAddBeachToForecast();
  const { forecast, status, error } = useForecast();
  const isError = status === 'error';

  if (status === 'loading') {
    return (
      <FullPageLoading
        caption="Fetching beaches..."
        styles={{ backgroundColor: '#fff', zIndex: '10' }}
      />
    );
  }

  if (isError) {
    return (
      <>
        <RegisterBeachForm
          onSubmit={handleAddBeach}
          submitButton={<PrimaryButton align="right">Add beach</PrimaryButton>}
        />
        <ErrorMessage error={error} />
      </>
    );
  }

  return (
    <>
      <div css={{ display: 'flex' }}>
        <div css={{ width: beaches ? '60%' : '100%' }}>
          <ListForecast
            forecast={forecast}
            filterListItems={(li) =>
              new Date(li.time).getHours() % 6 === 0 &&
              new Date(li.time).getHours() !== 0
            }
          />
        </div>
        <RegisterBeachForm
          styles={{
            width: '40%',
            paddingLeft: '2em',
            alignSelf: 'flex-start',
          }}
          onSubmit={handleAddBeach}
          submitButton={<PrimaryButton align="right">Add beach</PrimaryButton>}
        />
      </div>
      <Map
        beaches={beaches}
        styles={{
          minWidth: '500px',
          minHeight: '500px',
          width: '100%',
          margin: '2em 0',
        }}
      />
    </>
  );
}

export { ForecastScreen };
