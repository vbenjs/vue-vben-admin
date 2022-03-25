import Icon from '/@/components/Icon';
import { Button, Collapse, CollapsePanel, Form, Input } from 'ant-design-vue';
import type { FormItemProps } from 'ant-design-vue';
import type { MeetingRegisterGroup } from '/@/api/meeting/model/registerModel';
import type { FormSchema } from '/@/components/Form';

const registerGroupRender: FormSchema['render'] = (props) => {
  const { model } = props;

  const initValues: Partial<MeetingRegisterGroup> = {
    name: '',
    company: '',
    job: '',
    telephone: '',
    email: '',
    weixin: '',
    phone: '',
  };

  const { register_groups = [] } = model;

  function del(index: number) {
    register_groups.splice(index, 1);
  }

  function add() {
    register_groups.push([initValues]);
  }

  const inlineSchemas = (item, index): (FormItemProps & { field: string })[] => [
    {
      name: ['register_groups', index, 'name'],
      field: 'name',
      label: '姓名',
      labelCol: {
        span: 5,
      },
      rules: [
        {
          required: true,
          message: '请填写同行人姓名',
        },
      ],
    },

    {
      name: ['register_groups', index, 'company'],
      field: 'company',
      label: '单位',
      labelCol: {
        span: 5,
      },
    },

    {
      name: ['register_groups', index, 'job'],
      field: 'job',
      label: '职务/职称',
      labelCol: {
        span: 5,
      },
    },

    {
      name: ['register_groups', index, 'phone'],
      field: 'phone',
      label: '手机',
      labelCol: {
        span: 5,
      },
    },

    {
      name: ['register_groups', index, 'telephone'],
      field: 'telephone',
      label: '电话',
      labelCol: {
        span: 5,
      },
    },

    {
      name: ['register_groups', index, 'email'],
      field: 'email',
      label: '邮箱',
      labelCol: {
        span: 5,
      },
    },

    {
      name: ['register_groups', index, 'weixin'],
      field: 'weixin',
      label: '微信',
      labelCol: {
        span: 5,
      },
    },
  ];

  return (
    <div>
      <Collapse bordered={false}>
        {register_groups?.map((item, index) => (
          <CollapsePanel
            header={item.name}
            key={index}
            extra={
              <>
                <Button
                  onClick={() => del(index)}
                  class="ml-4"
                  size="small"
                  danger
                  icon={<Icon icon="ant-design:rest-twotone" />}
                />
              </>
            }
          >
            <div>
              {inlineSchemas(item, index).map((props) => (
                <Form.Item {...props}>
                  <Input
                    value={item[props.field]}
                    onChange={(e) => (item[props.field] = e.target.value)}
                  />
                </Form.Item>
              ))}
            </div>
          </CollapsePanel>
        ))}
      </Collapse>
      <Button class="mt-2" block onClick={add} icon={<Icon icon="ant-design:plus-outlined" />}>
        添加一个同行人
      </Button>
    </div>
  );
};

export default registerGroupRender;
