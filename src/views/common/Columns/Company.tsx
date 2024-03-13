import { PmCompany } from '@/ApiModel/company/company';
import { enabledCompany } from '@/api/company/company';
import { StatusSwitch } from '@/components/Business';
import { BasicColumn } from '@/components/Table';
import { CompanyType, companyTypeMap } from '@/enums/companyType';
import { formatToDate } from '@/utils/dateUtil';
import { AUTH_KEY } from '@/views/enterprise/group/data';

interface Options {
  ignoreEnable?: boolean;
  companyType?: CompanyType;
}

export function getCompanyColumns(options: Options = {}): BasicColumn<PmCompany>[] {
  const { ignoreEnable, companyType } = options;
  const companyTypeText = companyType ? companyTypeMap.get(companyType) : companyType;
  return [
    { dataIndex: 'name', title: companyTypeText + '名称', width: 160 },
    { dataIndex: 'shortName', title: '简称', width: 100 },
    { dataIndex: 'code', title: '编码', width: 100 },
    { dataIndex: 'shortCode', title: '短码', width: 100 },
    { dataIndex: 'email', title: '邮箱', width: 160 },
    { dataIndex: 'phone', title: '电话', width: 120 },
    { dataIndex: 'contract', title: '联系人', width: 100 },
    { dataIndex: 'contractPhone', title: '联系人电话', width: 140 },
    { dataIndex: 'uscCode', title: '统一社会信息用代码', width: 200 },
    {
      dataIndex: 'uscExpired',
      title: '营业执照有效期',
      width: 160,
      customRender: ({ text }) => formatToDate(text),
    },
    { dataIndex: 'businessScope', title: '经营范围', width: 160 },
    { dataIndex: 'website', title: '网站', width: 160 },
    // { dataIndex: 'province', title: '省', width: 100 },
    // { dataIndex: 'city', title: '市', width: 100 },
    // { dataIndex: 'area', title: '区', width: 100 },
    { dataIndex: 'address', title: '地址', width: 160 },
    {
      dataIndex: 'enabled',
      title: '状态',
      width: 100,
      ifShow: !ignoreEnable,
      customRender: ({ record }) => {
        return (
          <StatusSwitch
            api={(checked) => enabledCompany([record.id], checked)}
            v-model:checked={record.enabled}
            auth={`${AUTH_KEY}_enable`}
          />
        );
      },
    },
    {
      dataIndex: 'expiryDate',
      title: '有效期',
      width: 160,
      customRender: ({ text }) => formatToDate(text),
    },
  ];
}
