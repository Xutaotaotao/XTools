import GlobalContext from "@/context/global";
import { IconMoon, IconSun } from "@douyinfe/semi-icons";
import { Button } from "@douyinfe/semi-ui";
import { useContext } from "react";


const ThemeIcon = () => {
  const { changeTheme, themeData } = useContext(GlobalContext);

  const changeThemeAction = () => {
    if (themeData === "darkAlgorithm") {
      changeTheme("defaultAlgorithm");
    } else {
      changeTheme("darkAlgorithm");
    }
  };

  return <Button
    theme="borderless"
    style={{
      color: "var(--semi-color-text-2)",
    }}
    icon={
      themeData === "darkAlgorithm" ? <IconSun /> : <IconMoon />
    }
    onClick={() => changeThemeAction()}
  ></Button>
}

export default ThemeIcon;