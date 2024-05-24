import { ref } from 'vue';

const openPreference = ref(false);

function useOpenPreference() {
  function handleOpenPreference() {
    openPreference.value = true;
  }

  return {
    handleOpenPreference,
    openPreference,
  };
}

export { useOpenPreference };
