resource "koyeb_app" "blog" {
  name = "blog" 
}

resource "koyeb_service" "blog" {
  app_name = koyeb_app.blog.name
  
  definition {
    name = var.service_name
    
    instance_types {
      type = var.instance_type
    }
    
    ports {
      port     = var.port
      protocol = "http"
    }
    
    routes {
      path = "/"
      port = var.port
    }
    
    scalings {
      min = 1
      max = 1
    }
    
    regions = [var.region]
    
    docker {
      image = var.docker_image
    }
    
    env {
      key   = "NODE_ENV"
      value = "production"
    }
    
    env {
      key   = "PORT"
      value = tostring(var.port)
    }
  }
  
  depends_on = [koyeb_app.blog]
}

resource "koyeb_app" "blog_preview" {
  name = "blog-preview"
}

resource "koyeb_service" "blog_preview" {
  app_name = koyeb_app.blog_preview.name
  
  definition {
    name = "${var.service_name}-preview"
    
    instance_types {
      type = var.instance_type
    }
    
    ports {
      port     = var.port
      protocol = "http"
    }
    
    routes {
      path = "/"
      port = var.port
    }
    
    scalings {
      min = 1
      max = 1
    }
    
    regions = [var.region]
    
    docker {
      image = var.docker_image
    }
    
    env {
      key   = "NODE_ENV"
      value = "production"
    }
    
    env {
      key   = "PORT"
      value = tostring(var.port)
    }
  }
  
  depends_on = [koyeb_app.blog_preview]
}
