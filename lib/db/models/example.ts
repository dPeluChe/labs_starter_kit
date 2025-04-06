import { defineModel } from '../model-schema';

// Definir un modelo de ejemplo
export const ExampleModel = defineModel({
  name: 'examples',
  fields: {
    title: {
      type: 'text',
      nullable: false
    },
    description: {
      type: 'text',
      nullable: true
    },
    isActive: {
      type: 'boolean',
      defaultValue: 'true',
      nullable: false
    },
    count: {
      type: 'integer',
      defaultValue: '0',
      nullable: false
    },
    metadata: {
      type: 'jsonb',
      nullable: true
    }
  },
  timestamps: true
});