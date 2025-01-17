<script setup lang="ts">
import { ref, computed } from "vue";
import { createWalletClient, custom } from "viem";
import { mainnet } from "viem/chains";
import { useSiwe } from "ic-siwe-js/vue";

const siwe = useSiwe();
const account = ref<string | null>(null);

const loginButtonText = computed(() => {
  if (siwe.signMessageStatus === "pending") return "Signing SIWE message...";
  if (siwe.loginStatus === "logging-in") return "Logging in...";
  if (siwe.prepareLoginStatus === "preparing") return "Preparing...";
  if (siwe.loginStatus === "error") return "Login";
  return "Login";
});

const isLoginButtonDisabled = computed(() => {
  return (
    siwe.signMessageStatus === "pending" ||
    siwe.loginStatus === "logging-in" ||
    siwe.prepareLoginStatus === "preparing"
  );
});

async function connectWallet() {
  if (!window.ethereum) {
    console.error("No Ethereum provider found (e.g., MetaMask).");
    return;
  }

  const walletClient = createWalletClient({
    chain: mainnet,
    transport: custom(window.ethereum),
  });

  try {
    const accounts = await walletClient.requestAddresses();
    account.value = accounts[0] || null;
  } catch (error) {
    console.error("Failed to connect wallet:", error);
  }
}
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

  <h1>Sign in with Ethereum</h1>

  <div>
    This demo application and template demonstrates how to sign in Ethereum users into an IC canister using
    <a href="https://www.npmjs.com/package/ic-siwe-js">ic-siwe-js</a> and the
    <a href="https://github.com/kristoferlund/ic-siwe">ic-siwe-provider</a> canister.
  </div>

  <div class="pill-container">
    <div class="pill">Vue version</div>
  </div>

  <div class="container">
    <div v-if="account" id="ethAddress">
      {{ account.slice(0, 6) }}...{{ account.slice(-4) }}
    </div>

    <div v-if="siwe.identity" id="icPrincipal">
      {{ siwe.identity.getPrincipal().toString().slice(0, 6) }}...{{ siwe.identity.getPrincipal().toString().slice(-4) }}
    </div>

    <button v-if="!account" @click="connectWallet" id="connectButton">
      Connect wallet
    </button>

    <button
      v-if="account && !siwe.identity"
      @click="siwe.login"
      :disabled="isLoginButtonDisabled"
      id="loginButton"
    >
      {{ loginButtonText }}
    </button>

    <button v-if="account && siwe.identity" @click="siwe.clear" id="logoutButton">
      Logout
    </button>

    <div v-if="siwe.isPrepareLoginError || siwe.isLoginError || !!siwe.signMessageError" class="error" id="error">
      {{ siwe.prepareLoginError || siwe.loginError || siwe.signMessageError }}
    </div>  
  </div>

  <div class="links">
    <a href="https://github.com/kristoferlund/ic-siwe-vue-demo" target="_blank" rel="noreferrer">
      <img src="https://img.shields.io/badge/github-ic--siwe--vue--demo-blue.svg?style=for-the-badge" />
    </a>
  </div>
</template>