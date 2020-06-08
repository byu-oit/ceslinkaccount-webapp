variable "env" {
  type = string
}

locals {
  name = "ceslinkaccount"
  tags = {
    env              = "${var.env}"
    data-sensitivity = "public"
    repo             = "https://github.com/byu-oit/${local.name}"
  }
  url_prefix = (var.env == 'prd') ? 'account' : 'account-${var.env}'
}

provider "aws" {
  version = "~> 2.42"
  region  = "us-west-2"
}

data "aws_route53_zone" "zone" {
  name = "${url_prefix}.churcheducationalsystem.org"
}

module "s3_site" {
  source = "github.com/byu-oit/terraform-aws-s3staticsite?ref=v2.0.1"
  //  source         = "../."
  site_url       = "${url_prefix}.churcheducationalsystem.org"
  hosted_zone_id = data.aws_route53_zone.zone.id
  s3_bucket_name = "terraform-module-dev-s3staticsite"
  tags = {
    "data-sensitivity" = "confidential"
    "env"              = "${var.env}"
    "repo"             = "https://github.com/byu-oit/ceslinkaccount-webapp"
  }
}


output "url" {
  value = module.my_fargate_api.dns_record.name
}
