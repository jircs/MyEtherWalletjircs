<template>
  <mew-stepper :items="items" :on-step="step" class="mx-md-0">
    <!-- ===================================================================================== -->
    <!-- Step 1: Create Password -->
    <!-- ===================================================================================== -->
    <template v-if="step === 1" #stepperContent1>
      <div class="subtitle-1 font-weight-bold grey--text">STEP 1.</div>
      <div class="headline font-weight-bold mb-5">Create password</div>

      <!-- ===================================================================================== -->
      <!-- Enter Password -->
      <!-- ===================================================================================== -->
      <mew-input
        v-model="password"
        :hint="
          password && password.length < 8
            ? 'Password must be 8 or more characters'
            : ''
        "
        label="Password"
        placeholder="Enter Password"
        :has-clear-btn="true"
        class="flex-grow-1 mb-2 CreateWalletKeystorePasswordInput"
        :error-messages="passwordMessages"
        type="password"
      />

      <!-- ===================================================================================== -->
      <!-- Confirm Password -->
      <!-- ===================================================================================== -->
      <mew-input
        v-model="cofirmPassword"
        hint=""
        label="Confirm Password"
        placeholder="Confirm password"
        class="flex-grow-1 CreateWalletKeystoreConfirmPWInput"
        type="password"
        :error-messages="errorPasswordConfirmation"
      />

      <!-- ===================================================================================== -->
      <!-- Creat Wallet Button -->
      <!-- ===================================================================================== -->
      <div v-if="!isGeneratingKeystore" class="d-flex justify-center">
        <mew-button
          class="CreateWalletKeystoreSubmitButton"
          title="Create Wallet"
          btn-size="xlarge"
          :has-full-width="false"
          :disabled="!enableCreateButton"
          @click.native="createWallet"
        />
      </div>

      <!-- ===================================================================================== -->
      <!-- Loading State: isGeneratingKeystore = true -->
      <!-- ===================================================================================== -->
      <v-row v-else justify="center" align="center" class="mt-1 mb-7">
        <v-progress-circular
          indeterminate
          color="greenPrimary"
        ></v-progress-circular>
        <p class="mb-0 mx-3">Sit tight while we are encrypting your wallet</p>
      </v-row>

      <!-- ===================================================================================== -->
      <!-- Warning Block -->
      <!-- ===================================================================================== -->
      <mew-warning-sheet
        class="mt-4 mb-0"
        title="NOT RECOMMENDED"
        description="This information is sensitive, and these options should only be used in offline settings by experienced crypto users. You will need your keystore file + password to access your wallet. Please save them in a secure location. We CAN NOT retrieve or reset your keystore/password if you lose them."
      />
    </template>

    <!-- ===================================================================================== -->
    <!-- Step 2: Download Keystore -->
    <!-- ===================================================================================== -->
    <template v-if="step === 2" #stepperContent2>
      <div class="subtitle-1 font-weight-bold grey--text step-two-header">
        STEP 2.
      </div>
      <div class="headline font-weight-bold">Download keystore file</div>
      <div class="mb-5">
        Important things to know before downloading your keystore file.
      </div>
      <v-row class="align-stretch">
        <v-col v-for="(d, key) in warningData" :key="key" cols="12" sm="4">
          <div class="pa-6 border-container">
            <div class="d-flex justify-center py-3">
              <mew-icon :icon-name="d.icon" :img-height="70" />
            </div>
            <h5 class="font-weight-bold mt-1 mb-2">{{ d.title }}</h5>
            <div>{{ d.description }}</div>
          </div>
        </v-col>
      </v-row>
      <div class="d-flex flex-column flex-md-row justify-center mt-6">
        <mew-button
          title="Back"
          btn-style="outline"
          btn-size="xlarge"
          class="mx-md-1 my-1"
          @click.native="updateStep(1)"
        />
        <mew-button
          title="Acknowledge & Download"
          btn-size="xlarge"
          :has-full-width="false"
          class="mx-md-1 my-1 CreateWalletKeystoreAccept"
          @click.native="downloadWallet"
        />
      </div>
      <a
        ref="downloadLink"
        :href="walletFile"
        rel="noopener noreferrer"
        :download="name"
        class="link"
      />
      <mew-warning-sheet
        class="mt-4 mb-0"
        title="NOT RECOMMENDED"
        description="This information is sensitive, and these options should only be used in offline settings by experienced crypto users. You will need your keystore file + password to access your wallet. Please save them in a secure location. We CAN NOT retrieve or reset your keystore/password if you lose them."
      />
    </template>

    <!-- ===================================================================================== -->
    <!-- Step 3: Done -->
    <!-- ===================================================================================== -->
    <template v-if="step === 3" #stepperContent3>
      <div class="d-flex align-center">
        <div>
          <div class="subtitle-1 font-weight-bold grey--text step-three-header">
            STEP 3.
          </div>
          <div class="headline font-weight-bold mb-3">You are done!</div>
          <p class="mb-6">
            You are now ready to take advantage of all that Ethereum has to
            offer! Access with keystore file should only be used in an offline
            setting.
          </p>
          <img
            class="done-image d-block d-sm-none mx-auto mt-12 mb-12"
            src="@/assets/images/icons/icon-keystore-mew.png"
          />

          <div class="d-flex justify-center flex-column">
            <mew-button
              title="Access Wallet"
              btn-size="xlarge"
              :has-full-width="false"
              class="mb-3 CreateWalletKeystoreAccess"
              @click.native="goToAccess"
            />
            <mew-button
              title="Create Another Wallet"
              :has-full-width="false"
              btn-style="transparent"
              @click.native="restart"
            />
          </div>
        </div>
        <img
          class="d-none d-sm-block ml-8 icon-keystore"
          src="@/assets/images/icons/icon-keystore-mew.png"
        />
      </div>
    </template>
  </mew-stepper>
