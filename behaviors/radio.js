var _ = require('lodash'),
  dom = require('../services/dom');

function createOptions(name, options) {
  return options.map(function (option) {
    return `
      <li class="editor-radio-item">
        <label class="option-label">${ _.startCase(option) || 'None' }
          <input data-field="${name}" type="radio" rv-checked="data.value" value="${option}" />
        </label>
      </li>`;
  }).join('\n');
}

module.exports = function (result, args) {
  var bindings = result.bindings,
    name = bindings.name,
    options = args.options,
    field;

  // add some stuff to the bindings
  bindings.required = !!args.required;

  field = dom.create(`
    <span class="input-label"><span class="label-inner">{ label }</span></span>
    <ul class="editor-radios">
      ${ createOptions(name, options) }
    </ul>
  `);

  result.el = field;

  return result;
};