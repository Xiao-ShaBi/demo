package com.example.demo;

/**
 *  * @author oyc
 * <p>
 *  * @Description: 用户控制类
 * <p>
 *  * @date 2018/7/8 22:10
 * <p>
 *  
 */

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import javax.annotation.Resource;

@RestController
@RequestMapping("/jdbc")
public class JdbcController {

    @Resource
    private JdbcTemplate jdbcTemplate;

    @RequestMapping("/userlist")
    public String getUserList(ModelMap map) {
        String sql = "SELECT * FROM user";
        List<User> userList = jdbcTemplate.query(sql, new RowMapper<User>() {
            User user = null;

            @Override
            public User mapRow(ResultSet rs, int rowNum) throws SQLException {
                user = new User();
                user.setId(rs.getString("id"));
                user.setName(rs.getString("name"));
                user.setSex(rs.getString("sex"));
                user.setAge(rs.getString("age"));
                return user;
            }
        });
        for (User user : userList) {
            System.out.println(user.getName());
        }
//        map.addAttribute("users", userList);
        return "user";
    }

    @RequestMapping("/adduser")
    public String addUser(String name, String age, String sex, String id) {
        String sql = "INSERT INTO user (id,name,age,sex)" +
                "VALUES" +
                "('" + id + "','" + name + "','" + age + "','" + sex + "');";
        jdbcTemplate.execute(sql);
        return name;
    }
}
