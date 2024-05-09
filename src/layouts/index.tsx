import { Outlet, history, useLocation } from "umi";
import {
  IconCustomerSupport,
  IconGithubLogo,
  IconLikeHeart,
} from "@douyinfe/semi-icons";
import { IconImage, IconIntro } from "@douyinfe/semi-icons-lab";
import { Button, Layout, Nav, Popover,Image, Row, Col } from "@douyinfe/semi-ui";
import Logo from "@/assets/img/XTools.svg";
import ImageCompressSvg from "@/assets/img/imageCompress.svg";
import JsonSvg from "@/assets/img/json.svg";
import JsonDiffSvg from "@/assets/img/jsonDiff.svg";
import imgScanSvg from "@/assets/img/imgScan.svg";
import "@/assets/normalize.css";
import styles from "./index.module.scss";

const { Header, Footer, Sider, Content } = Layout;

const NavMap = [
  {
    itemKey: "/home",
    text: "首页",
    icon: <IconIntro />,
    className: styles.navItem,
  },
  {
    itemKey: "/jsonFormatting",
    text: "JSON格式化",
    icon: <img src={JsonSvg} />,
    className: styles.navItem1,
  },
  {
    itemKey: "/jsonDiff",
    text: "JSON对比",
    icon: <img src={JsonDiffSvg} />,
    className: styles.navItem1,
  },
  {
    itemKey: "/imageSlicing",
    text: "图片分割",
    icon: <IconImage />,
    className: styles.navItem1,
  },
  {
    itemKey: "/imageCompress",
    text: "图片压缩",
    icon: <img src={ImageCompressSvg} />,
    className: styles.navItem1,
  },
  {
    itemKey: "/imgScan",
    text: "图片识别文字",
    icon: <img src={imgScanSvg} />,
    className: styles.navItem1,
  },
];

const XLayout = () => {
  const location = useLocation();

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.style.display = "none";
  };
  return (
    <Layout>
      <Header style={{ backgroundColor: "var(--semi-color-bg-1)" }}>
        <div>
          <Nav mode="horizontal" defaultSelectedKeys={["Home"]}>
            <Nav.Header>
              <div style={{ display: "flex", alignItems: "end" }}>
                <img
                  onClick={() => history.push("/")}
                  src={Logo}
                  alt="logo"
                  style={{ height: "48px", cursor: "pointer" }}
                />
                <img
                  style={{ marginLeft: "10px" }}
                  src="https://visitor-badge.laobi.icu/badge?page_id=xutaotaotao.github.io.XTools"
                  onError={handleImageError}
                />
              </div>
            </Nav.Header>
            <Nav.Footer>
              <Popover content={<div style={{padding: "12px"}}>
                <Row gutter={16}>
                  <Col span={12} style={{textAlign: "center"}}>
                    <div>微信扫码赞助</div>
                    <Image width={250} src="https://taotaoxu.com/payment/IMG_5471.jpeg" />
                  </Col>
                  <Col span={12} style={{textAlign: "center"}}>
                  <div>支付宝扫码赞助</div>
                  <Image width={250} src="https://taotaoxu.com/payment/IMG_5472.jpg"/>
                  </Col>
                </Row>
              </div>}>
              <Button
                theme="borderless"
                icon={<IconLikeHeart size="large" />}
                style={{
                  color: "var(--semi-color-text-2)",
                  marginRight: "12px",
                }}
              />
              </Popover>
              
              <Button
                theme="borderless"
                icon={<IconCustomerSupport size="large" />}
                style={{
                  color: "var(--semi-color-text-2)",
                  marginRight: "12px",
                }}
                onClick={() => {window.open("https://github.com/xutaotaotao/XTools/issues")}}
              />
              <Button
                theme="borderless"
                icon={<IconGithubLogo size="large" />}
                style={{
                  color: "var(--semi-color-text-2)",
                  marginRight: "12px",
                }}
                onClick={() => {window.open("https://github.com/xutaotaotao/XTools")}}
              />
            </Nav.Footer>
          </Nav>
        </div>
      </Header>
      {location.pathname === "/" ? (
        <Outlet />
      ) : (
        <Layout>
          <Sider style={{ backgroundColor: "var(--semi-color-bg-1)" }}>
            <Nav
              style={{ maxWidth: 220, height: "100%" }}
              defaultSelectedKeys={["/home"]}
              selectedKeys={[location.pathname]}
              onSelect={(item: any) => {
                history.push(item.itemKey as string);
              }}
              items={NavMap}
              footer={{
                collapseButton: true,
              }}
            />
          </Sider>
          <Content
            style={{
              height: "calc(100vh - 60px)",
              boxSizing: "border-box",
              overflow: "hidden",
              padding: "12px",
              backgroundColor: "var(--semi-color-bg-0)",
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      )}
    </Layout>
  );
};

export default XLayout;
