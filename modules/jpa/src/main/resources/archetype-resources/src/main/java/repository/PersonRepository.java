package ${groupId}.repository;

import ${groupId}.domain.Person;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;


/**
 * Created by wangj117 on 1/30/14.
 */

public interface PersonRepository extends CrudRepository<Person, Long>,JpaSpecificationExecutor {
    Page<Person> findAll(Pageable pageable);
    Person findByName(String name);
}
