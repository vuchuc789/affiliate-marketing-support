<template>
  <navigator />
  <div class="container">
    <div id="gjs"></div>
  </div>
  <notification />
</template>

<script>
import '../../node_modules/grapesjs/dist/css/grapes.min.css';
import '../../node_modules/grapesjs-preset-newsletter/dist/grapesjs-preset-newsletter.css';

import Navigator from '../components/Navigator.vue';
import Notification from '../components/Notification.vue';
import grapesjs from 'grapesjs';
import grapesjsPlugin from 'grapesjs-preset-newsletter';
import {
  ADD_TO_DROPDOWN,
  REMOVE_FROM_DROPDOWN,
  SET_SHOWED_DROPDOWN,
} from '../store/mutation-types';
import { dropDownItems } from '../store/navigation';
import { POP_UP_ERROR, POP_UP_MESSAGE } from '../store/action-types';
import { mapState } from 'vuex';
import store from '../store';
import { previewLink } from '../api/preview';
import { getAdpiaInfo } from '../api/adpia';

const host = process.env.VUE_APP_API_URI;
const storedEndpoint = `${host}/api/page/store`;
const loadedEndpoint = `${host}/api/page/load`;

export default {
  name: 'Editor',
  components: { Navigator, Notification },
  data: function () {
    return {
      editor: null,
    };
  },
  computed: mapState({
    token: (state) => state.auth.accessToken,
  }),
  created: function () {
    const { editorSave, publish } = dropDownItems;

    editorSave.callback = () => {
      this.editor.store((res) => {
        const { message, success } = res;

        if (success) {
          this.$store.dispatch(POP_UP_MESSAGE, {
            message: message || 'Stored successfully',
          });
          return;
        }

        this.$store.dispatch(POP_UP_ERROR, {
          error: message || 'Stored failure',
        });
      });

      this.$store.commit(SET_SHOWED_DROPDOWN, { isShow: false });
    };

    this.$store.commit(ADD_TO_DROPDOWN, { items: [editorSave, publish] });
  },
  mounted: function () {
    grapesjs.plugins.add('gjs-preset-newsletter', grapesjsPlugin.default);

    this.editor = grapesjs.init({
      container: '#gjs',
      fromElement: true,
      height: '100%',
      width: '100%',
      plugins: ['gjs-preset-newsletter'],
      pluginsOpts: {
        'gjs-preset-newsletter': {
          modalTitleImport: 'Import template',
          // ... other options
        },
      },
      storageManager: {
        type: 'remote',
        id: '',
        autosave: false,
        urlStore: storedEndpoint,
        urlLoad: loadedEndpoint,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      },
    });

    this.editor.Components.addType('product', {
      model: {
        defaults: {
          productLink: '',
          traits: [
            {
              type: 'text',
              name: 'productLink',
              changeProp: true,
            },
          ],
          tagName: 'div',
          components: [
            {
              tagName: 'img',
              attributes: {
                src: 'https://blackmantkd.com/wp-content/uploads/2017/04/default-image-620x600.jpg',
              },
              style: {
                width: '30%',
                height: 'auto',
                'aspect-ratio': '1 / 1',
                flex: '0 0 auto',
              },
            },
            {
              tagName: 'div',
              components: [
                {
                  tagName: 'a',
                  attributes: {
                    href: '/',
                  },
                  components: "This is the product's title",
                  style: {
                    'font-size': '1.5rem',
                    'font-weight': '700',
                    'text-decoration': 'none',
                  },
                },
                {
                  tagName: 'p',
                  components: "This is the product's description",
                },
              ],
              style: {
                flex: '1 1 auto',
                display: 'flex',
                'flex-direction': 'column',
                padding: '1rem',
              },
            },
          ],
          style: {
            display: 'flex',
            padding: '0.5rem',
            border: '1px solid #000',
            margin: '0.5rem',
          },
        },
        init: function () {
          this.on('change:productLink', this.onChange);
        },
        onChange: async function () {
          try {
            const { productLink } = this.props();
            if (!productLink) {
              return;
            }

            const {
              success,
              message: message1,
              ...data
            } = await previewLink(productLink);

            if (!success) {
              store.dispatch(POP_UP_ERROR, {
                error: message1 || 'Something went wrong',
              });
              return;
            }

            const { adpia_id: adpiaId, message: message2 } =
              await getAdpiaInfo();

            if (!adpiaId) {
              store.dispatch(POP_UP_ERROR, {
                error: message2 || 'Something went wrong',
              });
              return;
            }

            const {
              images: [image],
              description,
              title,
            } = data;

            const affiliateLink = `https://adpia.vn/api/v1/deeplink?aff=${adpiaId}&url=${encodeURIComponent(
              productLink
            )}`;

            this.components().at(0).setAttributes({ src: image });
            this.components().at(1).components().at(0).components(title);
            this.components()
              .at(1)
              .components()
              .at(0)
              .setAttributes({ href: affiliateLink });
            this.components().at(1).components().at(1).components(description);
          } catch (error) {
            store.dispatch(POP_UP_ERROR, { error: error.message });
          }
        },
      },
    });

    // Create a block for the component, so we can drop it easily
    this.editor.Blocks.add('product-block', {
      label: 'Product',
      attributes: { class: 'fa fa-bars' },
      content: { type: 'product' },
      select: true,
    });
  },
  beforeUnmount: function () {
    const { editorSave, publish } = dropDownItems;
    this.$store.commit(REMOVE_FROM_DROPDOWN, {
      items: [editorSave, publish],
    });
  },
};
</script>

<style scoped>
.container {
  height: calc(100vh - var(--nav-height));
  width: 100%;
  overflow: hidden;
}
</style>
