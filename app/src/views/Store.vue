<template>
  <div v-html="rawHtml"></div>
  <notification />
</template>

<script>
import Notification from '../components/Notification';
import { getPage } from '../api/page';
import { POP_UP_ERROR } from '../store/action-types';

export default {
  name: 'Store',
  components: { Notification },
  data: function () {
    return {
      rawHtml: '',
    };
  },
  created: async function () {
    const { userId = '' } = this.$route.params;

    const { html, css, message } = await getPage(userId);

    if (typeof html === 'undefined' || typeof css === 'undefined') {
      this.$store.dispatch(POP_UP_ERROR, {
        error: message || 'Something went wrong',
      });
      return;
    }

    const page = `<style>${css}</style>${html}`;
    this.rawHtml = page;
  },
};
</script>
