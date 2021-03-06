<template>
  <filterable-list :content="list" :placeholder="placeholder" :onSettings="openSettings" :onDelete="removeComponent" :onReorder="reorderComponents" :addTitle="addTitle" :onAdd="openAddComponents"></filterable-list>
</template>

<script>
  import _ from 'lodash';
  import { getComponentNode } from '../lib/utils/head-components';
  import { getSchema } from '../lib/core-data/components';
  import { getComponentName, refProp } from '../lib/utils/references';
  import label from '../lib/utils/label';
  import filterableList from './filterable-list.vue';

  /**
   * Get the name of the component
   *
   * @param  {object} component
   * @return {object}
   */
  function formatComponents(component) {
    const uri = _.isString(component) ? component : component[refProp]; // page list will have strings, layout will have objects

    return {
      id: uri,
      title: label(getComponentName(uri))
    };
  }

  export default {
    props: ['args'],
    data() {
      return {};
    },
    computed: {
      list() {
        if (this.args.isPage) {
          // list in the page
          return _.map(_.get(this.$store, `state.page.data['${this.args.path}']`), formatComponents);
        } else {
          // list in the layout
          return _.map(_.get(this.$store, `state.components['${this.args.uri}'].${this.args.path}`), formatComponents);
        }
      },
      label() {
        // this.args.uri will always be the layout uri, since that's where the schema for layout AND page lists is defined
        return label(this.args.path, getSchema(this.args.uri, this.args.path));
      },
      placeholder() {
        return `Search ${this.label} components`;
      },
      addTitle() {
        return `Add component to ${this.label}`;
      }
    },
    methods: {
      openSettings(id) {
        const path = 'settings';

        this.$store.dispatch('closePane');
        this.$store.dispatch('focus', { uri: id, path });
      },
      removeComponent(id) {
        const componentNode = getComponentNode(id);

        this.$store.dispatch('removeHeadComponent', componentNode);
      },
      reorderComponents(id, index, oldIndex) {
        let componentList;

        if (this.args.isPage) {
          componentList = _.reduce(_.get(this.$store, `state.page.data['${this.args.path}']`), (list, val) => list.concat(val), []);
          componentList.splice(oldIndex, 1); // remove at the old index
          componentList.splice(index, 0, id); // add at the new index
          this.$store.dispatch('savePage', { [this.args.path]: componentList });
        } else {
          componentList = _.reduce(_.get(this.$store, `state.components['${this.args.uri}'].${this.args.path}`), (list, val) => list.concat({ [refProp]: val[refProp] }), []);
          componentList.splice(oldIndex, 1); // remove at the old index
          componentList.splice(index, 0, { [refProp]: id }); // add at the new index
          this.$store.dispatch('saveComponent', { uri: this.args.uri, data: { [this.args.path]: componentList }});
        }
      },
      openAddComponents() {
        const layoutURI = _.get(this.$store, 'state.page.data.layout');

        this.$store.dispatch('openAddComponents', { parentURI: layoutURI, path: this.args.path });
      }
    },
    components: {
      'filterable-list': filterableList
    }
  };
</script>
