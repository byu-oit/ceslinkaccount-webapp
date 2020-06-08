terraform {
  backend "s3" {
    bucket         = "terraform-state-storage-617422507725"
    dynamodb_table = "terraform-state-lock-617422507725"
    key            = "ceslinkaccount-webapp-dev/setup.tfstate"
    region         = "us-west-2"
  }
}

provider "aws" {
  version = "~> 2.42"
  region  = "us-west-2"
}

module "setup" {
  source = "../../modules/setup/"
  env    = "dev"
}

output "hosted_zone_id" {
  value = module.setup.hosted_zone.zone_id
}

output "hosted_zone_name_servers" {
  value = module.setup.hosted_zone.name_servers
}
