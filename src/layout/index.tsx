import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  IconGithubLogo,
  IconLikeHeart,
} from "@douyinfe/semi-icons";
import { Button, Layout, Nav, Popover,Image,Typography } from "@douyinfe/semi-ui";
import Logo from "@/assets/img/logo.svg";
import "@/assets/normalize.css";
import { menu as NAV_MAP } from "@/routes/index";
import { ENV_MODE, IS_TAURI } from "@/utils/const";
import { useTranslation } from "react-i18next";
import i18n from "@/locales";
import { TranslationOutlined } from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

const { Text,Title } = Typography;


const XLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [currentLang, setCurrentLang] = useState<string>("zh");

  const changeLang = (lang?: string) => {
    if (lang) {
      setCurrentLang(lang);
      i18n.changeLanguage(lang);
    } else {
      if (currentLang === "zh") {
        setCurrentLang("en");
        i18n.changeLanguage("en");
      } else {
        setCurrentLang("zh");
        i18n.changeLanguage("zh");
      }
    }
  };
  
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
                  src={Logo}
                  alt="logo"
                  style={{ height: "48px", cursor: "pointer" }}
                />
                {
                  ENV_MODE !== 'development' && !IS_TAURI ? <img
                  style={{ marginLeft: "10px" }}
                  src="https://visitor-badge.laobi.icu/badge?page_id=xutaotaotao.github.io.XTools"
                  onError={handleImageError}
                /> : null
                }
              </div>
            </Nav.Header>
            <Nav.Footer>
              <Popover content={<div style={{padding: "12px"}}>
                  <div style={{textAlign: "center"}}>
                    <div>{t("weChatSponsorship")}</div>
                    <Image width={250} src="https://taotaoxu.com/payment/IMG_5471.jpeg" />
                  </div>
              </div>}>
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
                onClick={() => {window.open("https://github.com/xutaotaotao/XTools")}}
              />
              <Button
                theme="borderless"
                icon={<TranslationOutlined />}
                style={{
                  color: "var(--semi-color-text-2)",
                }}
                onClick={() => {changeLang()}}
              >
                {currentLang === "zh" ? "En" : "中"}
              </Button>
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
              onSelect={(item: any) => {
                navigate(item.itemKey as string);
              }}
              items={NAV_MAP}
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
            <div style={{display: "flex",alignItems:'center',marginBottom: "12px"}}>
            <Title heading={3} style={{marginBottom: "12px"}}>{NAV_MAP.find(item => item.itemKey === location.pathname)?.text}</Title>
            <Text style={{marginLeft: "12px"}}>{NAV_MAP.find(item => item.itemKey === location.pathname)?.des}</Text>
            </div>
            <Outlet />
          </Content>
        </Layout>
    </Layout>
  );
};

export default XLayout;
