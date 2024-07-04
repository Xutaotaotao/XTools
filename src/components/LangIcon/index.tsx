import { Button, Modal } from "@douyinfe/semi-ui";
import { TranslationOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import i18n from "@/locales";
import { getStore, setStore } from "@/bridge";
import { relaunch } from "@tauri-apps/api/process";
import { invoke } from "@tauri-apps/api/tauri";
import { IS_TAURI } from "@/utils/const";
import { useTranslation } from "react-i18next";

const LangIcon = () => {
  const {t} = useTranslation()

  const [currentLang, setCurrentLang] = useState<string>("");
  const [modal, contextHolder] = Modal.useModal();

  const changeLangAction = async (lang: string) => {
    setStore("lang", lang);
    setCurrentLang(lang);
    i18n.changeLanguage(lang);
    if (IS_TAURI) {
      invoke("change_menu_language", { lang }).then(() => {
        relaunch();
      });
    }
  };

  const changeLang = (lang?: string) => {
    if (lang) {
      setStore("lang", lang);
      setCurrentLang(lang);
      i18n.changeLanguage(lang);
    } else {
      if (currentLang === "zh") {
        modal.confirm({
          title: t("switchLanguage"),
          content: t(
            "Switching Language requires restarting the application. Do you want to continue?"
          ),
          okText: t("Confirm"),
          cancelText: t("Cancel"),
          onOk: () => {
            changeLangAction('en');
          },
        });
      } else {
        modal.confirm({
          title: t("SwitchTheme"),
          content: t(
            "Switching themes requires restarting the application. Do you want to continue?"
          ),
          okText: t("Confirm"),
          cancelText: t("Cancel"),
          onOk: () => {
            changeLangAction('zh');
          },
        });
      }
    }
  };

  useEffect(() => {
    const initData = async () => {
      const lang = await getStore("lang");
      let navLang = navigator.language;
      navLang = navLang.substring(0, 2);
      setCurrentLang(lang || navLang);
      changeLang(lang || navLang);
    };
    initData();
  }, []);

  return (
    <>
      <Button
        theme="borderless"
        icon={<TranslationOutlined />}
        style={{
          color: "var(--semi-color-text-2)",
        }}
        onClick={() => {
          changeLang();
        }}
      >
        {currentLang === "zh" ? "En" : "中"}
      </Button>
      {contextHolder}
    </>
  );
};

export default LangIcon;
