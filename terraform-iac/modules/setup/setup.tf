variable "env" {
  type = string
}

locals {
  name = "ceslinkaccount"
  url_prefix = (var.env == 'prd') ? 'account' : 'account-${var.env}' 
}

resource "aws_route53_zone" "zone" {
  name = "${url_prefix}.churcheducationalsystem.org"
}

module "my_ecr" {
  source = "github.com/byu-oit/terraform-aws-ecr?ref=v1.1.0"
  name   = "${local.name}-${var.env}"
}
