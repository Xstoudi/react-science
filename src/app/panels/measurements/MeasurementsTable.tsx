/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FaTrash } from 'react-icons/fa';

import {
  MeasurementBase,
  MeasurementKind,
  useAppDispatch,
  useAppState,
} from '../../../app-data/index';

import { MeasurementCheckbox } from './MeasurementCheckbox';
import MeasurementColorPreview from './MeasurementColorPreview';
import MeasurementVisibilityToggle, {
  MeasurementSelectedVisibilityChange,
} from './MeasurementVisibilityToggle';

export interface MeasurementsTableProps {
  kind: MeasurementKind;
}

interface MeasurementsTableRowProps {
  item: MeasurementBase;
  kind: MeasurementsTableProps['kind'];
}

const styles = {
  root: css`
    font-size: 0.875rem;
    line-height: 1.25rem;
    border-collapse: collapse;
    table-layout: fixed;
  `,
  th: css`
    border-bottom-width: 1px;
    font-weight: 500;
    text-align: left;
    padding-bottom: 10px;
    padding-top: 10px;
    padding-left: 2rem;
  `,
  tbody: css`
    background-color: white;
  `,
  tr: css`
    height: 50px;
    max-height: 50px;
    overflow: hidden;
    cursor: pointer;
    padding-left: 2rem;
    padding-bottom: 10px;
    padding-top: 10px;
    border-bottom-width: 1px;

    font-weight: 500;
    font-size: 0.875rem;
    line-height: 1.25rem;
  `,
  header: css`
    border-bottom-width: 1px;
    font-weight: 500;
    text-align: left;
    padding-bottom: 10px;
    padding-top: 10px;
    padding-left: 2rem;
  `,
  iconsContainer: css`
    display: flex;
    justify-content: center;
    align-items: center;
    justify-items: center;
    height: 50px;
    flex-direction: row;
    gap: 0.5rem;
    cursor: default;
    width: 70px;
  `,
  linkButton: css`
    cursor: pointer;
    :hover {
      text-decoration: underline;
    }
  `,
  container: css`
    display: flex;
    flex-direction: column;
    gap: 5px;
  `,
  headerColumn: css`
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
    padding-left: 5px;

    border-bottom: 1px solid black;
  `,
};

export function MeasurementsTable(props: MeasurementsTableProps) {
  const { kind } = props;

  const {
    data: { measurements },
  } = useAppState();
  const dispatch = useAppDispatch();

  function onSelectLink(select: boolean) {
    dispatch({
      type: 'SELECT_ALL_MEASUREMENTS',
      payload: {
        kind,
        select,
      },
    });
  }

  function onRemove() {
    dispatch({ type: 'REMOVE_SELECTED_MEASUREMENTS', payload: { kind } });
  }

  return (
    <div css={styles.container}>
      <div css={styles.headerColumn}>
        <MeasurementSelectedVisibilityChange kind={kind} openedEyes />
        <MeasurementSelectedVisibilityChange kind={kind} openedEyes={false} />
        <span css={styles.linkButton} onClick={() => onSelectLink(true)}>
          Select all
        </span>
        <span css={styles.linkButton} onClick={() => onSelectLink(false)}>
          Unselect all
        </span>

        <FaTrash style={{ cursor: 'pointer' }} onClick={onRemove} />
      </div>

      <table css={styles.root}>
        <MeasurementsTableHeader />
        <tbody css={styles.tbody}>
          {measurements[kind].entries.map((element) => (
            <MeasurementsTableRow key={element.id} item={element} kind={kind} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

const tableHeaderStyles = {
  thStyleEmpty: css`
    display: flex;
    gap: 5px;
    align-items: center;
    width: 70px;
  `,
  thStyleFilename: css`
    width: 60%;
  `,
  thStyleTechnique: css`
    width: 150px;
  `,
  tdName: css`
    width: 60%;
    overflow: hidden;
  `,
};

function MeasurementsTableHeader() {
  return (
    <thead>
      <tr css={styles.header}>
        <th css={tableHeaderStyles.thStyleEmpty} />
        <th css={tableHeaderStyles.thStyleFilename}>Filename</th>
        <th css={tableHeaderStyles.thStyleTechnique}>Technique</th>
      </tr>
    </thead>
  );
}

function MeasurementsTableRow(props: MeasurementsTableRowProps) {
  const { item, kind } = props;

  const {
    view: { selectedMeasurements, measurements },
  } = useAppState();

  const dispatch = useAppDispatch();

  function onSelectRow() {
    dispatch({
      type: 'SELECT_MEASUREMENT',
      payload: { id: item.id, kind, acc: 'replace' },
    });
  }

  function onSelectCheckbox() {
    const isAlreadyChecked = selectedMeasurements[kind]?.includes(item.id);

    dispatch({
      type: 'SELECT_MEASUREMENT',
      payload: { id: item.id, kind, acc: isAlreadyChecked ? 'remove' : 'add' },
    });
  }

  return (
    <tr css={styles.tr}>
      <td css={styles.iconsContainer}>
        <MeasurementVisibilityToggle
          id={item.id}
          isVisible={measurements[item.id].visible}
        />
        <MeasurementColorPreview
          measurementId={item.id}
          kind={kind}
          color={measurements[item.id].color}
        />
        <MeasurementCheckbox
          checked={selectedMeasurements[kind]?.includes(item.id) || false}
          onSelectCheckbox={onSelectCheckbox}
        />
      </td>
      <td css={tableHeaderStyles.tdName} onClick={onSelectRow} title={item.id}>
        {item.info.file?.name ?? item.info.title}
      </td>
      <td onClick={onSelectRow}>{item.meta.technique}</td>
    </tr>
  );
}
