import { useState } from 'react';

import {
  getCurrentMeasurementData,
  useAppState,
} from '../../../app-data/index';
import { ValueRenderers, Table } from '../../../components/index';

export function MeasurementInfoPanel() {
  const appState = useAppState();
  const measurement = getCurrentMeasurementData(appState);
  const [search, setSearch] = useState('');
  if (!measurement) return null;
  const { meta, info } = measurement.data;

  function viewData(data: Record<string, any>) {
    return Object.keys(data).map((key) => {
      const value = data[key];
      if (
        !key.toLowerCase().includes(search.toLowerCase()) &&
        !valueSearch(value, search)
      ) {
        return null;
      }
      return (
        <Table.Row key={key}>
          <ValueRenderers.Text value={key} />
          {valueCell(value)}
        </Table.Row>
      );
    });
  }

  return (
    <div>
      <input
        style={{
          border: 'solid 1px black',
          width: '300px',
          marginBottom: '10px',
          padding: '3px',
        }}
        value={search}
        placeholder="search for a parameter ..."
        onChange={({ target }) => {
          if (target.value !== undefined) setSearch(target.value);
        }}
      />
      <Table>
        <Table.Header>
          <ValueRenderers.Title value="Parameter" />
          <ValueRenderers.Title value="Value" />
        </Table.Header>
        {viewData(info)}
        {viewData(meta)}
      </Table>
    </div>
  );
}

/**
 * Get the value cell depending on the type of the value
 * @param value - ValueRenderers value.
 * @returns - ValueRenderers component.
 */
function valueCell(value: number | string | object) {
  switch (typeof value) {
    case 'number':
      return <ValueRenderers.Number value={value} />;
    case 'object':
      return <ValueRenderers.Object value={value} />;
    case 'string':
      return <ValueRenderers.Text value={value} />;
    default:
      <ValueRenderers.Text value={value} />;
  }
}

/**
 * Search a string in different type of values
 *
 * @param value - Value to search in.
 * @param search - Value to search for.
 * @returns - If search exist in value
 */
function valueSearch(value: number | string | object, search: string): boolean {
  switch (typeof value) {
    case 'number':
      return String(value).includes(search.toLowerCase());
    case 'object':
      return JSON.stringify(value).toLowerCase().includes(search.toLowerCase());
    case 'string':
      return value.toLowerCase().includes(search.toLowerCase());
    default:
      return false;
  }
}
