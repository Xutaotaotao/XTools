import React from "react";
import { Nav, Avatar } from '@douyinfe/semi-ui';
import { IconSemiLogo, IconFeishuLogo, IconHelpCircle, IconBell } from '@douyinfe/semi-icons';
import { IconIntro, IconHeart, IconCalendar, IconCheckbox, IconRadio, IconList, IconToast } from '@douyinfe/semi-icons-lab';
import styles from './index.module.scss';
import '@/assets/normalize.css'
import { Outlet, useLocation } from "umi";
import Logo from "@/assets/img/logo1.svg";

const Layout = () => {
  const location = useLocation();
  return (
    <div className={styles.rootSidenav}>
      <Nav
        mode="horizontal"
        header={{
          text: <img src={Logo} alt="logo" className={styles.logo} />,
        }}
        footer={
          <div className={styles.dIV}>
            <IconFeishuLogo size="large" className={styles.semiIconsFeishuLogo} />
            <IconHelpCircle size="large" className={styles.semiIconsHelpCircle} />
            <IconBell size="large" className={styles.semiIconsBell} />
            <Avatar
              size="small"
              src="https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/avatarDemo.jpeg"
              color="blue"
              className={styles.avatar}
            >
              示例
            </Avatar>
          </div>
        }
        className={styles.nav}
      >
      </Nav>
      {
        location.pathname === "/" ? <Outlet /> :  <div className={styles.main}>
        <Nav
          defaultOpenKeys={["user", "union"]}
          mode="vertical"
          footer={{ collapseButton: true }}
          className={styles.left}
        >
          <Nav.Item
            itemKey="Home"
            text="Home"
            icon={<IconIntro className={styles.iconIntro} />}
            className={styles.navItem}
          />
          <Nav.Item
            itemKey="Dashboard"
            text="Dashboard"
            icon={<IconHeart className={styles.iconHeart} />}
            className={styles.navItem1}
          />
          <Nav.Item
            itemKey="Project"
            text="Project"
            icon={<IconCalendar className={styles.iconCalendar} />}
            className={styles.navItem2}
          />
          <Nav.Item
            itemKey="Tasks"
            text="Tasks"
            icon={<IconCheckbox className={styles.iconCheckbox} />}
            className={styles.navItem3}
          />
          <Nav.Item
            itemKey="Reporting"
            text="Reporting"
            icon={<IconCalendar className={styles.iconCalendar} />}
            className={styles.navItem4}
          />
          <Nav.Item
            itemKey="Users"
            text="Users"
            icon={<IconRadio className={styles.iconRadio} />}
            className={styles.navItem5}
          />
          <Nav.Item
            itemKey="Support"
            text="Support"
            icon={<IconList className={styles.iconList} />}
            className={styles.navItem6}
          />
          <Nav.Item
            itemKey="Settings"
            text="Settings"
            icon={<IconToast className={styles.iconToast} />}
            className={styles.navItem7}
          />
        </Nav>
        <div className={styles.right}>
          <Outlet />
        </div>
      </div>
      }
    </div>
  );
}

export default Layout;
