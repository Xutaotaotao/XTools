import React from "react";
import { Nav, Avatar, Layout, Breadcrumb } from "@douyinfe/semi-ui";
import {
  IconSemiLogo,
  IconFeishuLogo,
  IconHelpCircle,
  IconBell,
} from "@douyinfe/semi-icons";
import { IconIntro, IconImage } from "@douyinfe/semi-icons-lab";
import styles from "./index.module.scss";
import "@/assets/normalize.css";
import { Outlet, useLocation, history } from "umi";
import Logo from "@/assets/img/logo1.svg";
import { OnSelectedData } from "@douyinfe/semi-ui/lib/es/navigation";

const { Content } = Layout;

const NavMap = [
  {itemKey: "/home", text: "首页", icon: <IconSemiLogo className={styles.iconIntro}/>, className: styles.navItem},
  {itemKey: "/imageSlicing", text: "图片分割", icon: <IconImage className={styles.iconHeart}/>, className: styles.navItem1},
]

const XLayout = () => {
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
            <IconFeishuLogo
              size="large"
              className={styles.semiIconsFeishuLogo}
            />
            <IconHelpCircle
              size="large"
              className={styles.semiIconsHelpCircle}
            />
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
      ></Nav>
      {location.pathname === "/" ? (
        <Outlet />
      ) : (
        <div className={styles.main}>
          <Nav
            mode="vertical"
            defaultSelectedKeys={["/home"]}
            footer={{ collapseButton: true }}
            className={styles.left}
            selectedKeys={[location.pathname]}
            onSelect={(item: OnSelectedData) => {
              history.push(item.itemKey as string);
            }}
          >
            {
              NavMap.map((item) => (
                <Nav.Item
                  key={item.itemKey}
                  itemKey={item.itemKey}
                  text={item.text}  
                  icon={item.icon}
                  className={item.className}
                />
              ))
            }
          </Nav>
          <Content className={styles.right}>
            <Outlet />
          </Content>
        </div>
      )}
    </div>
  );
};

export default XLayout;
