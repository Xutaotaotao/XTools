import LogoB from "@/assets/img/XTools_B.svg";
import LogoW from "@/assets/img/XTools_W.svg";
import "@/assets/normalize.css";
import LangIcon from "@/components/LangIcon";
import ThemeIcon from "@/components/ThemeIcon";
import GlobalContext from "@/context/global";
import { menu as MENU_MAP } from "@/routes/index";
import { ENV_MODE, IS_TAURI } from "@/utils/const";
import { IconGithubLogo, IconLikeHeart } from "@douyinfe/semi-icons";
import { IconImage, IconIntro } from "@douyinfe/semi-icons-lab";
import {
  Button,
  Image,
  Layout,
  Nav,
  Popover,
  Typography,
} from "@douyinfe/semi-ui";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;

const XLayout = () => {
  const { themeData } = useContext(GlobalContext);

  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const menuRouteMap: Record<
    string,
    { text: string; icon: JSX.Element; des?: string }
  > = {
    "/": {
      text: t("home"),
      icon: <IconIntro />,
    },
    "/imageSlicing": {
      text: t("imageSlicing"),
      icon: <IconImage />,
      des: t("imageSlicingDes"),
    },
  };

  const NAV_MAP = MENU_MAP.map((menu) => {
    return {
      ...menu,
      ...menuRouteMap[menu.itemKey],
    };
  });

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
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  onClick={() => navigate("/")}
                  src={themeData === "defaultAlgorithm" ? LogoB : LogoW}
                  alt="logo"
                  style={{ height: "48px", cursor: "pointer" }}
                />
                {ENV_MODE !== "development" && !IS_TAURI ? (
                  <img
                    style={{ marginLeft: "10px" }}
                    src="https://visitor-badge.laobi.icu/badge?page_id=xutaotaotao.github.io.XTools"
                    onError={handleImageError}
                  />
                ) : null}
              </div>
            </Nav.Header>
            <Nav.Footer>
              <ThemeIcon />
              <LangIcon />
              <Popover
                content={
                  <div style={{ padding: "12px" }}>
                    <div style={{ textAlign: "center" }}>
                      <div>{t("weChatSponsorship")}</div>
                      <Image
                        width={250}
                        src="https://taotaoxu.com/payment/IMG_5471.jpeg"
                      />
                    </div>
                  </div>
                }
              >
                <Button
                  theme="borderless"
                  icon={<IconLikeHeart size="large" />}
                  style={{
                    color: "var(--semi-color-text-2)",
                  }}
                />
              </Popover>
              <Button
                theme="borderless"
                icon={<IconGithubLogo size="large" />}
                style={{
                  color: "var(--semi-color-text-2)",
                }}
                onClick={() => {
                  window.open("https://github.com/xutaotaotao/XTools");
                }}
              />
            </Nav.Footer>
          </Nav>
        </div>
      </Header>
      <Layout>
        <Sider style={{ backgroundColor: "var(--semi-color-bg-1)" }}>
          <Nav
            style={{ maxWidth: 180, height: "100%" }}
            defaultSelectedKeys={["/home"]}
            selectedKeys={[location.pathname]}
            onSelect={(item) => {
              navigate(item.itemKey as string);
            }}
            items={NAV_MAP}
            footer={{
              collapseButton: true,
              collapseText: (collapsed) => {
                if (collapsed) {
                  return t("expandSidebar");
                } else {
                  return t("collapseSidebar");
                }
              },
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <Title heading={3} style={{ marginBottom: "12px" }}>
              {
                NAV_MAP.find(
                  (item) =>
                    item.itemKey !== "/" && item.itemKey === location.pathname
                )?.text
              }
            </Title>
            <Text style={{ marginLeft: "12px" }}>
              {NAV_MAP.find((item) => item.itemKey === location.pathname)?.des}
            </Text>
          </div>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default XLayout;
