-- CreateTable
CREATE TABLE `sys_param_config` (
    `config_id` INTEGER NOT NULL AUTO_INCREMENT,
    `config_name` VARCHAR(100) NULL DEFAULT '',
    `config_key` VARCHAR(100) NOT NULL,
    `config_value` VARCHAR(500) NULL DEFAULT '',
    `ui_type` VARCHAR(50) NULL DEFAULT 'text',
    `config_type` CHAR(1) NULL DEFAULT 'N',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    UNIQUE INDEX `sys_param_config_config_key_key`(`config_key`),
    PRIMARY KEY (`config_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_dict_type` (
    `dict_id` BIGINT NOT NULL AUTO_INCREMENT,
    `dict_name` VARCHAR(100) NULL DEFAULT '',
    `dict_type` VARCHAR(100) NOT NULL,
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    UNIQUE INDEX `sys_dict_type_dict_type_key`(`dict_type`),
    PRIMARY KEY (`dict_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_dict_data` (
    `dict_code` BIGINT NOT NULL AUTO_INCREMENT,
    `dict_sort` INTEGER NULL DEFAULT 0,
    `dict_label` VARCHAR(100) NULL DEFAULT '',
    `dict_value` VARCHAR(100) NULL DEFAULT '',
    `dict_type` VARCHAR(100) NULL DEFAULT '',
    `list_class` VARCHAR(100) NULL DEFAULT 'default',
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`dict_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_tenant` (
    `tenant_id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenant_name` VARCHAR(100) NULL DEFAULT '',
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`tenant_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_dept` (
    `dept_id` INTEGER NOT NULL AUTO_INCREMENT,
    `parent_id` INTEGER NULL DEFAULT 0,
    `ancestors` VARCHAR(100) NULL DEFAULT '',
    `dept_name` VARCHAR(50) NULL DEFAULT '',
    `dept_code` VARCHAR(64) NULL DEFAULT '',
    `dept_type` CHAR(1) NULL DEFAULT '0',
    `order_num` INTEGER NULL DEFAULT 0,
    `leader` VARCHAR(20) NULL DEFAULT '',
    `phone` VARCHAR(11) NULL DEFAULT '',
    `email` VARCHAR(50) NULL DEFAULT '',
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`dept_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_post` (
    `post_id` INTEGER NOT NULL AUTO_INCREMENT,
    `post_code` VARCHAR(64) NOT NULL,
    `post_name` VARCHAR(50) NOT NULL,
    `post_sort` INTEGER NOT NULL,
    `status` CHAR(1) NOT NULL,
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`post_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_role` (
    `role_id` INTEGER NOT NULL AUTO_INCREMENT,
    `role_name` VARCHAR(30) NOT NULL,
    `role_key` VARCHAR(100) NOT NULL,
    `role_sort` INTEGER NOT NULL,
    `data_scope` CHAR(1) NULL DEFAULT '1',
    `menu_check_strictly` BOOLEAN NULL DEFAULT true,
    `dept_check_strictly` BOOLEAN NULL DEFAULT true,
    `status` CHAR(1) NOT NULL,
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_menu` (
    `menu_id` INTEGER NOT NULL AUTO_INCREMENT,
    `menu_name` VARCHAR(50) NOT NULL,
    `parent_id` INTEGER NULL DEFAULT 0,
    `order_num` INTEGER NULL DEFAULT 0,
    `path` VARCHAR(200) NULL DEFAULT '',
    `component` VARCHAR(255) NULL DEFAULT '',
    `query` VARCHAR(255) NULL DEFAULT '',
    `is_frame` INTEGER NULL DEFAULT 1,
    `is_cache` INTEGER NULL DEFAULT 0,
    `menu_type` CHAR(1) NULL DEFAULT '',
    `visible` CHAR(1) NULL DEFAULT '0',
    `status` CHAR(1) NULL DEFAULT '0',
    `perms` VARCHAR(100) NULL DEFAULT '',
    `icon` VARCHAR(100) NULL DEFAULT '#',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`menu_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_user` (
    `user_id` BIGINT NOT NULL AUTO_INCREMENT,
    `dept_id` BIGINT NULL,
    `user_name` VARCHAR(30) NOT NULL,
    `nick_name` VARCHAR(30) NOT NULL,
    `user_type` VARCHAR(2) NULL DEFAULT '00',
    `email` VARCHAR(50) NULL DEFAULT '',
    `phonenumber` VARCHAR(11) NULL DEFAULT '',
    `sex` CHAR(1) NULL DEFAULT '0',
    `avatar` VARCHAR(255) NULL DEFAULT '',
    `password` VARCHAR(100) NULL DEFAULT '',
    `status` CHAR(1) NULL DEFAULT '0',
    `login_ip` VARCHAR(128) NULL DEFAULT '',
    `login_date` DATETIME(3) NULL,
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    UNIQUE INDEX `sys_user_user_name_key`(`user_name`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_oper_log` (
    `oper_id` BIGINT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(50) NULL DEFAULT '',
    `business_type` INTEGER NULL DEFAULT 0,
    `method` VARCHAR(100) NULL DEFAULT '',
    `request_method` VARCHAR(10) NULL DEFAULT '',
    `operator_type` INTEGER NULL DEFAULT 0,
    `oper_name` VARCHAR(50) NULL DEFAULT '',
    `dept_name` VARCHAR(50) NULL DEFAULT '',
    `oper_url` VARCHAR(255) NULL DEFAULT '',
    `oper_ip` VARCHAR(128) NULL DEFAULT '',
    `oper_location` VARCHAR(255) NULL DEFAULT '',
    `oper_param` TEXT NULL,
    `json_result` TEXT NULL,
    `status` INTEGER NULL DEFAULT 0,
    `error_msg` TEXT NULL,
    `oper_time` DATETIME(3) NULL,
    `cost_time` BIGINT NULL DEFAULT 0,

    PRIMARY KEY (`oper_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_logininfor` (
    `info_id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_name` VARCHAR(50) NULL DEFAULT '',
    `ipaddr` VARCHAR(128) NULL DEFAULT '',
    `login_location` VARCHAR(255) NULL DEFAULT '',
    `browser` VARCHAR(50) NULL DEFAULT '',
    `os` VARCHAR(50) NULL DEFAULT '',
    `status` CHAR(1) NULL DEFAULT '0',
    `msg` VARCHAR(255) NULL DEFAULT '',
    `login_time` DATETIME(3) NULL,

    PRIMARY KEY (`info_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_job` (
    `job_id` BIGINT NOT NULL AUTO_INCREMENT,
    `job_name` VARCHAR(64) NOT NULL DEFAULT '',
    `job_group` VARCHAR(64) NOT NULL DEFAULT 'DEFAULT',
    `invoke_target` VARCHAR(500) NOT NULL,
    `cron_expression` VARCHAR(255) NULL DEFAULT '',
    `misfire_policy` VARCHAR(20) NULL DEFAULT '3',
    `concurrent` CHAR(1) NULL DEFAULT '1',
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`job_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_doc_code` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rule_code` VARCHAR(64) NOT NULL,
    `rule_name` VARCHAR(100) NOT NULL,
    `prefix` VARCHAR(20) NULL,
    `date_format` VARCHAR(20) NULL,
    `serial_len` INTEGER NOT NULL DEFAULT 4,
    `current_val` BIGINT NOT NULL DEFAULT 0,
    `step` INTEGER NOT NULL DEFAULT 1,
    `create_by` VARCHAR(64) NULL,
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL,
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    UNIQUE INDEX `sys_doc_code_rule_code_key`(`rule_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_form_design` (
    `form_id` BIGINT NOT NULL AUTO_INCREMENT,
    `form_name` VARCHAR(100) NOT NULL,
    `form_type` CHAR(1) NULL DEFAULT '0',
    `form_content` LONGTEXT NULL,
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL,
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL,
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`form_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_form_data` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `form_id` BIGINT NOT NULL,
    `form_data` LONGTEXT NOT NULL,
    `create_by` VARCHAR(64) NULL,
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL,
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_approval_process` (
    `process_id` BIGINT NOT NULL AUTO_INCREMENT,
    `process_name` VARCHAR(100) NOT NULL,
    `form_id` BIGINT NULL,
    `flow_nodes` LONGTEXT NULL,
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL,
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL,
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`process_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_print_design` (
    `print_id` BIGINT NOT NULL AUTO_INCREMENT,
    `print_name` VARCHAR(100) NOT NULL,
    `print_code` VARCHAR(64) NULL DEFAULT '',
    `print_content` LONGTEXT NULL,
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL,
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL,
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`print_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_gen_table` (
    `table_id` BIGINT NOT NULL AUTO_INCREMENT,
    `table_name` VARCHAR(200) NOT NULL,
    `table_comment` VARCHAR(500) NULL,
    `class_name` VARCHAR(100) NULL,
    `tpl_category` VARCHAR(200) NULL DEFAULT 'crud',
    `package_name` VARCHAR(100) NULL,
    `module_name` VARCHAR(30) NULL,
    `business_name` VARCHAR(30) NULL,
    `function_name` VARCHAR(50) NULL,
    `function_author` VARCHAR(50) NULL,
    `gen_type` CHAR(1) NULL DEFAULT '0',
    `gen_path` VARCHAR(200) NULL DEFAULT '/',
    `options` VARCHAR(1000) NULL,
    `create_by` VARCHAR(64) NULL,
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL,
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`table_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_gen_column` (
    `column_id` BIGINT NOT NULL AUTO_INCREMENT,
    `table_id` BIGINT NOT NULL,
    `column_name` VARCHAR(200) NOT NULL,
    `column_comment` VARCHAR(500) NULL,
    `column_type` VARCHAR(100) NULL,
    `ts_type` VARCHAR(500) NULL,
    `ts_field` VARCHAR(200) NULL,
    `is_pk` CHAR(1) NULL DEFAULT '0',
    `is_increment` CHAR(1) NULL DEFAULT '0',
    `is_required` CHAR(1) NULL DEFAULT '0',
    `is_insert` CHAR(1) NULL DEFAULT '1',
    `is_edit` CHAR(1) NULL DEFAULT '1',
    `is_list` CHAR(1) NULL DEFAULT '1',
    `is_query` CHAR(1) NULL DEFAULT '0',
    `query_type` VARCHAR(200) NULL DEFAULT 'EQ',
    `html_type` VARCHAR(200) NULL DEFAULT 'input',
    `dict_type` VARCHAR(200) NULL,
    `sort` INTEGER NULL,
    `create_by` VARCHAR(64) NULL,
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL,
    `update_time` DATETIME(3) NULL,

    INDEX `idx_sys_gen_table_id`(`table_id`),
    PRIMARY KEY (`column_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_level1` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `dept_id` BIGINT NULL,
    `dept_name` VARCHAR(100) NULL DEFAULT '',
    `project_code` VARCHAR(64) NULL DEFAULT '',
    `project_name` VARCHAR(200) NULL DEFAULT '',
    `expend_category` VARCHAR(100) NULL DEFAULT '',
    `func_category` VARCHAR(200) NULL DEFAULT '',
    `is_gov_procure` CHAR(1) NULL DEFAULT '0',
    `fund_source` VARCHAR(200) NULL DEFAULT '',
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_level2` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `dept_id` BIGINT NULL,
    `dept_name` VARCHAR(100) NULL DEFAULT '',
    `level1_id` BIGINT NULL,
    `project_code` VARCHAR(64) NULL DEFAULT '',
    `project_name` VARCHAR(200) NULL DEFAULT '',
    `expend_category` VARCHAR(100) NULL DEFAULT '',
    `func_category` VARCHAR(200) NULL DEFAULT '',
    `is_gov_procure` CHAR(1) NULL DEFAULT '0',
    `fund_source` VARCHAR(200) NULL DEFAULT '',
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `budget_indicator` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `dept_id` BIGINT NULL,
    `dept_name` VARCHAR(100) NULL DEFAULT '',
    `indicator_code` VARCHAR(64) NULL DEFAULT '',
    `indicator_name` VARCHAR(200) NULL DEFAULT '',
    `indicator_type` CHAR(1) NULL DEFAULT '1',
    `expend_category` VARCHAR(100) NULL DEFAULT '',
    `level1_id` BIGINT NULL,
    `level2_id` BIGINT NULL,
    `func_category` VARCHAR(200) NULL DEFAULT '',
    `econ_category` VARCHAR(200) NULL DEFAULT '',
    `fund_source` VARCHAR(200) NULL DEFAULT '',
    `income_method` VARCHAR(100) NULL DEFAULT '',
    `is_pre_apply` CHAR(1) NULL DEFAULT '0',
    `is_allow_transfer` CHAR(1) NULL DEFAULT '1',
    `is_gov_procure` CHAR(1) NULL DEFAULT '0',
    `procure_category` VARCHAR(200) NULL DEFAULT '',
    `indicator_doc_no` VARCHAR(100) NULL DEFAULT '',
    `account_subject` VARCHAR(100) NULL DEFAULT '',
    `year_begin_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `year_total_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `frozen_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `paid_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `available_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `transfer_out_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `transfer_in_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `budget_total_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `indicator_source` VARCHAR(100) NULL DEFAULT '',
    `is_frozen` CHAR(1) NULL DEFAULT '0',
    `indicator_status` CHAR(1) NULL DEFAULT '0',
    `voucher_status` VARCHAR(20) NULL DEFAULT '',
    `voucher_month` VARCHAR(10) NULL DEFAULT '',
    `voucher_no` VARCHAR(50) NULL DEFAULT '',
    `research_project_id` BIGINT NULL,
    `research_code` VARCHAR(64) NULL DEFAULT '',
    `research_name` VARCHAR(200) NULL DEFAULT '',
    `research_category` VARCHAR(100) NULL DEFAULT '',
    `project_manager` VARCHAR(50) NULL DEFAULT '',
    `start_year` VARCHAR(10) NULL DEFAULT '',
    `end_year` VARCHAR(10) NULL DEFAULT '',
    `research_total` DECIMAL(18, 2) NULL DEFAULT 0,
    `auth_dept_name` VARCHAR(100) NULL DEFAULT '',
    `del_flag` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `indicator_auth` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `indicator_id` BIGINT NULL,
    `auth_type` CHAR(1) NULL DEFAULT '1',
    `auth_dept_id` BIGINT NULL,
    `auth_dept_name` VARCHAR(100) NULL DEFAULT '',
    `auth_user_id` BIGINT NULL,
    `auth_user_name` VARCHAR(50) NULL DEFAULT '',
    `auth_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `used_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `control_mode` CHAR(1) NULL DEFAULT '1',
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `indicator_adjust` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `adjust_no` VARCHAR(64) NULL DEFAULT '',
    `indicator_id` BIGINT NULL,
    `indicator_code` VARCHAR(64) NULL DEFAULT '',
    `indicator_name` VARCHAR(200) NULL DEFAULT '',
    `dept_id` BIGINT NULL,
    `dept_name` VARCHAR(100) NULL DEFAULT '',
    `adjust_type` CHAR(1) NULL DEFAULT '1',
    `adjust_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `operator_name` VARCHAR(50) NULL DEFAULT '',
    `adjust_date` DATETIME(3) NULL,
    `is_void` CHAR(1) NULL DEFAULT '0',
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `indicator_transfer` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `transfer_no` VARCHAR(64) NULL DEFAULT '',
    `transfer_total_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `out_dept_id` BIGINT NULL,
    `out_dept_name` VARCHAR(100) NULL DEFAULT '',
    `out_indicator_id` BIGINT NULL,
    `out_indicator_name` VARCHAR(200) NULL DEFAULT '',
    `out_func_category` VARCHAR(200) NULL DEFAULT '',
    `out_econ_category` VARCHAR(200) NULL DEFAULT '',
    `out_fund_source` VARCHAR(200) NULL DEFAULT '',
    `out_is_gov_procure` CHAR(1) NULL DEFAULT '0',
    `out_before_year_total` DECIMAL(18, 2) NULL DEFAULT 0,
    `out_transfer_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `out_after_available` DECIMAL(18, 2) NULL DEFAULT 0,
    `out_after_year_total` DECIMAL(18, 2) NULL DEFAULT 0,
    `in_dept_id` BIGINT NULL,
    `in_dept_name` VARCHAR(100) NULL DEFAULT '',
    `in_indicator_id` BIGINT NULL,
    `in_indicator_name` VARCHAR(200) NULL DEFAULT '',
    `in_func_category` VARCHAR(200) NULL DEFAULT '',
    `in_econ_category` VARCHAR(200) NULL DEFAULT '',
    `in_fund_source` VARCHAR(200) NULL DEFAULT '',
    `in_is_gov_procure` CHAR(1) NULL DEFAULT '0',
    `in_before_year_total` DECIMAL(18, 2) NULL DEFAULT 0,
    `in_transfer_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `in_after_available` DECIMAL(18, 2) NULL DEFAULT 0,
    `in_after_year_total` DECIMAL(18, 2) NULL DEFAULT 0,
    `operator_name` VARCHAR(50) NULL DEFAULT '',
    `transfer_date` DATETIME(3) NULL,
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `auth_adjust_apply` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `apply_no` VARCHAR(64) NULL DEFAULT '',
    `apply_date` DATETIME(3) NULL,
    `apply_dept_id` BIGINT NULL,
    `apply_dept_name` VARCHAR(100) NULL DEFAULT '',
    `indicator_id` BIGINT NULL,
    `indicator_name` VARCHAR(200) NULL DEFAULT '',
    `indicator_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `precise_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `apply_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `operator_name` VARCHAR(50) NULL DEFAULT '',
    `fund_usage` VARCHAR(500) NULL DEFAULT '',
    `flow_status` CHAR(1) NULL DEFAULT '0',
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `indicator_template` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `template_name` VARCHAR(100) NULL DEFAULT '',
    `template_code` VARCHAR(64) NULL DEFAULT '',
    `is_enabled` CHAR(1) NULL DEFAULT '1',
    `sort_order` INTEGER NULL DEFAULT 0,
    `alias` VARCHAR(100) NULL DEFAULT '',
    `is_required` CHAR(1) NULL DEFAULT '0',
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `research_project` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `dept_id` BIGINT NULL,
    `dept_name` VARCHAR(100) NULL DEFAULT '',
    `project_code` VARCHAR(64) NULL DEFAULT '',
    `project_name` VARCHAR(200) NULL DEFAULT '',
    `project_type` VARCHAR(50) NULL DEFAULT '',
    `project_source` VARCHAR(100) NULL DEFAULT '',
    `apply_year` VARCHAR(10) NULL DEFAULT '',
    `start_date` DATETIME(3) NULL,
    `end_date` DATETIME(3) NULL,
    `total_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `func_category` VARCHAR(200) NULL DEFAULT '',
    `fund_source` VARCHAR(200) NULL DEFAULT '',
    `project_manager` VARCHAR(50) NULL DEFAULT '',
    `manager_dept_id` BIGINT NULL,
    `manager_dept_name` VARCHAR(100) NULL DEFAULT '',
    `project_status` CHAR(1) NULL DEFAULT '0',
    `is_established` CHAR(1) NULL DEFAULT '0',
    `establish_date` DATETIME(3) NULL,
    `is_closed` CHAR(1) NULL DEFAULT '0',
    `close_date` DATETIME(3) NULL,
    `flow_status` CHAR(1) NULL DEFAULT '0',
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `research_fund_arrival` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `dept_id` BIGINT NULL,
    `dept_name` VARCHAR(100) NULL DEFAULT '',
    `arrival_date` DATETIME(3) NULL,
    `arrival_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `payee_name` VARCHAR(100) NULL DEFAULT '',
    `payee_account` VARCHAR(64) NULL DEFAULT '',
    `payee_bank` VARCHAR(100) NULL DEFAULT '',
    `is_released` CHAR(1) NULL DEFAULT '0',
    `release_date` DATETIME(3) NULL,
    `claimed_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `research_fund_claim` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `arrival_id` BIGINT NULL,
    `project_id` BIGINT NULL,
    `project_name` VARCHAR(200) NULL DEFAULT '',
    `indicator_id` BIGINT NULL,
    `indicator_name` VARCHAR(200) NULL DEFAULT '',
    `claim_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `claim_date` DATETIME(3) NULL,
    `is_claimed` CHAR(1) NULL DEFAULT '0',
    `operator_name` VARCHAR(50) NULL DEFAULT '',
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `research_indicator` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `dept_id` BIGINT NULL,
    `dept_name` VARCHAR(100) NULL DEFAULT '',
    `project_id` BIGINT NULL,
    `project_name` VARCHAR(200) NULL DEFAULT '',
    `indicator_code` VARCHAR(64) NULL DEFAULT '',
    `indicator_name` VARCHAR(200) NULL DEFAULT '',
    `indicator_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `used_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `available_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `flow_status` CHAR(1) NULL DEFAULT '0',
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `research_expense_scope` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `indicator_id` BIGINT NULL,
    `scope_name` VARCHAR(200) NULL DEFAULT '',
    `scope_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `used_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `available_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `research_scope_adjust` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `indicator_id` BIGINT NULL,
    `indicator_name` VARCHAR(200) NULL DEFAULT '',
    `out_scope_id` BIGINT NULL,
    `out_scope_name` VARCHAR(200) NULL DEFAULT '',
    `out_adjust_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `in_scope_id` BIGINT NULL,
    `in_scope_name` VARCHAR(200) NULL DEFAULT '',
    `in_adjust_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `flow_status` CHAR(1) NULL DEFAULT '0',
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `procurement_apply` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `apply_no` VARCHAR(64) NULL DEFAULT '',
    `dept_id` BIGINT NULL,
    `dept_name` VARCHAR(100) NULL DEFAULT '',
    `unit_name` VARCHAR(100) NULL DEFAULT '',
    `project_name` VARCHAR(200) NULL DEFAULT '',
    `procure_type` VARCHAR(50) NULL DEFAULT '',
    `procure_method` VARCHAR(50) NULL DEFAULT '',
    `procure_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `apply_date` DATETIME(3) NULL,
    `operator_name` VARCHAR(50) NULL DEFAULT '',
    `fill_type` VARCHAR(50) NULL DEFAULT '',
    `biz_node` VARCHAR(50) NULL DEFAULT '',
    `is_aborted` CHAR(1) NULL DEFAULT '0',
    `flow_status` CHAR(1) NULL DEFAULT '0',
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `procurement_result` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `apply_id` BIGINT NULL,
    `apply_no` VARCHAR(64) NULL DEFAULT '',
    `project_name` VARCHAR(200) NULL DEFAULT '',
    `win_bid_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `win_bid_supplier` VARCHAR(200) NULL DEFAULT '',
    `credit_code` VARCHAR(64) NULL DEFAULT '',
    `input_status` CHAR(1) NULL DEFAULT '0',
    `flow_status` CHAR(1) NULL DEFAULT '0',
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `procurement_release` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `apply_id` BIGINT NULL,
    `apply_no` VARCHAR(64) NULL DEFAULT '',
    `project_name` VARCHAR(200) NULL DEFAULT '',
    `unit_name` VARCHAR(100) NULL DEFAULT '',
    `procure_apply_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `win_bid_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `contract_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `expense_used_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `released_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `release_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `release_date` DATETIME(3) NULL,
    `release_status` CHAR(1) NULL DEFAULT '0',
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `supplier` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `supplier_code` VARCHAR(64) NULL DEFAULT '',
    `supplier_name` VARCHAR(200) NULL DEFAULT '',
    `procure_type` VARCHAR(50) NULL DEFAULT '',
    `credit_code` VARCHAR(64) NULL DEFAULT '',
    `enterprise_type` VARCHAR(50) NULL DEFAULT '',
    `registered_capital` DECIMAL(18, 2) NULL DEFAULT 0,
    `is_abnormal` CHAR(1) NULL DEFAULT '0',
    `supplier_address` VARCHAR(500) NULL DEFAULT '',
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contract` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `contract_apply_no` VARCHAR(64) NULL DEFAULT '',
    `contract_no` VARCHAR(64) NULL DEFAULT '',
    `contract_name` VARCHAR(200) NULL DEFAULT '',
    `project_name` VARCHAR(200) NULL DEFAULT '',
    `contract_category` VARCHAR(50) NULL DEFAULT '',
    `procure_method` VARCHAR(50) NULL DEFAULT '',
    `procure_type` VARCHAR(50) NULL DEFAULT '',
    `contract_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `settlement_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `expense_used_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `unexpense_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `released_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `party_a_unit` VARCHAR(200) NULL DEFAULT '',
    `party_b_unit` VARCHAR(200) NULL DEFAULT '',
    `enterprise_type` VARCHAR(50) NULL DEFAULT '',
    `sign_date` DATETIME(3) NULL,
    `start_date` DATETIME(3) NULL,
    `end_date` DATETIME(3) NULL,
    `fill_type` VARCHAR(50) NULL DEFAULT '',
    `biz_node` VARCHAR(50) NULL DEFAULT '',
    `is_aborted` CHAR(1) NULL DEFAULT '0',
    `is_seal_applied` CHAR(1) NULL DEFAULT '0',
    `is_scan_uploaded` CHAR(1) NULL DEFAULT '0',
    `acceptance_status` CHAR(1) NULL DEFAULT '0',
    `acceptance_user` VARCHAR(50) NULL DEFAULT '',
    `evaluation_status` CHAR(1) NULL DEFAULT '0',
    `flow_status` CHAR(1) NULL DEFAULT '0',
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contract_receipt` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `receipt_no` VARCHAR(64) NULL DEFAULT '',
    `contract_id` BIGINT NULL,
    `contract_no` VARCHAR(64) NULL DEFAULT '',
    `contract_name` VARCHAR(200) NULL DEFAULT '',
    `procure_type` VARCHAR(50) NULL DEFAULT '',
    `procure_method` VARCHAR(50) NULL DEFAULT '',
    `contract_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `operator_name` VARCHAR(50) NULL DEFAULT '',
    `receipt_unit` VARCHAR(200) NULL DEFAULT '',
    `receipt_date` DATETIME(3) NULL,
    `receipt_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `fill_date` DATETIME(3) NULL,
    `flow_node` VARCHAR(50) NULL DEFAULT '',
    `flow_status` CHAR(1) NULL DEFAULT '0',
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contract_release` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `contract_id` BIGINT NULL,
    `contract_no` VARCHAR(64) NULL DEFAULT '',
    `contract_name` VARCHAR(200) NULL DEFAULT '',
    `contract_category` VARCHAR(50) NULL DEFAULT '',
    `party_a_unit` VARCHAR(200) NULL DEFAULT '',
    `party_b_unit` VARCHAR(200) NULL DEFAULT '',
    `contract_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `expense_used_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `releasable_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `release_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `release_date` DATETIME(3) NULL,
    `release_status` CHAR(1) NULL DEFAULT '0',
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contract_evaluation` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `contract_id` BIGINT NULL,
    `contract_apply_no` VARCHAR(64) NULL DEFAULT '',
    `contract_no` VARCHAR(64) NULL DEFAULT '',
    `contract_name` VARCHAR(200) NULL DEFAULT '',
    `project_name` VARCHAR(200) NULL DEFAULT '',
    `contract_category` VARCHAR(50) NULL DEFAULT '',
    `procure_method` VARCHAR(50) NULL DEFAULT '',
    `contract_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `procure_type` VARCHAR(50) NULL DEFAULT '',
    `party_a_unit` VARCHAR(200) NULL DEFAULT '',
    `party_b_unit` VARCHAR(200) NULL DEFAULT '',
    `evaluator` VARCHAR(50) NULL DEFAULT '',
    `evaluation_level` VARCHAR(20) NULL DEFAULT '',
    `evaluation_date` DATETIME(3) NULL,
    `evaluation_content` TEXT NULL,
    `evaluation_status` CHAR(1) NULL DEFAULT '0',
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `expense_claim` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `claim_no` VARCHAR(64) NULL DEFAULT '',
    `claim_type` VARCHAR(50) NULL DEFAULT '',
    `claim_date` DATETIME(3) NULL,
    `dept_id` BIGINT NULL,
    `dept_name` VARCHAR(100) NULL DEFAULT '',
    `applicant` VARCHAR(50) NULL DEFAULT '',
    `filler_name` VARCHAR(50) NULL DEFAULT '',
    `fill_date` DATETIME(3) NULL,
    `claim_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `claim_amount_upper` VARCHAR(100) NULL DEFAULT '',
    `attach_pages` INTEGER NULL DEFAULT 0,
    `is_contract` CHAR(1) NULL DEFAULT '0',
    `contract_info` VARCHAR(500) NULL DEFAULT '',
    `loan_total` DECIMAL(18, 2) NULL DEFAULT 0,
    `offset_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `refund_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `payable_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `has_e_invoice` CHAR(1) NULL DEFAULT '0',
    `invoice_no` VARCHAR(100) NULL DEFAULT '',
    `fund_usage` VARCHAR(500) NULL DEFAULT '',
    `indicator_info` VARCHAR(500) NULL DEFAULT '',
    `flow_node` VARCHAR(50) NULL DEFAULT '',
    `flow_status` CHAR(1) NULL DEFAULT '0',
    `travel_start_date` DATETIME(3) NULL,
    `travel_end_date` DATETIME(3) NULL,
    `travel_days` INTEGER NULL DEFAULT 0,
    `travel_reason` VARCHAR(500) NULL DEFAULT '',
    `reception_target` VARCHAR(200) NULL DEFAULT '',
    `reception_days` INTEGER NULL DEFAULT 0,
    `reception_count` INTEGER NULL DEFAULT 0,
    `companion_count` INTEGER NULL DEFAULT 0,
    `standard_type` VARCHAR(50) NULL DEFAULT '',
    `reception_standard` DECIMAL(18, 2) NULL DEFAULT 0,
    `reception_place` VARCHAR(200) NULL DEFAULT '',
    `standard_limit` DECIMAL(18, 2) NULL DEFAULT 0,
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `expense_claim_detail` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `claim_id` BIGINT NULL,
    `usage` VARCHAR(500) NULL DEFAULT '',
    `indicator_id` BIGINT NULL,
    `indicator_name` VARCHAR(200) NULL DEFAULT '',
    `econ_category` VARCHAR(200) NULL DEFAULT '',
    `remain_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `apply_amount` DECIMAL(18, 2) NULL DEFAULT 0,
    `real_indicator_id` BIGINT NULL,
    `real_econ_category` VARCHAR(200) NULL DEFAULT '',
    `travel_from` VARCHAR(100) NULL DEFAULT '',
    `travel_to` VARCHAR(100) NULL DEFAULT '',
    `travel_start_date` DATETIME(3) NULL,
    `travel_end_date` DATETIME(3) NULL,
    `travel_days` INTEGER NULL DEFAULT 0,
    `travel_persons` INTEGER NULL DEFAULT 0,
    `travel_level` VARCHAR(50) NULL DEFAULT '',
    `air_fare` DECIMAL(18, 2) NULL DEFAULT 0,
    `city_transport` DECIMAL(18, 2) NULL DEFAULT 0,
    `accommodation` DECIMAL(18, 2) NULL DEFAULT 0,
    `meal_allowance` DECIMAL(18, 2) NULL DEFAULT 0,
    `local_transport` DECIMAL(18, 2) NULL DEFAULT 0,
    `other_expense` DECIMAL(18, 2) NULL DEFAULT 0,
    `subtotal` DECIMAL(18, 2) NULL DEFAULT 0,
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `expense_payee` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `payee_name` VARCHAR(100) NULL DEFAULT '',
    `bank_account` VARCHAR(64) NULL DEFAULT '',
    `bank_name` VARCHAR(100) NULL DEFAULT '',
    `account_type` VARCHAR(50) NULL DEFAULT '',
    `budget_unit` VARCHAR(100) NULL DEFAULT '',
    `dept_id` BIGINT NULL,
    `is_enabled` CHAR(1) NULL DEFAULT '1',
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `expense_payer` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `payer_name` VARCHAR(100) NULL DEFAULT '',
    `bank_account` VARCHAR(64) NULL DEFAULT '',
    `bank_name` VARCHAR(100) NULL DEFAULT '',
    `pinyin_code` VARCHAR(50) NULL DEFAULT '',
    `sort_code` VARCHAR(50) NULL DEFAULT '',
    `related_unit` VARCHAR(100) NULL DEFAULT '',
    `dept_id` BIGINT NULL,
    `is_enabled` CHAR(1) NULL DEFAULT '1',
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_method` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `payment_type` VARCHAR(50) NULL DEFAULT '',
    `relation_type` VARCHAR(50) NULL DEFAULT '',
    `is_default` CHAR(1) NULL DEFAULT '0',
    `payer_id` BIGINT NULL,
    `payer_name` VARCHAR(100) NULL DEFAULT '',
    `payer_bank` VARCHAR(100) NULL DEFAULT '',
    `payer_account` VARCHAR(64) NULL DEFAULT '',
    `payer_unit` VARCHAR(100) NULL DEFAULT '',
    `is_enabled` CHAR(1) NULL DEFAULT '1',
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `engineering_project` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `project_code` VARCHAR(64) NULL DEFAULT '',
    `project_name` VARCHAR(200) NULL DEFAULT '',
    `project_type` VARCHAR(50) NULL DEFAULT '',
    `project_status` CHAR(1) NULL DEFAULT '0',
    `total_investment` DECIMAL(18, 2) NULL DEFAULT 0,
    `start_date` DATETIME(3) NULL,
    `end_date` DATETIME(3) NULL,
    `project_address` VARCHAR(500) NULL DEFAULT '',
    `project_manager` VARCHAR(50) NULL DEFAULT '',
    `dept_id` BIGINT NULL,
    `dept_name` VARCHAR(100) NULL DEFAULT '',
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contractor` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `contractor_name` VARCHAR(200) NULL DEFAULT '',
    `contractor_type` VARCHAR(50) NULL DEFAULT '',
    `credit_code` VARCHAR(64) NULL DEFAULT '',
    `contact_person` VARCHAR(50) NULL DEFAULT '',
    `contact_phone` VARCHAR(20) NULL DEFAULT '',
    `qualification` VARCHAR(200) NULL DEFAULT '',
    `business_scope` VARCHAR(500) NULL DEFAULT '',
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bid_notice` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `notice_title` VARCHAR(200) NULL DEFAULT '',
    `notice_content` TEXT NULL,
    `project_id` BIGINT NULL,
    `project_name` VARCHAR(200) NULL DEFAULT '',
    `publish_date` DATETIME(3) NULL,
    `bid_deadline` DATETIME(3) NULL,
    `bid_open_date` DATETIME(3) NULL,
    `flow_status` CHAR(1) NULL DEFAULT '0',
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `expert` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `expert_name` VARCHAR(50) NULL DEFAULT '',
    `expert_type` VARCHAR(50) NULL DEFAULT '',
    `specialty` VARCHAR(200) NULL DEFAULT '',
    `work_unit` VARCHAR(200) NULL DEFAULT '',
    `title` VARCHAR(50) NULL DEFAULT '',
    `phone` VARCHAR(20) NULL DEFAULT '',
    `email` VARCHAR(50) NULL DEFAULT '',
    `id_card` VARCHAR(20) NULL DEFAULT '',
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `approval_record` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `business_id` BIGINT NULL,
    `business_type` VARCHAR(50) NULL DEFAULT '',
    `business_no` VARCHAR(64) NULL DEFAULT '',
    `node_code` VARCHAR(50) NULL DEFAULT '',
    `node_name` VARCHAR(100) NULL DEFAULT '',
    `approver_user_id` BIGINT NULL,
    `approver_name` VARCHAR(50) NULL DEFAULT '',
    `approver_dept_id` BIGINT NULL,
    `approver_dept_name` VARCHAR(100) NULL DEFAULT '',
    `approval_action` VARCHAR(20) NULL DEFAULT '',
    `approval_opinion` VARCHAR(500) NULL,
    `approval_time` DATETIME(3) NULL,
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attachment` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `business_id` BIGINT NULL,
    `business_type` VARCHAR(50) NULL DEFAULT '',
    `file_name` VARCHAR(200) NULL DEFAULT '',
    `file_original_name` VARCHAR(200) NULL DEFAULT '',
    `file_path` VARCHAR(500) NULL DEFAULT '',
    `file_size` BIGINT NULL DEFAULT 0,
    `file_type` VARCHAR(50) NULL DEFAULT '',
    `file_suffix` VARCHAR(20) NULL DEFAULT '',
    `status` CHAR(1) NULL DEFAULT '0',
    `create_by` VARCHAR(64) NULL DEFAULT '',
    `create_time` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(64) NULL DEFAULT '',
    `update_time` DATETIME(3) NULL,
    `remark` VARCHAR(500) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sys_gen_column` ADD CONSTRAINT `sys_gen_column_table_id_fkey` FOREIGN KEY (`table_id`) REFERENCES `sys_gen_table`(`table_id`) ON DELETE CASCADE ON UPDATE CASCADE;
