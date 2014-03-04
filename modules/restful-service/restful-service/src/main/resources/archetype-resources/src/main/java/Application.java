package ${groupId};

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.ObjectPostProcessor;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configurers.provisioning.InMemoryUserDetailsManagerConfigurer;

@Configuration
@EnableAutoConfiguration
@ComponentScan
public class Application {

    public static void main(String[] args) throws Exception {

        SpringApplication.run(Application.class);

    }

    @Bean
    public AuthenticationManager authenticationManager(
            ObjectPostProcessor<Object> objectPostProcessor) throws Exception {

        InMemoryUserDetailsManagerConfigurer<AuthenticationManagerBuilder> builder = new AuthenticationManagerBuilder(
                objectPostProcessor).inMemoryAuthentication();

        builder
                .withUser("client")
                .password("secret")
                .roles( "USER" );

        return builder.and().build();

    }

}
