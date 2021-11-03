package fun.swsk33site.miyakogame.service.impl;

import fun.swsk33site.miyakogame.cache.InvalidData;
import fun.swsk33site.miyakogame.cache.PlayerCache;
import fun.swsk33site.miyakogame.dao.PlayerDAO;
import fun.swsk33site.miyakogame.dataobject.Player;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

/**
 * Spring Security的用户查找认证接口实现
 */
@Component
public class UserQueryServiceImpl implements UserDetailsService {

	@Autowired
	private PlayerDAO playerDAO;

	@Autowired
	private PlayerCache playerCache;

	@Autowired
	private InvalidData invalidData;

	/**
	 * 用户登录查询逻辑
	 *
	 * @param usernameOrEmail 用户名或者邮箱
	 */
	@Override
	public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
		// 先检测无效用户名或者邮箱防止缓存穿透
		if (invalidData.isCredentialInvalid(usernameOrEmail)) {
			throw new UsernameNotFoundException("请勿重复登录无效账户！");
		}
		// 先去Redis查找
		Player getPlayer = playerCache.getByUsernameOrEmail(usernameOrEmail);
		if (getPlayer == null) {
			// Redis没有再去数据库以用户名查找
			try {
				getPlayer = playerDAO.findByUsernameOrEmail(usernameOrEmail);
			} catch (Exception e) {
				e.printStackTrace();
			}
			// 还是没有说明用户名不存在
			if (getPlayer == null) {
				// 将无效用户名存入redis防止穿透
				invalidData.addInvalidCredential(usernameOrEmail);
				throw new UsernameNotFoundException("找不到用户！");
			}
			// 数据库中存在，就把数据库中用户存入Redis和排名表
			playerCache.addOrSet(getPlayer);
		}
		// 权限，在游戏中没有权限之分，全是玩家
		Set<GrantedAuthority> authorities = new HashSet<>();
		authorities.add(new SimpleGrantedAuthority("ROLE_player"));
		return new User(getPlayer.getUsername(), getPlayer.getPassword(), authorities);
	}

}