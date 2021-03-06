import _ from 'lodash';
import * as lib from './actions';

describe('validators: actions', () => {
  describe('validate', () => {
    const fn = lib.validate;

    beforeEach(() => {
      window.kiln.validators = {
        'not-applied': {}, // ignored, because no 'type' property
        'error-me': { type: 'error', validate: () => [] }, // empty array counts as no issues
        'warn-me': { type: 'warning', validate: _.noop } // undefined counts as no issues
      };
    });

    afterEach(() => {
      window.kiln.validators = {};
    });

    it('runs through all validators', () => {
      return fn({ state: {}, commit: _.noop }).then((res) => {
        expect(res.errors).to.eql([]);
        expect(res.warnings).to.eql([]);
      });
    });

    it('grabs the validator info if it returns any issues', () => {
      window.kiln.validators['real-error'] = {
        label: 'Bad',
        description: 'Oh noes!',
        type: 'error',
        validate() {
          return [{
            uri: 'foo',
            field: 'bar'
          }];
        }
      };

      return fn({ state: {}, commit: _.noop }).then((res) => {
        expect(res.errors).to.eql([{
          label: 'Bad',
          description: 'Oh noes!',
          items: [{
            uri: 'foo',
            field: 'bar'
          }]
        }]);
        expect(res.warnings).to.eql([]);
      });
    });
  });
});
