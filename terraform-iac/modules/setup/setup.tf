variable "env" {
  type = string
}

locals {
  name       = "ceslinkaccount"
  url_prefix = (var.env == "prd") ? "account" : "account-${var.env}"
  url        = "${local.url_prefix}.admissionsapplicationsystem.org"
}

resource "aws_route53_zone" "zone" {
  name = local.url
}

output "hosted_zone" {
  value = aws_route53_zone.zone
}
