<script setup lang="ts">

import { ref } from "vue";
import { createSiwsIdentityProvider } from "ic-siws-js/vue";
import { canisterId } from "../../ic_siws_provider/declarations/index";
import Page from "./Page.vue";
import { useWallet } from "solana-wallets-vue";
import type { SignInMessageSignerWalletAdapter } from "@solana/wallet-adapter-base";

// Destructure the wallet store to access the adapter
const { wallet } = useWallet();

// Adapter reference for SIWS provider; may be undefined until wallet connects
const adapterRef = ref<SignInMessageSignerWalletAdapter | undefined>(
  wallet.value?.adapter as SignInMessageSignerWalletAdapter | undefined
);

// Initialize the SIWS identity provider with canister ID and adapter
createSiwsIdentityProvider({
  canisterId,
  adapter: adapterRef.value,
});

</script>

<template>
  <Page />
</template>