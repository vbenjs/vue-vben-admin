<script lang="tsx">
  import { defineComponent } from 'vue';
  import { Tooltip } from 'ant-design-vue';
  import { getPopupContainer } from '@/utils';
  import Icon from '@/components/Icon/Icon.vue';

  const props = {
    account: {
      type: Object as PropType<{
        email?: string;
        name?: string;
        phone?: string;
        username: string;
      }>,
      required: true,
    },
  };

  export default defineComponent({
    name: 'RemindAccount',
    components: { Tooltip },
    props,
    setup(props) {
      return () => {
        const { username, name, phone, email } = props.account || {};

        const showName = name ?? username;
        const hideTip = !name && !phone && !email;
        return (
          <div>
            <span class="mr-1">{showName}</span>
            {!hideTip && (
              <Tooltip
                autoAdjustOverflow={true}
                placement={'top'}
                getPopupContainer={() => getPopupContainer()}
                color="#87d068"
              >
                {{
                  title: () => {
                    return (
                      <div>
                        {!!name && <div>用户名：{username}</div>}
                        {!!phone && <div>手机号：{phone}</div>}
                        {!!email && (
                          <div>
                            邮箱：
                            <a href={`mailto:${email}`}>{email}</a>
                          </div>
                        )}
                      </div>
                    );
                  },
                  default: () => (
                    <Icon icon="ant-design:info-circle-outlined" class="cursor-pointer" />
                  ),
                }}
              </Tooltip>
            )}
          </div>
        );
      };
    },
  });
</script>
