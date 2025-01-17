<script setup lang="ts">

import { createSiweIdentityProvider } from "ic-siwe-js/vue";
import { canisterId } from "../../ic_siwe_provider/declarations/index";
import Page from "./Page.vue";

createSiweIdentityProvider({
  canisterId,
});

</script>

<template>
  <Page />
</template>