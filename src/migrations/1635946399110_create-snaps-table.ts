/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';
import Model from '../entities/Snap/model'

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable(Model.tableName, {
    id: {
      type: 'TEXT',
      primaryKey: true,
      notNull: true
    },
    snapshot_id: {
      type: 'TEXT',
      notNull: true
    },
    snapshot_space: {
      type: 'TEXT',
      notNull: true
    },
    snapshot_snap_proposal: {
      type: 'TEXT',
      notNull: true
    },
    snapshot_signature: {
      type: 'TEXT',
      notNull: true
    },
    snapshot_network: {
      type: 'TEXT',
      notNull: true
    },
    user: {
      type: 'TEXT',
      notNull: true
    },
    category: {
      type: 'TEXT',
      notNull: true
    },
    status: {
      type: 'TEXT',
      notNull: true
    },
    title: {
      type: 'TEXT',
      notNull: true
    },
    description: {
      type: 'TEXT',
      notNull: true,
    },
    configuration: {
      type: 'TEXT',
      notNull: false,
    },
    start_at: {
      type: 'TIMESTAMPTZ',
      default: 'now()',
      notNull: true
    },
    finish_at: {
      type: 'TIMESTAMPTZ',
      notNull: true
    },
    taken_at: {
      type: 'TIMESTAMPTZ',
      notNull: true
    },
    taken_location_x: {
      type: 'INTEGER',
      notNull: true
    },
    taken_location_y: {
      type: 'INTEGER',
      notNull: true
    }
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable(Model.tableName, { cascade: true })
}
