<template>
  <v-footer
    color="bgWalletBlock"
    app
    inset
    absolute
    class="mew-component--wallet-footer pa-0"
  >
    <v-container
      class="d-flex align-center justify-center wallet-content-container pa-md-6"
      fluid
    >
      <v-row class="align-center justify-space-between">
        <v-col cols="12" md="7">
          <div class="mb-0 text-center text-md-left">
            {{ $t('footer.copyright', { year: new Date().getFullYear() }) }}
            <a
              v-if="!isOfflineApp"
              class="textDark--text text-decoration--none"
              href="https://www.coingecko.com/en"
              target="_blank"
            >
              {{ $t('footer.coingecko') }}
            </a>
            <span v-else>{{ $t('footer.coingecko') }}</span>
          </div>
        </v-col>
        <v-col
          cols="12"
          md="4"
          lg="3"
          order="first"
          order-md="last"
          class="pb-0 pb-md-2"
        >
          <div
            class="d-flex align-center justify-center justify-md-end textDark--text"
          >
            <a
              v-if="!isOfflineApp"
              class="textDark--text"
              href="https://help.myetherwallet.com/en/"
              target="_blank"
              >Help Center</a
            >
            <span class="px-1">|</span>
            <a
              v-if="!isOfflineApp"
              class="textDark--text"
              href="https://hackenproof.com/myetherwallet/myetherwallet"
              target="_blank"
              >Bug Bounty</a
            >
            <!-- hide language select till translations are done-->
            <!-- <span class="mx-5">|</span>
            <div style="max-width=200px">
              <v-select
                v-model="onLanguage"
                append-icon="mdi-chevron-down"
                :items="languages"
                item-text="name"
                item-value="value"
                return-object
                single-line
              ></v-select>
            </div> -->
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: 'TheWalletFooter',
  components: {},
  props: {
    isOfflineApp: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    onLanguage: null,
    languages: [
      {
        name: 'English',
        value: 'en',
        flag: require('@/assets/images/flags/uk.png')
      },
      {
        name: 'Russian',
        value: 'ru',
        flag: require('@/assets/images/flags/russia.png')
      },
      {
        name: 'Germany',
        value: 'ge',
        flag: require('@/assets/images/flags/germany.png')
      },
      {
        name: 'China',
        value: 'ch',
        flag: require('@/assets/images/flags/china.png')
      },
      {
        name: 'Korean',
        value: 'kr',
        flag: require('@/assets/images/flags/korea.png')
      },
      {
        name: 'Japanese',
        value: 'jp',
        flag: require('@/assets/images/flags/japan.png')
      }
    ]
  }),
  mounted() {
    this.onLanguage = this.languages[0].value;
  }
};
</script>

<style lang="scss">
.mew-component--wallet-footer {
  .v-select__selection {
    color: var(--v-textDark-base) !important;
    width: 100%;
    text-align: right;
  }

  .v-text-field > .v-input__control > .v-input__slot:before,
  .v-text-field > .v-input__control > .v-input__slot:after,
  .v-select.v-text-field input,
  .v-text-field__details {
    display: none;
  }

  .v-text-field .v-input__append-inner {
    margin-left: -5px;
  }

  .v-text-field,
  .v-input__slot {
    margin: 0;
    padding: 0;
  }

  .v-select .v-icon {
    color: var(--v-textDark-base) !important;
  }

  .v-select__selection {
    max-width: 100%;
    text-overflow: unset !important;
  }
}
</style>
