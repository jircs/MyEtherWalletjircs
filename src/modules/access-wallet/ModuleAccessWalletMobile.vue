<template>
  <!--
  =====================================================================================
    Overlay - access using software
  =====================================================================================
  -->
  <mew-overlay
    :footer="{
      text: 'Need help?',
      linkTitle: 'Contact support',
      link: 'mailto:support@myetherwallet.com'
    }"
    :show-overlay="open"
    title="Access Wallet with Mobile Apps"
    content-size="large"
    :close="close"
  >
    <!--
    =====================================================================================
      Mobile Connection Protocol Buttons
    =====================================================================================
    -->
    <div style="max-width: 650px; width: 100%" class="mx-auto mb-n5 pt-5">
      <div v-for="(btn, key) in buttons" :key="key">
        <mew-button
          has-full-width
          color-theme="greyMedium"
          btn-style="outline"
          style="height: 160px"
          class="mb-5"
          @click.native="btn.fn"
        >
          <div
            class="d-flex align-center justify-space-between px-2"
            style="width: 100%"
          >
            <div class="mew-heading-2 textDark--text">{{ btn.label }}</div>
            <v-img
              :src="btn.icon"
              max-width="90px"
              min-width="40px"
              class="px-4 px-sm-3"
              contain
            />
          </div>
        </mew-button>
      </div>
    </div>
  </mew-overlay>
</template>

<script>
import { mapActions } from 'vuex';

import { Toast, SENTRY } from '@/modules/toast/handler/handlerToast';
import {
  WalletConnectWallet,
  WalletLinkWallet
} from '@/modules/access-wallet/hybrid/handlers';
import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import WALLET_TYPES from './common/walletTypes';

import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';

export default {
  name: 'ModuleAccessWalletMobile',
  mixins: [handlerAnalytics],
  props: {
    open: {
      type: Boolean,
      default: false
    },
    close: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      buttons: [
        {
          label: 'WalletConnect',
          icon: require('@/assets/images/icons/icon-wallet-connect.svg'),
          fn: () => {
            this.trackAccessWalletAmplitude('click_access_wallet_connect');
            this.openWalletConnect();
          }
        },
        {
          label: 'WalletLink',
          icon: require('@/assets/images/icons/icon-wallet-link.png'),
          fn: () => {
            this.trackAccessWalletAmplitude('click_access_wallet_link');
            this.openWalletLink();
          }
        }
      ]
    };
  },
  methods: {
    ...mapActions('wallet', ['setWallet']),
    openWalletConnect() {
      try {
        WalletConnectWallet()
          .then(_newWallet => {
            this.setWallet([_newWallet]).then(() => {
              this.trackAccessWallet(WALLET_TYPES.WALLET_CONNECT);
              this.trackAccessWalletAmplitude('access_wallet_success');
              this.$router.push({ name: ROUTES_WALLET.DASHBOARD.NAME });
            });
          })
          .catch(e => {
            WalletConnectWallet.errorHandler(e);
          });
      } catch (e) {
        Toast(e.message, {}, SENTRY);
      }
    },
    openWalletLink() {
      try {
        WalletLinkWallet()
          .then(_newWallet => {
            this.setWallet([_newWallet]).then(() => {
              this.trackAccessWallet(WALLET_TYPES.WALLET_LINK);
              this.trackAccessWalletAmplitude('access_wallet_success');
              this.$router.push({ name: ROUTES_WALLET.DASHBOARD.NAME });
            });
          })
          .catch(e => {
            WalletLinkWallet.errorHandler(e);
          });
      } catch (e) {
        Toast(e.message, {}, SENTRY);
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
