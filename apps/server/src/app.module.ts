import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppMenuModule } from './app-menu/app-menu.module';
import { AppUserModule } from './app-user/app-user.module';
import { AuthAdjustApplyModule } from './auth-adjust-apply/auth-adjust-apply.module';
import { ContractEvaluationModule } from './contract-evaluation/contract-evaluation.module';
import { ContractReceiptModule } from './contract-receipt/contract-receipt.module';
import { ContractReleaseModule } from './contract-release/contract-release.module';
import { ContractModule } from './contract/contract.module';
import { BidNoticeModule } from './bid-notice/bid-notice.module';
import { BudgetIndicatorModule } from './budget-indicator/budget-indicator.module';
import { ContractorModule } from './contractor/contractor.module';
import { EngineeringProjectModule } from './engineering-project/engineering-project.module';
import { ExpertModule } from './expert/expert.module';
import { FinancePaymentModule } from './finance-payment/finance-payment.module';
import { FinanceReimbursementModule } from './finance-reimbursement/finance-reimbursement.module';
import { FinanceVoucherModule } from './finance-voucher/finance-voucher.module';
import { FinanceWorkflowModule } from './finance-workflow/finance-workflow.module';
import { IndicatorAdjustModule } from './indicator-adjust/indicator-adjust.module';
import { IndicatorAuthModule } from './indicator-auth/indicator-auth.module';
import { IncomeSettlementModule } from './income-settlement/income-settlement.module';
import { InvoiceFolderModule } from './invoice-folder/invoice-folder.module';
import { IndicatorTemplateModule } from './indicator-template/indicator-template.module';
import { IndicatorTransferModule } from './indicator-transfer/indicator-transfer.module';
import { LegacySqlModule } from './legacy-sql/legacy-sql.module';
import { ProcurementApplyModule } from './procurement-apply/procurement-apply.module';
import { ProcurementReleaseModule } from './procurement-release/procurement-release.module';
import { ProcurementResultModule } from './procurement-result/procurement-result.module';
import { ProjectLevel1Module } from './project-level1/project-level1.module';
import { ProjectLevel2Module } from './project-level2/project-level2.module';
import { AuthModule } from './auth/auth.module';
import { ExpenseClaimDetailModule } from './expense-claim-detail/expense-claim-detail.module';
import { ExpenseClaimModule } from './expense-claim/expense-claim.module';
import { ExpensePayeeModule } from './expense-payee/expense-payee.module';
import { ExpensePayerModule } from './expense-payer/expense-payer.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';
import { RequestContextMiddleware } from './common/request-context/request-context.middleware';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { ResearchFundArrivalModule } from './research-fund-arrival/research-fund-arrival.module';
import { ResearchExpenseScopeModule } from './research-expense-scope/research-expense-scope.module';
import { ResearchFundClaimModule } from './research-fund-claim/research-fund-claim.module';
import { ResearchIndicatorModule } from './research-indicator/research-indicator.module';
import { ResearchScopeAdjustModule } from './research-scope-adjust/research-scope-adjust.module';
import { ResearchProjectModule } from './research-project/research-project.module';
import { SysApprovalProcessModule } from './sys-approval-process/sys-approval-process.module';
import { SysConfigModule } from './sys-config/sys-config.module';
import { SysDashboardModule } from './sys-dashboard/sys-dashboard.module';
import { SysDeptModule } from './sys-dept/sys-dept.module';
import { SysDictModule } from './sys-dict/sys-dict.module';
import { SysDocCodeModule } from './sys-doc-code/sys-doc-code.module';
import { SysFormDataModule } from './sys-form-data/sys-form-data.module';
import { SysFormDesignModule } from './sys-form-design/sys-form-design.module';
import { SysGenModule } from './sys-gen/sys-gen.module';
import { SysJobModule } from './sys-job/sys-job.module';
import { SysLogininforModule } from './sys-logininfor/sys-logininfor.module';
import { SysMenuModule } from './sys-menu/sys-menu.module';
import { SysOperLogModule } from './sys-oper-log/sys-oper-log.module';
import { SysPostModule } from './sys-post/sys-post.module';
import { SysPrintDesignModule } from './sys-print-design/sys-print-design.module';
import { SysRoleModule } from './sys-role/sys-role.module';
import { SysTenantModule } from './sys-tenant/sys-tenant.module';
import { SysUserModule } from './sys-user/sys-user.module';
import { SupplierModule } from './supplier/supplier.module';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    // 指标管理模块（新增）
    AuthAdjustApplyModule,
    BudgetIndicatorModule,
    IndicatorAdjustModule,
    IndicatorAuthModule,
    IndicatorTemplateModule,
    IndicatorTransferModule,
    ProjectLevel1Module,
    ProjectLevel2Module,
    // 科研项目模块（已有）
    ResearchExpenseScopeModule,
    ResearchFundArrivalModule,
    ResearchFundClaimModule,
    ResearchIndicatorModule,
    ResearchProjectModule,
    ResearchScopeAdjustModule,
    // 合同/采购等模块（已有）
    ContractEvaluationModule,
    ContractReceiptModule,
    ContractReleaseModule,
    ContractModule,
    ExpenseClaimDetailModule,
    ExpenseClaimModule,
    ExpensePayeeModule,
    ExpensePayerModule,
    PaymentMethodModule,
    BidNoticeModule,
    ContractorModule,
    EngineeringProjectModule,
    ExpertModule,
    FinancePaymentModule,
    FinanceReimbursementModule,
    FinanceVoucherModule,
    FinanceWorkflowModule,
    IncomeSettlementModule,
    InvoiceFolderModule,
    LegacySqlModule,
    ProcurementApplyModule,
    ProcurementResultModule,
    ProcurementReleaseModule,
    SupplierModule,
    // 系统模块（已有）
    AuthModule,
    AppMenuModule,
    AppUserModule,
    SysConfigModule,
    SysDictModule,
    SysDeptModule,
    SysRoleModule,
    SysMenuModule,
    SysUserModule,
    SysPostModule,
    SysTenantModule,
    SysOperLogModule,
    SysLogininforModule,
    SysJobModule,
    SysDocCodeModule,
    SysFormDesignModule,
    SysApprovalProcessModule,
    SysPrintDesignModule,
    SysGenModule,
    SysDashboardModule,
    SysFormDataModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}

