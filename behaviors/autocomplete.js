var dom = require('../services/dom'),
  db = require('../services/db'),
  cid = require('../services/cid');

/**
 * Converts array of strings to option elements.
 * @param {array} options
 * @returns {Element}
 */
function formatOptions(options) {

  var optionsEl;

  options = options.reduce(function (prev, curr) {
    return prev + '<option>' + curr + '</option>';
  }, '');

  optionsEl = dom.create(`
    <label>
      <select>
        ${ options }
      </select>
    </label>
  `);

  return optionsEl;
}

/**
 * Throw an error if missing requirements.
 * @param {string} api
 * @param {Element} existingInput
 */
function handleDevErrors(api, existingInput) {

  var missing;

  if (!api) {
    missing = 'an API';
  } else if (!existingInput) {
    missing = 'a text input';
  }

  if (missing) {
    throw new Error('Autocomplete requires ' + missing + '.');
  }

}

module.exports = function (result, args) {

  var api = args.api,
    existingInput = dom.find(result.el, 'input[type="text"], input:not([type])'), // input without type is still text
    datalistId = 'autocomplete-' + cid(),
    datalist;

  handleDevErrors(api, existingInput);

  // Add element.
  datalist = document.createElement('datalist');
  result.el.appendChild(datalist);

  // Connect datalist to input.
  datalist.id = datalistId;
  existingInput.setAttribute('list', datalistId);

  // Todo: once lists become large, this will need to be optimized; perhaps using the 'input' event.
  existingInput.addEventListener('focus', function () {
    db.getComponentJSONFromReference(api)
      .then(formatOptions)
      .then(function (optionsEl) {
        datalist.appendChild(optionsEl);
      });
  });

  return result;
};

// Export for unit testing
module.exports.formatOptions = formatOptions;