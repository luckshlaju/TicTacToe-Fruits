terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
    }
  }
}

provider "aws" {
  region = "ap-south-1"
}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_security_group" "tictactoe_sg" {
  name        = "tictactoe-sg"
  description = "Allow SSH and HTTP traffic"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "tictactoe" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"

  security_groups = [aws_security_group.tictactoe_sg.name]

  user_data = <<-EOF
              #!/bin/bash
              apt-get update -y
              apt-get install -y docker.io

              systemctl start docker
              systemctl enable docker

              docker pull ghcr.io/luckshlaju/tictactoe-fruits:latest

              docker run -d \
                --name tictactoe \
                -p 80:80 \
                ghcr.io/luckshlaju/tictactoe-fruits:latest
              EOF

  tags = {
    Name = "TicTacToe-Fruits"
  }
}

output "instance_public_ip" {
  value = aws_instance.tictactoe.public_ip
}

output "application_url" {
  value = "http://${aws_instance.tictactoe.public_ip}"
}