import { Nav, Layout,Typography } from "@douyinfe/semi-ui";
import {
  IconSemiLogo,
} from "@douyinfe/semi-icons";
import { IconImage,IconIntro } from "@douyinfe/semi-icons-lab";
import styles from "./index.module.scss";
import "@/assets/normalize.css";
import { Outlet, useLocation, history } from "umi";
import { OnSelectedData } from "@douyinfe/semi-ui/lib/es/navigation";
import Logo from "@/assets/img/XTools.svg";
import JsonSvg from "@/assets/img/json.svg";
import ImageCompressSvg from "@/assets/img/imageCompress.svg";

const { Content } = Layout;

const {Title} = Typography

const NavMap = [
  {itemKey: "/home", text: "首页", icon: <IconIntro className={styles.iconIntro}/>, className: styles.navItem},
  {itemKey: "/imageSlicing", text: "图片分割", icon: <IconImage className={styles.iconHeart}/>, className: styles.navItem1},
  {itemKey: "/jsonFormatting", text: "JSON格式化", icon: <img src={JsonSvg} className={styles.iconHeart}/>, className: styles.navItem1},
  {itemKey: "/imageCompress", text: "图片压缩", icon: <img src={ImageCompressSvg} className={styles.iconHeart}/>, className: styles.navItem1},
]

const XLayout = () => {
  const location = useLocation();

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display = 'none';
  }
  return (
    <div className={styles.rootSidenav}>
      <Nav
        mode="horizontal"
        header={{
          text: <div style={{display:'flex', alignItems:'end'}}>
            <img onClick={() => history.push("/")} src={Logo} alt="logo" className={styles.logo} />
            <img
              style={{marginLeft: '10px'}}
              src="https://visitor-badge.laobi.icu/badge?page_id=xutaotaotao.github.io.XTools"
              onError={handleImageError}
            />
          </div> ,
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
