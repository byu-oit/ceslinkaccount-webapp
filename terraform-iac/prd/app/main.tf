terraform {
  backend "s3" {
    bucket         = "terraform-state-storage-066838219794"
    dynamodb_table = "terraform-state-lock-066838219794"
    key            = "ceslinkaccount-webapp-prd/app.tfstate"
    region         = "us-west-2"
  }
}

provider "aws" {
  version = "~> 2.42"
  region  = "us-west-2"
}

module "app" {
  source    = "../../modules/app/"
  env       = "prd"
}

output "url" {
  value = module.app.url
}

