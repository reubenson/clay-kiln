<docs>
  # required

  Appends "required" to a field's label, to mark that field as required.

  ## Arguments

  _No arguments_
</docs>

<style lang="sass">
  @import '../styleguide/colors';
  @import '../styleguide/typography';

  .label-required {
    @include tertiary-text();

    color: $behavior-required;
  }
</style>

<template>
  <span v-if="hasLabel" class="label-required">required</span>
</template>

<script>
  import _ from 'lodash';
  import { fieldProp, behaviorKey } from '../lib/utils/references';
  import { expand, convertNativeTagName } from '../lib/forms/behaviors';

  export default {
    props: ['name', 'data', 'schema', 'args'],
    data() {
      return {};
    },
    computed: {
      hasLabel() {
        return !!_.find(expand(this.schema[fieldProp]), (b) => b[behaviorKey] === convertNativeTagName('label'));
      }
    },
    slot: 'before'
  };
</script>
