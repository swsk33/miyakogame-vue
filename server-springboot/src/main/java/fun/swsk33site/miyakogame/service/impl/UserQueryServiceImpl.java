package fun.swsk33site.miyakogame.service.impl;

import fun.swsk33site.miyakogame.dao.PlayerDAO;
import fun.swsk33site.miyakogame.dataobject.Player;
import fun.swsk33site.miyakogame.param.CommonValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.TimeUnit;

/**
 * Spring Security的用户查找认证接口实现
 */
@Component
public class UserQueryServiceImpl implements UserDetailsService {

	@Autowired
	private PlayerDAO playerDAO;

	@Autowired
	private RedisTemplate redisTemplate;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		// 先检测无效用户名防止缓存穿透
		if (redisTemplate.opsForSet().isMember(CommonValue.REDIS_INVALID_USER_TABLE_NAME, username)) {
			throw new UsernameNotFoundException("请勿重复登录无效账户！");
		}
		// 先去Redis查找
		Player getPlayer = (Player) redisTemplate.opsForValue().get(username);
		if (getPlayer == null) {
			// Redis没有再去数据库查找
			try {
				getPlayer = playerDAO.findByUsername(username);
			} catch (Exception e) {
				e.printStackTrace();
			}
			if (getPlayer == null) {
				// 将无效用户名存入redis防止穿透
				redisTemplate.opsForSet().add(CommonValue.REDIS_INVALID_USER_TABLE_NAME, username);
				redisTemplate.expire(CommonValue.REDIS_INVALID_USER_TABLE_NAME, 10, TimeUnit.MINUTES);
				throw new UsernameNotFoundException("找不到用户！");
			}
			// 数据库中存在，就把数据库中用户存入Redis和排名表
			redisTemplate.opsForValue().set(getPlayer.getUsername(), getPlayer);
			redisTemplate.opsForZSet().add(CommonValue.REDIS_RANK_TABLE_NAME, getPlayer.getUsername(), getPlayer.getHighScore());
		}
		// 权限，在游戏中没有权限之分，全是玩家
		Set<GrantedAuthority> authorities = new HashSet<>();
		authorities.add(new SimpleGrantedAuthority("ROLE_player"));
		return new User(getPlayer.getUsername(), getPlayer.getPassword(), authorities);
	}

}