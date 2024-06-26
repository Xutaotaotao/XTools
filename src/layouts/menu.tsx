
import { IconImage, IconIntro } from "@douyinfe/semi-icons-lab";
import ImageCompressSvg from "@/assets/img/imageCompress.svg";
import JsonSvg from "@/assets/img/json.svg";
import JsonDiffSvg from "@/assets/img/jsonDiff.svg";
import imgScanSvg from "@/assets/img/imgScan.svg";
import imgFormatConversion from "@/assets/img/imgFormatConversion.svg";
import timeSvg from "@/assets/img/time.svg";
import colorSvg from "@/assets/img/color.svg";
import imgEdit from "@/assets/img/imgEdit.svg";

export const NAV_MAP = [
  {
    itemKey: "/home",
    text: "首页",
    icon: <IconIntro />,
  },
  {
    itemKey: "/jsonFormatting",
    text: "JSON格式化",
    icon: <img src={JsonSvg} />,
    des:'将JSON格式化为可读性更好的格式'
  },
  {
    itemKey: "/jsonDiff",
    text: "JSON对比",
    icon: <img src={JsonDiffSvg} />,
    des:'比较两个JSON对象，并展示差异'
  },
  {
    itemKey: "/chrono",
    text: "计时器",
    icon: <img src={timeSvg} />,
    des:'用于监控事物的持续时间'
  },
  {
    itemKey: "/colorConversion",
    text: "颜色转换器",
    icon: <img src={colorSvg} />,
    des:'在不同格式之间转换颜色'
  },
  {
    itemKey: "/imageSlicing",
    text: "图片分割",
    icon: <IconImage />,
    des:'将图片切割成多张小图片'
  },
  {
    itemKey: "/imageCompress",
    text: "图片压缩",
    icon: <img src={ImageCompressSvg} />,
    des:'压缩图片大小，支持单个和批量压缩'
  },
  {
    itemKey: "/imgScan",
    text: "图片识别文字",
    icon: <img src={imgScanSvg} />,
    des:'识别图片中的文字'
  },
  {
    itemKey: "/imgFormatConversion",
    text: "图片格式转换",
    icon: <img src={imgFormatConversion} />,
    des:'图片格式互相转换'
  },
  {
    itemKey: "/imgEditor",
    text: "图片编辑器",
    icon: <img src={imgEdit} />,
    des:'图片编辑器,支持裁剪、旋转、滤镜等'
  },
];