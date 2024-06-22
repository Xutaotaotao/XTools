import GlobalContext from "@/context/global";
import { IconMoon, IconSun } from "@douyinfe/semi-icons";
import { Button, Modal } from "@douyinfe/semi-ui";
import { invoke } from "@tauri-apps/api/tauri";
import { useContext } from "react";
import { platform } from '@tauri-apps/api/os';
import { useTranslation } from "react-i18next";

type Theme = "auto" | "light" | "dark";

const setNativeTheme = (theme: Theme) => {
  setTimeout(() => {
    invoke("plugin:theme|set_theme", {
      theme,
    }).catch((err) => {
      alert(err.toString());
    });
  }, 100)
};


const ThemeIcon = () => {
  const { changeTheme, themeData } = useContext(GlobalContext);
  const [modal, contextHolder] = Modal.useModal();
  const {t} = useTranslation()

  const changeThemeAction = async () => {

    const doAction = () => {
      if (themeData === "darkAlgorithm") {
        changeTheme("defaultAlgorithm");
        setNativeTheme("light")
      } else {
        changeTheme("darkAlgorithm");
        setNativeTheme("dark")
      }
    }

    const platformName = await platform();
    if (platformName === 'win32') {
      modal.confirm({
        title:t('SwitchTheme'),
        content: t('Switching themes requires restarting the application. Do you want to continue?'),
        okText: t('Confirm'),
        cancelText: t('Cancel'),
        onOk: () => {
          doAction()
        },
      });
    } else {
      doAction()
    }


  };

  return <>
    <Button
      theme="borderless"
      style={{
        color: "var(--semi-color-text-2)",
      }}
      icon={
        themeData === "darkAlgorithm" ? <IconSun /> : <IconMoon />
      }
      onClick={() => changeThemeAction()}
    ></Button>
    {contextHolder}
  </>
}

export default ThemeIcon;