terraform {
  backend "s3" {
    bucket         = "terraform-state-storage-617422507725"
    dynamodb_table = "terraform-state-lock-617422507725"
    key            = "ceslinkaccount-dev/setup.tfstate"
    region         = "us-west-2"
  }
}

provider "aws" {
  version = "~> 2.42"
  region  = "us-west-2"
}

variable "some_secret" {
  type        = string
  description = "Some secret string that will be stored in SSM and mounted into the Fargate Tasks as an environment variable"
}

module "setup" {
  source      = "../../modules/setup/"
  env         = "dev"
  some_secret = var.some_secret
}
