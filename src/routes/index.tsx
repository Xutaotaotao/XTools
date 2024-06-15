import { IconImage, IconIntro } from "@douyinfe/semi-icons-lab";
import { Routes, Route } from 'react-router-dom';
import i18n from '@/locales/index'
import Layout from '@/layout';
import Home from "@/pages/home";
import ImageSlicing from "@/pages/imageSlicing";


 export const menu = [
  {
    itemKey: "/",
    text: i18n.t("home"),
    icon: <IconIntro />,
    element: <Home />
  },
  {
    itemKey: "/imageSlicing",
    text: i18n.t("imageSlicing"),
    icon: <IconImage />,
    des:i18n.t("imageSlicingDes"),
    element: <ImageSlicing />
  },
]

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {
          menu.map((item, index) => (
            <Route key={index} path={item.itemKey} element={item.element} />
          ))
        }
      </Route>
    </Routes>
  )
}

export default Router;