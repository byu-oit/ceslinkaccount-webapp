variable "env" {
  type = string
}

variable "image_tag" {
  type = string
}

variable "codedeploy_termination_wait_time" {
  type = number
}

locals {
  name = "ceslinkaccount"
  tags = {
    env              = "${var.env}"
    data-sensitivity = "public"
    repo             = "https://github.com/byu-oit/${local.name}"
  }
}

data "aws_ecr_repository" "my_ecr_repo" {
  name = "${local.name}-${var.env}"
}

module "acs" {
  source = "github.com/byu-oit/terraform-aws-acs-info?ref=v2.1.0"
}

module "my_fargate_api" {
  source                        = "github.com/byu-oit/terraform-aws-fargate-api?ref=v2.1.0"
  app_name                      = "${local.name}-${var.env}"
  container_port                = 8080
  health_check_path             = "/health"
  codedeploy_test_listener_port = 4443
  hosted_zone                   = module.acs.route53_zone
  https_certificate_arn         = module.acs.certificate.arn
  public_subnet_ids             = module.acs.public_subnet_ids
  private_subnet_ids            = module.acs.private_subnet_ids
  vpc_id                        = module.acs.vpc.id
  codedeploy_service_role_arn   = module.acs.power_builder_role.arn
  codedeploy_termination_wait_time = var.codedeploy_termination_wait_time
  role_permissions_boundary_arn = module.acs.role_permissions_boundary.arn
  tags                          = local.tags

  primary_container_definition = {
    name  = "${local.name}-${var.env}"
    image = "${data.aws_ecr_repository.my_ecr_repo.repository_url}:${var.image_tag}"
    ports = [8080]
    environment_variables = null
    secrets = {
      "SOME_SECRET" = "/${local.name}/${var.env}/some-secret"
    }
    efs_volume_mounts = null
  }

  autoscaling_config = {
    min_capacity = 1
    max_capacity = 2
  }

  codedeploy_lifecycle_hooks = {
    BeforeInstall         = null
    AfterInstall          = null
    AfterAllowTestTraffic = aws_lambda_function.test_lambda.function_name
    BeforeAllowTraffic    = null
    AfterAllowTraffic     = null
  }
}

resource "aws_iam_role" "test_lambda" {
  name                 = "${local.name}-deploy-test-${var.env}"
  permissions_boundary = module.acs.role_permissions_boundary.arn

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_lambda_function" "test_lambda" {
  filename         = "../../../tst/codedeploy-hooks/after-allow-test-traffic/lambda.zip"
  function_name    = "${local.name}-deploy-test-${var.env}"
  role             = aws_iam_role.test_lambda.arn
  handler          = "index.handler"
  runtime          = "nodejs12.x"
  timeout          = 30
  source_code_hash = filebase64sha256("../../../tst/codedeploy-hooks/after-allow-test-traffic/lambda.zip")
  environment {
    variables = {
      "ENV" = var.env
    }
  }
}

resource "aws_iam_role_policy" "test_lambda" {
  name = "${local.name}-deploy-test-${var.env}"
  role = aws_iam_role.test_lambda.name

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*",
      "Effect": "Allow"
    },
    {
      "Action": "codedeploy:PutLifecycleEventHookExecutionStatus",
      "Resource": "*",
      "Effect": "Allow"
    }
  ]
}
EOF
}

output "url" {
  value = module.my_fargate_api.dns_record.name
}

output "codedeploy_app_name" {
  value = module.my_fargate_api.codedeploy_deployment_group.app_name
}

output "codedeploy_deployment_group_name" {
  value = module.my_fargate_api.codedeploy_deployment_group.deployment_group_name
}

output "codedeploy_appspec_json_file" {
  value = module.my_fargate_api.codedeploy_appspec_json_file
}
