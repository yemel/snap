/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';
import Model from '../entities/Quest/model'

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable(Model.tableName, {
    id: {
      type: 'TEXT',
      primaryKey: true,
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
    image_id: {
      type: 'TEXT',
      notNull: false,
    },
    finish_at: {
      type: 'TIMESTAMPTZ',
      notNull: true
    }
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable(Model.tableName, { cascade: true })
}
