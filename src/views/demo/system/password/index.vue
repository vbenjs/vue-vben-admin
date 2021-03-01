<template>
  <div class="p-4 flex flex-col justify-center items-center">
    <BasicForm @register="register" />

    <div class="flex justify-center">
      <a-button @click="resetFields"> 重置 </a-button>
      <a-button class="ml-4" type="primary" @click="handleSubmit"> 确认 </a-button>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';

  import { BasicForm, useForm } from '/@/components/Form';

  import { formSchema } from './pwd.data';
  export default defineComponent({
    name: 'ChangePassword',
    components: { BasicForm },
    setup() {
      const [register, { validate, resetFields }] = useForm({
        size: 'large',
        labelWidth: 100,
        showActionButtonGroup: false,
        schemas: formSchema,
      });

      async function handleSubmit() {
        try {
          const values = await validate();
          const { passwordOld, passwordNew } = values;

          // TODO custom api
          console.log(passwordOld, passwordNew);
          // const { router } = useRouter();
          // router.push(pageEnum.BASE_LOGIN);
        } catch (error) {}
      }

      return { register, resetFields, handleSubmit };
    },
  });
</script>
