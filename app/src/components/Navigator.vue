<template>
  <div class="navbar">
    <router-link to="/" class="nav-logo">Logo</router-link>
    <a class="drop-btn" @click="onDropdownButtonClick"></a>
    <div
      class="drop-mask"
      :class="{ 'drop-hide': !isShowed }"
      @click="onDropdownButtonClick"
    ></div>
    <div class="drop-menu" :class="{ 'drop-hide': !isShowed }">
      <a
        v-for="{ key, title, callback } in dropdownMenu"
        :key="{ key }"
        @click="callback"
        >{{ title }}</a
      >
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import {
  SET_SHOWED_DROPDOWN,
  ADD_TO_DROPDOWN,
  REMOVE_FROM_DROPDOWN,
} from '../store/mutation-types';
import { dropDownItems } from '../store/navigation';

export default {
  name: 'Navigator',
  computed: {
    ...mapState({
      isShowed: (state) => state.navigation.isShowed,
      dropdownMenu: (state) => state.navigation.dropdownMenu,
    }),
    ...mapGetters(['isAuthenticated']),
  },
  methods: {
    onDropdownButtonClick: function () {
      this.$store.commit(SET_SHOWED_DROPDOWN, { isShowed: !this.isShowed });
    },
    ...mapMutations({
      addToDropdown: ADD_TO_DROPDOWN,
      removeFromDropdown: REMOVE_FROM_DROPDOWN,
    }),
  },
  watch: {
    isAuthenticated: function (newAuthenticatedState) {
      const { login, register, editor, logout, preview, dashboard } =
        dropDownItems;
      if (newAuthenticatedState) {
        this.removeFromDropdown({
          items: [login, register],
        });
        this.addToDropdown({
          items: [editor, logout, preview, dashboard],
        });
      } else {
        this.removeFromDropdown({
          items: [editor, logout, preview, dashboard],
        });
        this.addToDropdown({
          items: [login, register],
        });
      }
    },
  },
};
</script>

<style scoped>
.navbar {
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background-color: #ff6868;
  top: 0;
  width: 100vw;
  height: var(--nav-height);
  user-select: none;
  z-index: 1000;
}

.nav-logo {
  text-decoration: none;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 2em;
  letter-spacing: 2px;
  color: #fff;
}

.drop-btn,
.drop-btn::before,
.drop-btn::after {
  cursor: pointer;
  width: 1.8rem;
  height: 0.3rem;
  border-radius: 1rem;
  background-color: #fff;
}

.drop-btn {
  position: relative;
}

.drop-btn::before,
.drop-btn::after {
  position: absolute;
  content: '';
}

.drop-btn::before {
  transform: translateY(0.5rem);
}

.drop-btn::after {
  transform: translateY(-0.5rem);
}

.drop-menu {
  position: absolute;
  right: 0;
  top: var(--nav-height);
  background-color: #ffbcbc;
  width: 12rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 20;
  margin: 0.2rem;
  border-radius: 0.5rem;
}

.drop-hide {
  display: none;
}

.drop-menu > a {
  cursor: pointer;
  color: #3c2f2f;
  width: 100%;
  text-align: center;
  padding: 0.3rem;
  font-size: 1rem;
}

.drop-menu > a:not(:last-child) {
  border-bottom: 1px solid #3c2f2f;
}

.drop-mask {
  position: absolute;
  top: var(--nav-height);
  left: 0;
  width: 100vw;
  height: calc(100vw - var(--nav-height));
}
</style>
