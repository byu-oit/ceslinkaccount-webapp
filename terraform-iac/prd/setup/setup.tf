terraform {
  backend "s3" {
    bucket         = "terraform-state-storage-066838219794"
    dynamodb_table = "terraform-state-lock-066838219794"
    key            = "ceslinkaccount-webapp-prd/ecr.tfstate"
    region         = "us-west-2"
  }
}

provider "aws" {
  version = "~> 2.42"
  region  = "us-west-2"
}

module "setup" {
  source      = "../../modules/setup/"
  env         = "prd"
}

output "hosted_zone_id" {
  value = module.setup.hosted_zone.zone_id
}

output "hosted_zone_name_servers" {
  value = module.setup.hosted_zone.name_servers
}
