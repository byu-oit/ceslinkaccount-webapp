variable "env" {
  type = string
}

locals {
  tags = {
    env              = "${var.env}"
    data-sensitivity = "public"
    repo             = "https://github.com/byu-oit/ceslinkaccount-webapp"
  }
  url_prefix = (var.env == "prd") ? "account" : "account-${var.env}"
  url        = "${local.url_prefix}.admissionsapplicationsystem.org"
}

provider "aws" {
  version = "~> 2.42"
  region  = "us-west-2"
}

data "aws_route53_zone" "zone" {
  name = local.url
}

module "s3_site" {
  source = "github.com/byu-oit/terraform-aws-s3staticsite?ref=v2.0.1"
  //  source         = "../."
  site_url       = local.url
  hosted_zone_id = data.aws_route53_zone.zone.id
  s3_bucket_name = local.url
  tags           = local.tags
}

output "s3_bucket" {
  value = module.s3_site.site_bucket.bucket
}

output "cf_distribution_id" {
  value = module.s3_site.cf_distribution.id
}
