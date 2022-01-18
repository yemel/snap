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
    taken_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
    },
    taken_location_x: {
      type: 'INTEGER',
      notNull: true,
    },
    taken_location_y: {
      type: 'INTEGER',
      notNull: true,
    },
    quest_id: {
      type: 'TEXT',
      notNull: true,
    },
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable(Model.tableName, { cascade: true })
}
