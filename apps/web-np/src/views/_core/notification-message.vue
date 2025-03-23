<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  alertType: {
    type: String,
    required: true,
  },
  reloadNotification: {
    type: Boolean,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: false,
    default: null,
  },
  urlType: {
    type: String,
    required: false,
    default: null,
  },
  urlName: {
    type: String,
    required: false,
    default: null,
  },
});

const getFileName = () => {
  const fileName = props.urlName ?? props.url;

  // Try to get the start and last 10 chars of the file name
  return `${fileName.slice(0, 10)}...${fileName.slice(-10)}`;
};
</script>
<template>
  <div>
    {{ props.message }}
  </div>
  <div v-if="props.url && props.urlType === 'file'">
    <ul class="list-disc">
      <li>
        <strong>Download: </strong>
        <a
          :href="props.url"
          class="text-blue-600 underline hover:text-blue-800"
        >
          {{ getFileName() }}
        </a>
      </li>
    </ul>
  </div>
</template>
