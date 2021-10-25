package fun.swsk33site.miyakogame.service.impl;

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

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Player getPlayer = null;
		try {
			getPlayer = playerDAO.findByUsername(username);
		} catch (Exception e) {
			e.printStackTrace();
		}
		if (getPlayer == null) {
			throw new UsernameNotFoundException("找不到用户！");
		}
		// 权限，在游戏中没有权限之分，全是玩家
		Set<GrantedAuthority> authorities = new HashSet<>();
		authorities.add(new SimpleGrantedAuthority("player"));
		return new User(getPlayer.getUsername(), getPlayer.getPassword(), authorities);
	}

}