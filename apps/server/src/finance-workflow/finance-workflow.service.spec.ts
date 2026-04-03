import { FinanceWorkflowService } from './finance-workflow.service';

describe('FinanceWorkflowService', () => {
  it('maps workbench rows and overlays latest approval state', async () => {
    const legacySqlService = {
      getStatus: jest.fn().mockReturnValue({
        configured: true,
        enabled: true,
      }),
      executeNamedQuery: jest.fn().mockResolvedValue({
        items: [
          {
            applyUserName: '李四',
            currentNodeName: '财务审核',
            flowNo: 'WF-2026-001',
            handlerName: '王五',
            id: '99',
            status: '0',
            subject: '费用报销审批',
            submitTime: '2026-03-09T08:00:00.000Z',
          },
        ],
        total: 1,
      }),
    };
    const prisma = {
      approvalRecord: {
        findMany: jest.fn().mockResolvedValue([
          {
            approvalAction: 'approve',
            approvalOpinion: '同意',
            approvalTime: new Date('2026-03-09T09:00:00.000Z'),
            businessNo: 'WF-2026-001',
            createTime: new Date('2026-03-09T09:00:00.000Z'),
          },
        ]),
      },
      authAdjustApply: { findFirst: jest.fn().mockResolvedValue(null) },
      contract: { findFirst: jest.fn().mockResolvedValue(null) },
      contractReceipt: { findFirst: jest.fn().mockResolvedValue(null) },
      expenseClaim: { findFirst: jest.fn().mockResolvedValue(null) },
      procurementApply: { findFirst: jest.fn().mockResolvedValue(null) },
      procurementResult: { findFirst: jest.fn().mockResolvedValue(null) },
      researchIndicator: { findFirst: jest.fn().mockResolvedValue(null) },
      researchProject: { findFirst: jest.fn().mockResolvedValue(null) },
      researchScopeAdjust: { findFirst: jest.fn().mockResolvedValue(null) },
    };

    const service = new FinanceWorkflowService(legacySqlService as any, prisma as any);
    const result = await service.getWorkbenchList(
      { page: 1, pageSize: 30, queryType: 'todo', userId: '1' },
      { fiscalYear: '2026', tenantId: 1 },
    );

    expect(legacySqlService.executeNamedQuery).toHaveBeenCalledWith(
      'todo-list',
      expect.objectContaining({ queryType: 'todo', userId: '1' }),
    );
    expect(result.items[0]).toMatchObject({
      applyTitle: '费用报销审批',
      applyUser: '李四',
      currentHandler: '王五',
      currentNode: '财务审核',
      flowNo: 'WF-2026-001',
      latestAction: 'approve',
      latestOpinion: '同意',
      status: '1',
      title: '费用报销审批',
    });
  });

  it('falls back to local workbench items when legacy sql is unavailable', async () => {
    const legacySqlService = {
      getStatus: jest.fn().mockReturnValue({
        configured: false,
        enabled: false,
      }),
    };
    const prisma = {
      approvalRecord: {
        findMany: jest
          .fn()
          .mockResolvedValueOnce([
            {
              approvalAction: 'submit',
              approvalTime: new Date('2026-03-09T09:00:00.000Z'),
              approverName: '管理员',
              approverUserId: BigInt(1),
              businessId: BigInt(8),
              businessNo: 'SMOKE-BX-0001',
              businessType: 'expense-claim',
              createBy: 'admin',
              createTime: new Date('2026-03-09T09:00:00.000Z'),
              nodeName: '申请节点',
              remark: '日常报销',
            },
          ])
          .mockResolvedValueOnce([
            {
              approvalAction: 'submit',
              approvalOpinion: '',
              approvalTime: new Date('2026-03-09T09:00:00.000Z'),
              businessNo: 'SMOKE-BX-0001',
              createTime: new Date('2026-03-09T09:00:00.000Z'),
            },
          ]),
      },
      expenseClaim: {
        findMany: jest.fn().mockResolvedValue([
          {
            applicant: '张三',
            claimNo: 'SMOKE-BX-0001',
            claimType: '日常报销',
            createBy: 'admin',
            createTime: new Date('2026-03-09T09:00:00.000Z'),
            flowNode: '部门审批',
            id: BigInt(8),
          },
        ]),
      },
    };

    const service = new FinanceWorkflowService(legacySqlService as any, prisma as any);
    const result = await service.getWorkbenchList(
      { page: 1, pageSize: 30, queryType: 'my-submit', userId: '1' },
      { fiscalYear: '2026', tenantId: 1 },
    );

    expect(result.total).toBe(1);
    expect(result.items[0]).toMatchObject({
      applyTitle: '日常报销',
      applyUser: '张三',
      businessType: 'expense-claim',
      currentHandler: '待处理',
      currentNode: '部门审批',
      flowNo: 'SMOKE-BX-0001',
      status: '0',
      title: '日常报销',
    });
  });

  it('returns local todo items for non-submitter users when legacy sql is unavailable', async () => {
    const legacySqlService = {
      getStatus: jest.fn().mockReturnValue({
        configured: false,
        enabled: false,
      }),
    };
    const prisma = {
      approvalRecord: {
        findMany: jest
          .fn()
          .mockResolvedValueOnce([
            {
              approvalAction: 'submit',
              approvalTime: new Date('2026-03-09T09:00:00.000Z'),
              approverName: '管理员',
              approverUserId: BigInt(1),
              businessId: BigInt(9),
              businessNo: 'SMOKE-HT-0001',
              businessType: 'contract',
              createBy: 'admin',
              createTime: new Date('2026-03-09T09:00:00.000Z'),
              nodeName: '部门审核',
              remark: '测试合同',
            },
          ])
          .mockResolvedValueOnce([
            {
              approvalAction: 'submit',
              approvalOpinion: '',
              approvalTime: new Date('2026-03-09T09:00:00.000Z'),
              businessNo: 'SMOKE-HT-0001',
              createTime: new Date('2026-03-09T09:00:00.000Z'),
            },
          ]),
      },
      contract: {
        findMany: jest.fn().mockResolvedValue([
          {
            bizNode: '部门审核',
            contractName: '测试合同',
            contractNo: 'SMOKE-HT-0001',
            createBy: 'admin',
            createTime: new Date('2026-03-09T09:00:00.000Z'),
            id: BigInt(9),
          },
        ]),
      },
    };

    const service = new FinanceWorkflowService(legacySqlService as any, prisma as any);
    const result = await service.getWorkbenchList(
      { page: 1, pageSize: 30, queryType: 'todo', userId: '2' },
      { fiscalYear: '2026', tenantId: 1 },
    );

    expect(result.total).toBe(1);
    expect(result.items[0]).toMatchObject({
      applyTitle: '测试合同',
      businessType: 'contract',
      currentHandler: '待处理',
      currentNode: '部门审核',
      flowNo: 'SMOKE-HT-0001',
      status: '0',
    });
  });

  it('creates approval records for workflow commands', async () => {
    const prisma = {
      approvalRecord: {
        create: jest.fn().mockResolvedValue({
          id: BigInt(1),
        }),
      },
      authAdjustApply: {
        findFirst: jest.fn().mockResolvedValue(null),
      },
      contract: {
        findFirst: jest.fn().mockResolvedValue(null),
      },
      contractReceipt: {
        findFirst: jest.fn().mockResolvedValue(null),
      },
      researchIndicator: {
        findFirst: jest.fn().mockResolvedValue(null),
      },
      researchProject: {
        findFirst: jest.fn().mockResolvedValue(null),
      },
      researchScopeAdjust: {
        findFirst: jest.fn().mockResolvedValue(null),
      },
      sysDept: {
        findUnique: jest.fn().mockResolvedValue({ deptName: '财务处' }),
      },
      sysUser: {
        findUnique: jest.fn().mockResolvedValue({
          deptId: BigInt(2),
          nickName: '管理员',
          userName: 'admin',
        }),
      },
      expenseClaim: {
        findFirst: jest.fn().mockResolvedValue({ claimNo: 'WF-2026-001' }),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      procurementApply: {
        findFirst: jest.fn().mockResolvedValue(null),
      },
      procurementResult: {
        findFirst: jest.fn().mockResolvedValue(null),
      },
    };

    const service = new FinanceWorkflowService({} as any, prisma as any);
    await service.executeCommand(
      'approve',
      {
        businessNo: 'WF-2026-001',
        currentNode: '财务审核',
        opinion: '同意通过',
      },
      { realName: '系统管理员', userId: '1', username: 'admin' },
    );

    expect(prisma.approvalRecord.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          approvalAction: 'approve',
          approvalOpinion: '同意通过',
          approverName: '系统管理员',
          businessNo: 'WF-2026-001',
          nodeName: '财务审核',
        }),
      }),
    );
    expect(prisma.expenseClaim.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ flowStatus: '1', updateBy: 'admin' }),
        where: { claimNo: 'WF-2026-001' },
      }),
    );
  });

  it('maps submit into local business submitted status', async () => {
    const prisma = {
      approvalRecord: {
        create: jest.fn().mockResolvedValue({ id: BigInt(2) }),
      },
      authAdjustApply: { findFirst: jest.fn().mockResolvedValue(null) },
      contract: { findFirst: jest.fn().mockResolvedValue(null) },
      contractReceipt: { findFirst: jest.fn().mockResolvedValue(null) },
      researchIndicator: { findFirst: jest.fn().mockResolvedValue(null) },
      researchProject: { findFirst: jest.fn().mockResolvedValue(null) },
      sysDept: { findUnique: jest.fn().mockResolvedValue({ deptName: '财务处' }) },
      sysUser: {
        findUnique: jest
          .fn()
          .mockResolvedValue({ deptId: BigInt(2), nickName: '管理员', userName: 'admin' }),
      },
      expenseClaim: {
        findFirst: jest.fn().mockResolvedValue({ claimNo: 'BX2026002' }),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      procurementApply: { findFirst: jest.fn().mockResolvedValue(null) },
      procurementResult: { findFirst: jest.fn().mockResolvedValue(null) },
      researchScopeAdjust: { findFirst: jest.fn().mockResolvedValue(null) },
    };

    const service = new FinanceWorkflowService({} as any, prisma as any);
    await service.executeCommand(
      'submit',
      { businessNo: 'BX2026002', currentNode: '申请节点' },
      { realName: '系统管理员', userId: '1', username: 'admin' },
    );

    expect(prisma.expenseClaim.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ flowNode: '部门审批', flowStatus: '1', updateBy: 'admin' }),
        where: { claimNo: 'BX2026002' },
      }),
    );
  });

  it('advances expense claim node on approve and resets on reject', async () => {
    const prisma = {
      approvalRecord: {
        create: jest.fn().mockResolvedValue({ id: BigInt(3) }),
      },
      authAdjustApply: { findFirst: jest.fn().mockResolvedValue(null) },
      contract: { findFirst: jest.fn().mockResolvedValue(null) },
      contractReceipt: { findFirst: jest.fn().mockResolvedValue(null) },
      researchIndicator: { findFirst: jest.fn().mockResolvedValue(null) },
      researchProject: { findFirst: jest.fn().mockResolvedValue(null) },
      sysDept: { findUnique: jest.fn().mockResolvedValue({ deptName: '财务处' }) },
      sysUser: {
        findUnique: jest
          .fn()
          .mockResolvedValue({ deptId: BigInt(2), nickName: '管理员', userName: 'admin' }),
      },
      expenseClaim: {
        findFirst: jest.fn().mockResolvedValue({ claimNo: 'BX2026003' }),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      procurementApply: { findFirst: jest.fn().mockResolvedValue(null) },
      procurementResult: { findFirst: jest.fn().mockResolvedValue(null) },
      researchScopeAdjust: { findFirst: jest.fn().mockResolvedValue(null) },
    };

    const service = new FinanceWorkflowService({} as any, prisma as any);
    await service.executeCommand(
      'approve',
      { businessNo: 'BX2026003', businessType: 'expense-claim', currentNode: '部门审批' },
      { realName: '系统管理员', userId: '1', username: 'admin' },
    );
    expect(prisma.expenseClaim.updateMany).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ flowNode: '财务审核', flowStatus: '1' }),
      }),
    );

    await service.executeCommand(
      'reject',
      { businessNo: 'BX2026003', businessType: 'expense-claim', currentNode: '财务审核' },
      { realName: '系统管理员', userId: '1', username: 'admin' },
    );
    expect(prisma.expenseClaim.updateMany).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ flowNode: '申请节点', flowStatus: '0' }),
      }),
    );
  });

  it('falls back to local business id when synthetic workflow numbers are used', async () => {
    const prisma = {
      approvalRecord: {
        create: jest.fn().mockResolvedValue({ id: BigInt(4) }),
      },
      authAdjustApply: { findFirst: jest.fn().mockResolvedValue(null) },
      contract: { findFirst: jest.fn().mockResolvedValue(null) },
      contractReceipt: { findFirst: jest.fn().mockResolvedValue(null) },
      expenseClaim: { findFirst: jest.fn().mockResolvedValue(null) },
      procurementApply: { findFirst: jest.fn().mockResolvedValue(null) },
      procurementResult: { findFirst: jest.fn().mockResolvedValue(null) },
      researchIndicator: { findFirst: jest.fn().mockResolvedValue(null) },
      researchScopeAdjust: { findFirst: jest.fn().mockResolvedValue(null) },
      researchProject: {
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      sysDept: { findUnique: jest.fn().mockResolvedValue({ deptName: '科研处' }) },
      sysUser: {
        findUnique: jest.fn().mockResolvedValue({
          deptId: BigInt(2),
          nickName: '管理员',
          userName: 'admin',
        }),
      },
    };

    const service = new FinanceWorkflowService({} as any, prisma as any);
    await service.executeCommand(
      'submit',
      {
        businessId: '88',
        businessNo: 'research-project-88',
        businessType: 'research-project',
        currentNode: '申请节点',
        title: '科研项目立项',
      },
      { realName: '系统管理员', userId: '1', username: 'admin' },
    );

    expect(prisma.researchProject.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ flowStatus: '1', updateBy: 'admin' }),
        where: {
          OR: [{ id: BigInt(88) }, { projectCode: 'research-project-88' }],
        },
      }),
    );
  });

  it('advances procurement apply biz node on submit and resets on withdraw', async () => {
    const prisma = {
      approvalRecord: {
        create: jest.fn().mockResolvedValue({ id: BigInt(5) }),
      },
      authAdjustApply: { findFirst: jest.fn().mockResolvedValue(null) },
      contract: { findFirst: jest.fn().mockResolvedValue(null) },
      contractReceipt: { findFirst: jest.fn().mockResolvedValue(null) },
      expenseClaim: { findFirst: jest.fn().mockResolvedValue(null) },
      procurementApply: {
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      procurementResult: { findFirst: jest.fn().mockResolvedValue(null) },
      researchIndicator: { findFirst: jest.fn().mockResolvedValue(null) },
      researchProject: { findFirst: jest.fn().mockResolvedValue(null) },
      researchScopeAdjust: { findFirst: jest.fn().mockResolvedValue(null) },
      sysDept: { findUnique: jest.fn().mockResolvedValue({ deptName: '采购处' }) },
      sysUser: {
        findUnique: jest.fn().mockResolvedValue({
          deptId: BigInt(2),
          nickName: '管理员',
          userName: 'admin',
        }),
      },
    };

    const service = new FinanceWorkflowService({} as any, prisma as any);
    await service.executeCommand(
      'submit',
      {
        businessNo: 'CG2026001',
        businessType: 'procurement-apply',
        currentNode: '申请节点',
      },
      { realName: '系统管理员', userId: '1', username: 'admin' },
    );
    expect(prisma.procurementApply.updateMany).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ bizNode: '采购审核', flowStatus: '1' }),
        where: { applyNo: 'CG2026001' },
      }),
    );

    await service.executeCommand(
      'withdraw',
      {
        businessNo: 'CG2026001',
        businessType: 'procurement-apply',
        currentNode: '采购审核',
      },
      { realName: '系统管理员', userId: '1', username: 'admin' },
    );
    expect(prisma.procurementApply.updateMany).toHaveBeenLastCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ bizNode: '申请节点', flowStatus: '0' }),
        where: { applyNo: 'CG2026001' },
      }),
    );
  });

  it('updates research scope adjust by local id when workflow commands are executed', async () => {
    const prisma = {
      approvalRecord: {
        create: jest.fn().mockResolvedValue({ id: BigInt(6) }),
      },
      authAdjustApply: { findFirst: jest.fn().mockResolvedValue(null) },
      contract: { findFirst: jest.fn().mockResolvedValue(null) },
      contractReceipt: { findFirst: jest.fn().mockResolvedValue(null) },
      expenseClaim: { findFirst: jest.fn().mockResolvedValue(null) },
      procurementApply: { findFirst: jest.fn().mockResolvedValue(null) },
      procurementResult: { findFirst: jest.fn().mockResolvedValue(null) },
      researchIndicator: { findFirst: jest.fn().mockResolvedValue(null) },
      researchProject: { findFirst: jest.fn().mockResolvedValue(null) },
      researchScopeAdjust: {
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      sysDept: { findUnique: jest.fn().mockResolvedValue({ deptName: '科研处' }) },
      sysUser: {
        findUnique: jest.fn().mockResolvedValue({
          deptId: BigInt(2),
          nickName: '管理员',
          userName: 'admin',
        }),
      },
    };

    const service = new FinanceWorkflowService({} as any, prisma as any);
    await service.executeCommand(
      'submit',
      {
        businessId: '66',
        businessNo: 'research-scope-adjust-66',
        businessType: 'research-scope-adjust',
      },
      { realName: '系统管理员', userId: '1', username: 'admin' },
    );

    expect(prisma.researchScopeAdjust.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ flowStatus: '1', updateBy: 'admin' }),
        where: { id: BigInt(66) },
      }),
    );
  });

  it('updates bid notice by local id when workflow commands are executed', async () => {
    const prisma = {
      approvalRecord: {
        create: jest.fn().mockResolvedValue({ id: BigInt(7) }),
      },
      authAdjustApply: { findFirst: jest.fn().mockResolvedValue(null) },
      bidNotice: {
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      contract: { findFirst: jest.fn().mockResolvedValue(null) },
      contractReceipt: { findFirst: jest.fn().mockResolvedValue(null) },
      expenseClaim: { findFirst: jest.fn().mockResolvedValue(null) },
      procurementApply: { findFirst: jest.fn().mockResolvedValue(null) },
      procurementResult: { findFirst: jest.fn().mockResolvedValue(null) },
      researchIndicator: { findFirst: jest.fn().mockResolvedValue(null) },
      researchProject: { findFirst: jest.fn().mockResolvedValue(null) },
      researchScopeAdjust: { findFirst: jest.fn().mockResolvedValue(null) },
      sysDept: { findUnique: jest.fn().mockResolvedValue({ deptName: '采购处' }) },
      sysUser: {
        findUnique: jest.fn().mockResolvedValue({
          deptId: BigInt(2),
          nickName: '管理员',
          userName: 'admin',
        }),
      },
    };

    const service = new FinanceWorkflowService({} as any, prisma as any);
    await service.executeCommand(
      'submit',
      {
        businessId: '77',
        businessNo: 'bid-notice-77',
        businessType: 'bid-notice',
      },
      { realName: '系统管理员', userId: '1', username: 'admin' },
    );

    expect(prisma.bidNotice.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ flowStatus: '1', updateBy: 'admin' }),
        where: { id: BigInt(77) },
      }),
    );
  });
});