</template>

<script>
import { isEmpty } from 'lodash';

import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { ROUTES_HOME } from '@/core/configs/configRoutes';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';

export default {
  name: 'CreateWalletKeystore',
  mixins: [handlerAnalytics],
  props: {
    handlerCreateWallet: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      step: 1,
      warningData: [
        {
          icon: 'paperPlane',
          title: "Don't lose it",
          description: 'Be careful, it can not be recovered if you lose it.'
        },
        {
          icon: 'thief',
          title: "Don't share it",
          description:
            'Your funds will be stolen if you use this file on a malicious phishing site.'
        },
        {
          icon: 'copy',
          title: 'Make a backup',
          description:
            'Secure it like the millions of dollars it may one day be worth.'
        }
      ],
      items: [
        {
          step: 1,
          name: 'STEP 1. Create password'
        },
        {
          step: 2,
          name: 'STEP 2. Download keystore file'
        },
        {
          step: 3,
          name: 'STEP 3. Well done'
        }
      ],
      password: '',
      cofirmPassword: '',
      walletFile: '',
      name: '',
      isGeneratingKeystore: false
    };
  },
  computed: {
    errorPasswordConfirmation() {
      if (
        this.password !== this.cofirmPassword &&
        this.cofirmPassword?.length > 0
      ) {
        return 'Passwords do not match';
      }
      return '';
    },
    passwordMessages() {
      if (isEmpty(this.password)) return 'Required';
      if (this.password?.length < 8)
        return 'Password is less than 8 characters';
      return '';
    },
    enableCreateButton() {
      return (
        !isEmpty(this.password) &&
        this.cofirmPassword === this.password &&
        this.password?.length >= 8
      );
    }
  },
  methods: {
    createWallet() {
      this.isGeneratingKeystore = true;
      this.handlerCreateWallet
        .generateKeystore(this.password)
        .then(res => {
          this.name = res.name;
          this.walletFile = res.blobUrl;
          this.updateStep(2);
          this.isGeneratingKeystore = false;
          // Reset password value
          this.password = '';
          this.cofirmPassword = '';
        })
        .catch(e => {
          Toast(e, {}, ERROR);
        });
    },
    downloadWallet() {
      this.$refs.downloadLink.click();
      this.trackCreateWalletAmplitude('create_keystore_success');
      this.trackCreateWallet(WALLET_TYPES.KEYSTORE);
      this.updateStep(3);
    },
    goToAccess() {
      this.trackCreateWalletAmplitude('create_keystore_success_go_to_access');
      this.$router.push({ name: ROUTES_HOME.ACCESS_WALLET.NAME });
    },
    /**
     * Update step
     */
    updateStep(step) {
      this.step = step ? step : 1;
    },
    restart() {
      this.step = 1;
      this.password = '';
      this.cofirmPassword = '';
      this.trackCreateWalletAmplitude(
        'create_keystore_success_create_another_wallet'
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.link {
  opacity: 0;
  position: absolute;
  top: 100000px;
  z-index: -1;
}
.mew-component--keystore .mew-stepper.v-stepper {
  background: transparent !important;
}
.border-container {
  border: 1px solid var(--v-greenPrimary-base);
  border-radius: 7px;
  box-shadow: 0 8px 15px var(--v-greyLight-base);
  height: 100%;
}
.done-image {
  max-width: 170px;
}
.icon-keystore {
  max-width: 250px;
}
</style>
