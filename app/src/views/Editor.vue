<template>
  <navigator />
  <div id="editor" class="container">
    <div class="panel__top">
      <div class="panel__basic-actions"></div>
      <div class="panel__devices"></div>
      <div class="panel__switcher"></div>
    </div>
    <div class="editor-row">
      <div class="editor-canvas">
        <div id="gjs"></div>
      </div>
      <div class="panel__right">
        <div class="layers-container"></div>
        <div class="styles-container"></div>
        <div class="traits-container"></div>
      </div>
    </div>
    <div id="blocks"></div>
  </div>
  <notification />
</template>

<script>
import 'grapesjs/dist/css/grapes.min.css';
import Navigator from '../components/Navigator.vue';
import Notification from '../components/Notification.vue';
import grapesjs from 'grapesjs';

export default {
  name: 'Editor',
  components: { Navigator, Notification },
  data: function () {
    return {
      editor: null,
    };
  },
  mounted: function () {
    this.editor = grapesjs.init({
      container: '#gjs',
      fromElement: true,
      // height: 'calc(100% - 50px)',
      width: 'auto',
      storageManager: false,
      layerManager: {
        appendTo: '.layers-container',
      },
      panels: {
        defaults: [
          {
            id: 'layers',
            el: '.panel__right',
            resizable: {
              maxDim: 350,
              minDim: 200,
              tc: 0,
              cl: 1,
              cr: 0,
              bc: 0,
              keyWidth: 'flex-basis',
            },
          },
          {
            id: 'panel-switcher',
            el: '.panel__switcher',
            buttons: [
              {
                id: 'show-layers',
                active: true,
                label: 'Layers',
                command: 'show-layers',
                // Once activated disable the possibility to turn it off
                togglable: false,
              },
              {
                id: 'show-style',
                active: true,
                label: 'Styles',
                command: 'show-styles',
                togglable: false,
              },
              {
                id: 'show-traits',
                active: true,
                label: 'Traits',
                command: 'show-traits',
                togglable: false,
              },
            ],
          },
          {
            id: 'panel-devices',
            el: '.panel__devices',
            buttons: [
              {
                id: 'device-desktop',
                label: 'D',
                command: 'set-device-desktop',
                active: true,
                togglable: false,
              },
              {
                id: 'device-mobile',
                label: 'M',
                command: 'set-device-mobile',
                togglable: false,
              },
            ],
          },
        ],
      },
      blockManager: {
        appendTo: '#blocks',
        blocks: [
          {
            id: 'section', // id is mandatory
            label: '<b>Section</b>', // You can use HTML/SVG inside labels
            attributes: { class: 'gjs-block-section' },
            content: `<section>
          <h1>This is a simple title</h1>
          <div>This is just a Lorem text: Lorem ipsum dolor sit amet</div>
        </section>`,
          },
          {
            id: 'text',
            label: 'Text',
            content: '<div data-gjs-type="text">Insert your text here</div>',
          },
          {
            id: 'image',
            label: 'Image',
            // Select the component once it's dropped
            select: true,
            // You can pass components as a JSON instead of a simple HTML string,
            // in this case we also use a defined component type `image`
            content: { type: 'image' },
            // This triggers `active` event on dropped components and the `image`
            // reacts by opening the AssetManager
            activate: true,
          },
        ],
      },
      selectorManager: {
        appendTo: '.styles-container',
      },
      styleManager: {
        appendTo: '.styles-container',
        sectors: [
          {
            name: 'Dimension',
            open: false,
            // Use built-in properties
            buildProps: ['width', 'min-height', 'padding'],
            // Use `properties` to define/override single property
            properties: [
              {
                // Type of the input,
                // options: integer | radio | select | color | slider | file | composite | stack
                type: 'integer',
                name: 'The width', // Label for the property
                property: 'width', // CSS property (if buildProps contains it will be extended)
                units: ['px', '%'], // Units, available only for 'integer' types
                defaults: 'auto', // Default value
                min: 0, // Min value, available only for 'integer' types
              },
            ],
          },
          {
            name: 'Extra',
            open: false,
            buildProps: ['background-color', 'box-shadow', 'custom-prop'],
            properties: [
              {
                id: 'custom-prop',
                name: 'Custom Label',
                property: 'font-size',
                type: 'select',
                defaults: '32px',
                // List of options, available only for 'select' and 'radio'  types
                options: [
                  { value: '12px', name: 'Tiny' },
                  { value: '18px', name: 'Medium' },
                  { value: '32px', name: 'Big' },
                ],
              },
            ],
          },
        ],
      },
      traitManager: {
        appendTo: '.traits-container',
      },
      deviceManager: {
        devices: [
          {
            name: 'Desktop',
            width: '', // default size
          },
          {
            name: 'Mobile',
            width: '320px', // this value will be used on canvas width
            widthMedia: '480px', // this value will be used in CSS @media
          },
        ],
      },
    });

    this.editor.Panels.addPanel({
      id: 'panel-top',
      el: '.panel__top',
    });

    this.editor.Panels.addPanel({
      id: 'basic-actions',
      el: '.panel__basic-actions',
      buttons: [
        {
          id: 'visibility',
          active: true, // active by default
          className: 'btn-toggle-borders',
          label: '<u>B</u>',
          command: 'sw-visibility', // Built-in command
        },
        {
          id: 'export',
          className: 'btn-open-export',
          label: 'Exp',
          command: 'export-template',
          context: 'export-template', // For grouping context of buttons from the same panel
        },
        {
          id: 'show-json',
          className: 'btn-show-json',
          label: 'JSON',
          context: 'show-json',
          command(editor) {
            editor.Modal.setTitle('Components JSON')
              .setContent(
                `<textarea style="width:100%; height: 250px;">
            ${JSON.stringify(editor.getComponents())}
          </textarea>`
              )
              .open();
          },
        },
      ],
    });

    this.editor.Commands.add('show-layers', {
      getRowEl(editor) {
        return editor.getContainer().closest('.editor-row');
      },
      getLayersEl(row) {
        return row.querySelector('.layers-container');
      },

      run(editor /*, sender*/) {
        const lmEl = this.getLayersEl(this.getRowEl(editor));
        lmEl.style.display = '';
      },
      stop(editor /*, sender*/) {
        const lmEl = this.getLayersEl(this.getRowEl(editor));
        lmEl.style.display = 'none';
      },
    });

    this.editor.Commands.add('show-styles', {
      getRowEl(editor) {
        return editor.getContainer().closest('.editor-row');
      },
      getStyleEl(row) {
        return row.querySelector('.styles-container');
      },

      run(editor /*, sender*/) {
        const smEl = this.getStyleEl(this.getRowEl(editor));
        smEl.style.display = '';
      },
      stop(editor /*, sender*/) {
        const smEl = this.getStyleEl(this.getRowEl(editor));
        smEl.style.display = 'none';
      },
    });

    this.editor.Commands.add('show-traits', {
      getTraitsEl(editor) {
        const row = editor.getContainer().closest('.editor-row');
        return row.querySelector('.traits-container');
      },
      run(editor /*, sender*/) {
        this.getTraitsEl(editor).style.display = '';
      },
      stop(editor /*, sender*/) {
        this.getTraitsEl(editor).style.display = 'none';
      },
    });

    this.editor.Commands.add('set-device-desktop', {
      run: (editor) => editor.setDevice('Desktop'),
    });

    this.editor.Commands.add('set-device-mobile', {
      run: (editor) => editor.setDevice('Mobile'),
    });
  },
};
</script>

<style>
#editor {
  height: calc(100vh - var(--nav-height));
  display: flex;
  flex-direction: column;
}
.editor-row {
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  flex-wrap: nowrap;
  height: 300px;
  flex-grow: 1;
}

.editor-canvas {
  flex-grow: 1;
}

.panel__right {
  flex-basis: 230px;
  position: relative;
  overflow-y: auto;
}

#gjs {
  border: 3px solid #444;
  height: 100% !important;
}

.gjs-cv-canvas {
  top: 0;
  width: 100%;
  height: 100%;
}

.gjs-block {
  width: auto;
  height: auto;
  min-height: auto;
}

.panel__top {
  padding: 0;
  width: 100%;
  display: flex;
  position: initial;
  justify-content: center;
  justify-content: space-between;
}

.panel__basic-actions {
  position: initial;
}

.panel__devices {
  position: initial;
}

.panel__switcher {
  position: initial;
}
</style>
