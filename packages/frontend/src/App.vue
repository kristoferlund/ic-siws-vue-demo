<script setup lang="ts">

import { ref } from "vue";
import { createSiwsIdentityProvider } from "ic-siws-js/vue";
import { canisterId } from "../../ic_siws_provider/declarations/index";
import Page from "./Page.vue";
import { useWallet } from 'solana-wallets-vue';
import type { SignInMessageSignerWalletAdapter,  } from "@solana/wallet-adapter-base";

const { wallet } = useWallet();

// If a wallet is connected at initialization, we use the wallet adapter
// when creating the SIWS identity provider.
// Otherwise, we will set the adapter when the wallet is connected
const adapterRef = ref<SignInMessageSignerWalletAdapter | undefined>(
  wallet.value?.adapter as SignInMessageSignerWalletAdapter | undefined
);

createSiwsIdentityProvider({
  canisterId,
  adapter: adapterRef.value,
});

</script>

<template>
  <Page />
</template>