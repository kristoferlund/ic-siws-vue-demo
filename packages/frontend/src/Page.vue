<script setup lang="ts">
import { computed, watch } from "vue";
import { useSiws } from "ic-siws-js/vue";
import { WalletMultiButton } from "solana-wallets-vue";
import { useWallet } from 'solana-wallets-vue';
import type { SignInMessageSignerWalletAdapter } from "@solana/wallet-adapter-base";

const siws = useSiws();
const { publicKey, wallet } = useWallet();

// Monitor the wallet connection and update the SIWS adapter accordingly
watch(publicKey, () => {
  // An adapter is available when a wallet is connected/selected
  if (wallet.value?.adapter) {
    siws.setAdapter(wallet.value.adapter as SignInMessageSignerWalletAdapter);
  } else {
    // No wallet is connected, so we clear the siws identity
    siws.clear();
  }
});

const loginButtonText = computed(() => {
  if (siws.signMessageStatus === "pending") return "Signing SIWE message...";
  if (siws.loginStatus === "logging-in") return "Logging in...";
  if (siws.prepareLoginStatus === "preparing") return "Preparing...";
  if (siws.loginStatus === "error") return "Login";
  return "Login";
});

const isLoginButtonDisabled = computed(() => {
  return (
    siws.signMessageStatus === "pending" ||
    siws.loginStatus === "logging-in" ||
    siws.prepareLoginStatus === "preparing"
  );
});

</script>

<template>
  <div>
    <a href="https://internetcomputer.org" target="_blank">
      <img src="./assets/ic.svg" class="logo" alt="Internet Computer" />
    </a>
    <a href="https://ethereum.org" target="_blank">
      <img src="./assets/ethereum.svg" class="logo" alt="Ethereum" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo" alt="Vue" />
    </a>
  </div>

  <h1>Sign in with Solana</h1>

  <div>
    This demo application and template demonstrates how to sign in Ethereum users into an IC canister using
    <a href="https://www.npmjs.com/package/ic-siws-js">ic-siws-js</a> and the
    <a href="https://github.com/kristoferlund/ic-siws">ic-siws-provider</a> canister.
  </div>

  <div class="pill-container">
    <div class="pill">Vue version</div>
  </div>

  <div class="container">
    <div v-if="publicKey" id="publicKey">
      {{ publicKey.toString().slice(0, 4) }}...{{ publicKey.toString().slice(-4) }}
    </div>

    <div v-if="siws.identity" id="icPrincipal">
      {{ siws.identity.getPrincipal().toString().slice(0, 6) }}...{{ siws.identity.getPrincipal().toString().slice(-4) }}
    </div>

    <wallet-multi-button v-if="!publicKey" dark/>

    <button
      v-if="publicKey && !siws.identity"
      @click="siws.login"
      :disabled="isLoginButtonDisabled"
      id="loginButton"
    >
      {{ loginButtonText }}
    </button>

    <button v-if="publicKey && siws.identity" @click="siws.clear" id="logoutButton">
      Logout
    </button>

    <div v-if="siws.isPrepareLoginError || siws.isLoginError || !!siws.signMessageError" class="error" id="error">
      {{ siws.prepareLoginError || siws.loginError || siws.signMessageError }}
    </div>  
  </div>

  <div class="links">
    <a href="https://github.com/kristoferlund/ic-siws-vue-demo" target="_blank" rel="noreferrer">
      <img src="https://img.shields.io/badge/github-ic--siws--vue--demo-blue.svg?style=for-the-badge" />
    </a>
  </div>
</template>