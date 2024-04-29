import { Nav, Layout } from "@douyinfe/semi-ui";
import {
  IconSemiLogo,
} from "@douyinfe/semi-icons";
import { IconImage } from "@douyinfe/semi-icons-lab";
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
          text: <img onClick={() => history.push("/")} src={Logo} alt="logo" className={styles.logo} />,
        }}
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
