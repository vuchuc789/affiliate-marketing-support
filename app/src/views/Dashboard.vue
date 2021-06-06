<template>
  <navigator />
  <div class="container">
    <div class="db-l-panel">
      <div>
        <span>Adpia ID: </span>
        <input type="text" v-model="adpiaInfo.adpiaId" />
        <div @click="updateAdpiaInfo" class="update-btn">update</div>
      </div>
      <div>
        <span>Coupon api: </span>
        <input type="text" v-model="adpiaInfo.couponApi" />
        <div @click="updateAdpiaInfo" class="update-btn">update</div>
      </div>
      <div>
        <span>ID: </span>
        <span>{{ userInfo.userId }}</span>
      </div>
      <div>
        <span>Email: </span>
        <span>{{ userInfo.email }}</span>
      </div>
      <div>
        <span>Store url: </span>
        <a :href="storeUrl" @click="onStoreLinkClick">{{ storeUrl }}</a>
      </div>
    </div>
    <div class="panel-gap"></div>
    <div class="db-r-panel">
      <h2>COUPONS</h2>
      <table>
        <tr>
          <th></th>
          <th>Merchant</th>
          <th>Discount Code</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Category</th>
          <th>Quantity</th>
          <th>Device</th>
          <th>Affiliate Link</th>
          <th>Description</th>
        </tr>
        <tr v-for="(coupon, index) in coupons" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ coupon.merchantId }}</td>
          <td>{{ coupon.code ? coupon.code : '' }}</td>
          <td>{{ coupon.startDate }}</td>
          <td>{{ coupon.endDate }}</td>
          <td>{{ coupon.categoryName }}</td>
          <td>{{ coupon.quantity === '0' ? '&infin;' : coupon.quantity }}</td>
          <td v-if="coupon.device === '1'">All</td>
          <td v-else-if="coupon.device === '2'">App only</td>
          <td v-else-if="coupon.device === '3'">Web only</td>
          <td v-else></td>
          <td><a :href="coupon.affLink">copy me</a></td>
          <td>{{ coupon.description }}</td>
        </tr>
      </table>
    </div>
  </div>
  <notification />
</template>

<script>
import { mapActions } from 'vuex';
import { getUserInfo } from '../api/user';
import { getAdpiaInfo, getCoupons, setAdpiaInfo } from '../api/adpia';
import Navigator from '../components/Navigator.vue';
import Notification from '../components/Notification.vue';
import { POP_UP_ERROR, POP_UP_MESSAGE } from '../store/action-types';

export default {
  name: 'Dashboard',
  components: { Navigator, Notification },
  data: function () {
    return {
      adpiaInfo: {},
      userInfo: {},
      coupons: [],
    };
  },
  computed: {
    storeUrl: function () {
      if (!this.userInfo.userId) {
        return '';
      }

      return `${window.location.origin}/store/${this.userInfo.userId}`;
    },
  },
  methods: {
    ...mapActions({
      popupError: POP_UP_ERROR,
      popupMessage: POP_UP_MESSAGE,
    }),
    updateAdpiaInfo: async function () {
      if (!this.adpiaInfo.adpiaId && !this.adpiaInfo.couponApi) {
        return;
      }

      const { adpiaId: adpia_id, couponApi: coupon_api } = this.adpiaInfo;

      const { message, success } = await setAdpiaInfo({ adpia_id, coupon_api });

      if (!success) {
        this.popupError({ error: message || 'Failure to update' });
        return;
      }

      this.popupMessage({ message: message || 'Updated successfully' });
    },
    onStoreLinkClick(event) {
      event.preventDefault();

      if (!this.userInfo.userId) {
        return;
      }

      this.$router.push(`/store/${this.userInfo.userId}`);
    },
  },
  watch: {
    adpiaInfo: {
      handler: async function (newVal) {
        if (!newVal?.couponApi) {
          return;
        }

        const { data } = await getCoupons(newVal.couponApi);

        if (!data || !Array.isArray(data.items)) {
          this.popupError({ error: 'Fail to load coupons' });
          return;
        }

        const coupons = [];

        for (const item of data.items) {
          const {
            AFF_LINK: affLink,
            CATEGORY_NAME: categoryName,
            DESCRIPTION: description,
            DEVICE: device,
            DISCOUNT: discount,
            DISCOUNT_CODE: code,
            END_DATE: endDate,
            MERCHANT_ID: merchantId,
            QUANTITY: quantity,
            START_DATE: startDate,
          } = item;

          coupons.push({
            affLink,
            categoryName,
            description,
            device,
            discount,
            code,
            endDate,
            merchantId,
            quantity,
            startDate,
          });
        }

        this.coupons = coupons;
      },
      deep: true,
    },
  },
  created: async function () {
    try {
      const {
        user_id: userId,
        email,
        message: userMessage,
      } = await getUserInfo();

      if (!userId) {
        this.popupError({ error: userMessage || 'Failure to load user info' });
      } else {
        this.userInfo = { userId, email };
      }

      const {
        adpia_id: adpiaId,
        coupon_api: couponApi,
        message: adpiaMessage,
      } = await getAdpiaInfo();

      if (!adpiaId && !couponApi) {
        this.popupError({ error: adpiaMessage || 'Adpia info not found' });
      } else {
        this.adpiaInfo = { adpiaId, couponApi };
      }
    } catch (e) {
      this.popupError({ error: e.message });
    }
  },
};
</script>

<style scoped>
.container {
  height: calc(100vh - var(--nav-height));
  display: flex;
}

.panel-gap {
  width: 1px;
  height: 100%;
  background-color: #000;
  margin: 0 3px;
}

.db-l-panel {
  flex: 1 1 0;
  padding: 1rem;
  overflow: auto;
  background-color: #c8e5ff;
}

.db-r-panel {
  flex: 3 1 0;
  background-color: white;
  padding: 1rem;
  overflow: auto;
}

.db-l-panel > div {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}

.db-l-panel > div:not(:last-child) {
  margin-bottom: 0.5rem;
}

.db-l-panel > div > :not(:last-child) {
  margin-right: 0.3rem;
}

.update-btn {
  cursor: pointer;
  border: 1px solid #ddd;
  background-color: #ddd;
}

.db-l-panel > div > span:first-child {
  user-select: none;
  font-weight: 700;
  white-space: nowrap;
}
th {
  user-select: none;
}

h2 {
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
}

td,
th {
  border: 1px solid #ddd;
}

tr > td:nth-child(2) {
  text-transform: capitalize;
}
</style>
