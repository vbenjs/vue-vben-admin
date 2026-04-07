CREATE TABLE `sys_tenant_policy` (
  `policy_id` BIGINT NOT NULL AUTO_INCREMENT,
  `tenant_id` INTEGER NOT NULL,
  `module_code` VARCHAR(50) NOT NULL,
  `scene_code` VARCHAR(100) NOT NULL,
  `policy_type` VARCHAR(50) NOT NULL DEFAULT 'pageRuntime',
  `policy_json` LONGTEXT NULL,
  `published_policy_json` LONGTEXT NULL,
  `current_version` INTEGER NOT NULL DEFAULT 0,
  `status` VARCHAR(1) NOT NULL DEFAULT '0',
  `remark` VARCHAR(255) NULL,
  `create_by` VARCHAR(64) NULL,
  `create_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `update_by` VARCHAR(64) NULL,
  `update_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE INDEX `uniq_sys_tenant_policy_scope`(
    `tenant_id`,
    `module_code`,
    `scene_code`,
    `policy_type`
  ),
  INDEX `idx_sys_tenant_policy_tenant_status`(`tenant_id`, `status`),
  PRIMARY KEY (`policy_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `sys_tenant_policy_log` (
  `log_id` BIGINT NOT NULL AUTO_INCREMENT,
  `target_id` BIGINT NULL,
  `tenant_id` INTEGER NOT NULL,
  `module_code` VARCHAR(50) NOT NULL,
  `scene_code` VARCHAR(100) NOT NULL,
  `policy_type` VARCHAR(50) NOT NULL DEFAULT 'pageRuntime',
  `action_type` VARCHAR(20) NOT NULL,
  `version_no` INTEGER NOT NULL,
  `snapshot_json` LONGTEXT NOT NULL,
  `operator_name` VARCHAR(64) NOT NULL,
  `remark` VARCHAR(255) NULL,
  `create_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX `idx_sys_tenant_policy_log_scope`(
    `tenant_id`,
    `scene_code`,
    `policy_type`
  ),
  PRIMARY KEY (`log_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
