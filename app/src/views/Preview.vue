<template>
  <div v-html="rawHtml"></div>
  <notification />
</template>

<script>
import { mapGetters } from 'vuex';
import { getOwnPage } from '../api/page';
import { POP_UP_ERROR } from '../store/action-types';
import Notification from '../components/Notification';

export default {
  name: 'Preview',
  components: { Notification },
  data: function () {
    return {
      rawHtml: '',
    };
  },
  computed: mapGetters(['isAuthenticated']),
  methods: {
    loadPage: async function () {
      if (!this.isAuthenticated) {
        return;
      }

      const { html, css, message } = await getOwnPage();

      if (typeof html === 'undefined' || typeof css === 'undefined') {
        this.$store.dispatch(POP_UP_ERROR, {
          error: message || 'Something went wrong',
        });
        return;
      }

      const page = `<style>${css}</style>${html}`;
      this.rawHtml = page;
    },
  },
  created: function () {
    this.loadPage();
  },
};
</script>
