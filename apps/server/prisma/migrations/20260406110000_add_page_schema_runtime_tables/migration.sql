CREATE TABLE `sys_page_template` (
  `template_id` BIGINT NOT NULL AUTO_INCREMENT,
  `page_code` VARCHAR(100) NOT NULL,
  `page_name` VARCHAR(100) NOT NULL,
  `source_page_meta_id` BIGINT NULL,
  `schema_json` LONGTEXT NULL,
  `published_schema_json` LONGTEXT NULL,
  `current_version` INTEGER NULL DEFAULT 0,
  `status` CHAR(1) NULL DEFAULT '0',
  `create_by` VARCHAR(64) NULL,
  `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
  `update_by` VARCHAR(64) NULL,
  `update_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
  `remark` VARCHAR(500) NULL,
  UNIQUE INDEX `sys_page_template_page_code_key`(`page_code`),
  INDEX `idx_sys_page_template_status`(`status`),
  PRIMARY KEY (`template_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `sys_page_override` (
  `override_id` BIGINT NOT NULL AUTO_INCREMENT,
  `page_code` VARCHAR(100) NOT NULL,
  `tenant_id` INTEGER NOT NULL,
  `patch_json` LONGTEXT NULL,
  `published_patch_json` LONGTEXT NULL,
  `current_version` INTEGER NULL DEFAULT 0,
  `status` CHAR(1) NULL DEFAULT '0',
  `create_by` VARCHAR(64) NULL,
  `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
  `update_by` VARCHAR(64) NULL,
  `update_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
  `remark` VARCHAR(500) NULL,
  UNIQUE INDEX `uniq_sys_page_override_page_tenant`(`page_code`, `tenant_id`),
  INDEX `idx_sys_page_override_tenant_status`(`tenant_id`, `status`),
  PRIMARY KEY (`override_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `sys_user_page_preference` (
  `preference_id` BIGINT NOT NULL AUTO_INCREMENT,
  `page_code` VARCHAR(100) NOT NULL,
  `tenant_id` INTEGER NOT NULL DEFAULT 0,
  `user_id` BIGINT NOT NULL,
  `patch_json` LONGTEXT NULL,
  `published_patch_json` LONGTEXT NULL,
  `current_version` INTEGER NULL DEFAULT 0,
  `status` CHAR(1) NULL DEFAULT '0',
  `create_by` VARCHAR(64) NULL,
  `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
  `update_by` VARCHAR(64) NULL,
  `update_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
  `remark` VARCHAR(500) NULL,
  UNIQUE INDEX `uniq_sys_user_page_preference_page_tenant_user`(`page_code`, `tenant_id`, `user_id`),
  INDEX `idx_sys_user_page_preference_scope`(`tenant_id`, `user_id`, `status`),
  PRIMARY KEY (`preference_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `sys_page_publish_log` (
  `log_id` BIGINT NOT NULL AUTO_INCREMENT,
  `page_code` VARCHAR(100) NOT NULL,
  `scope_type` VARCHAR(20) NOT NULL,
  `scope_key` VARCHAR(100) NOT NULL DEFAULT '',
  `target_id` BIGINT NULL,
  `version_no` INTEGER NOT NULL DEFAULT 1,
  `action_type` VARCHAR(20) NOT NULL DEFAULT 'publish',
  `snapshot_json` LONGTEXT NULL,
  `operator_name` VARCHAR(64) NULL,
  `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
  `remark` VARCHAR(500) NULL,
  INDEX `idx_sys_page_publish_log_scope`(`page_code`, `scope_type`, `scope_key`),
  INDEX `idx_sys_page_publish_log_target`(`target_id`),
  PRIMARY KEY (`log_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
