import "solana-wallets-vue/styles.css";
import "./style.css";

import App from "./App.vue";
import SolanaWallets from "solana-wallets-vue";
import { createApp } from "vue";

// Wallet plugin options: specify wallet adapters and auto-connect behavior.
const walletOptions = {
  wallets: [], // List of wallet adapters to support
  autoConnect: true, // Auto-connect to last used wallet on load
};

// Initialize Vue application with the Solana Wallets plugin
createApp(App).use(SolanaWallets, walletOptions).mount("#app");
