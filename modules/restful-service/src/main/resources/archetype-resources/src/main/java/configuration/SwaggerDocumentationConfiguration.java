package com.disney.jarvis.api.configuration;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.web.context.ServletContextAware;

import javax.servlet.ServletContext;

@Configuration
@ComponentScan(value={"com.mangofactory.swagger.configuration", "com.disney.jarvis.api.controller"})
@EnableAutoConfiguration
@PropertySource("classpath:application.properties")
public class SwaggerDocumentationConfiguration implements ServletContextAware {
    ServletContext servletContext;

    @Override
    public void setServletContext(ServletContext servletContext) {
        this.servletContext=servletContext;
    }
}