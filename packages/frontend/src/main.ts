import "solana-wallets-vue/styles.css";
import "./style.css";

import App from "./App.vue";
import SolanaWallets from "solana-wallets-vue";
import { createApp } from "vue";

const walletOptions = {
  wallets: [],
  autoConnect: true,
};

createApp(App).use(SolanaWallets, walletOptions).mount("#app");
