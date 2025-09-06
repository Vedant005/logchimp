<template>
	<div class="flex justify-center">
    <div class="hover:bg-neutral-200/70 rounded-lg">
      <a
        :href="href"
        class="text-xs font-medium text-(--color-gray-70) px-2 py-0.5"
      >
        {{t("powerBy.poweredByLogchimp")}}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

import { useSettingStore } from "../store/settings";

const route = useRoute();
const { get: siteSettings } = useSettingStore();

const { t } = useI18n();

const BASE_URL = "https://logchimp.codecarrot.net";
const href = computed(() => {
  const params = new URLSearchParams({
    utm_medium: "powered",
  });

  const source = route.name?.toString();
  if (source) {
    params.set("utm_source", source);
  }

  if (siteSettings.title) {
    params.set("company", siteSettings.title);
  }

  return `${BASE_URL}?${params}`;
});
</script>
