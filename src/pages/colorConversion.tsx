import { Button, Card, ColorPicker, Form, Input } from "antd";
import { useState, useEffect, useMemo } from "react";
import { colord,extend } from "colord";
import type { Colord } from 'colord';
import namesPlugin from "colord/plugins/names";
import hwbPlugin from "colord/plugins/hwb";
import lchPlugin from "colord/plugins/lch";
import cmykPlugin from "colord/plugins/cmyk";
import type { ColorPickerProps, GetProp } from 'antd';

type Color = GetProp<ColorPickerProps, 'value'>;

extend([namesPlugin,hwbPlugin,lchPlugin,cmykPlugin]);


export default function ColorConversion() {
  const [form] = Form.useForm();
  const [color, setColor] = useState<Color>("#1677ff");

  const parseColor = (color: any) => {
    const colorVal: Colord = colord(color);
    const colorValues = {
      colorName: colorVal.toName({ closest: true }),
      colorHex: colorVal.toHex(),
      colorRgb: colorVal.toRgbString(),
      colorHsl: colorVal.toHslString(),
      colorHwb: colorVal.toHwbString(),
      colorLch: colorVal.toLchString(),
      colorCmyk: colorVal.toCmykString()
    };
    return colorValues;
  }

  const handleColorChange = (newColor: any) => {
    setColor(newColor)
    const colorVal:Colord = colord(newColor.toHexString());
    form.setFieldsValue({
      ...parseColor(colorVal)
    })
  };

  const handleInputChange = (e: any) => {
    const { value } = e.target;
    try {
      const colorVal:Colord = colord(value)
      if (colorVal.isValid()){
        setColor(colorVal.toHex());
        form.setFieldsValue({
          ...parseColor(colorVal)
        })
      }
    } catch {

    }
    
  };

  const bgColor = useMemo<string>(
    () => (typeof color === 'string' ? color : color!.toHexString()),
    [color],
  );

  const btnStyle: React.CSSProperties = {
    backgroundColor: bgColor,
    width: '100%'
  };

  useEffect(() => {
    form.setFieldsValue({
      ...parseColor(color)
    })
  },[])

  return (
    <div style={{display:'flex', justifyContent:'center', alignItems:'center',flexDirection:'column'}}>
      <Card  style={{width:'50%'}}>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          form={form}
          initialValues={parseColor(color)}
        >
          <Form.Item label="颜色拾取器">
            <ColorPicker style={{width:'100%'}} value={color} onChange={handleColorChange} >
            <Button type="primary" style={btnStyle}>
            </Button>
            </ColorPicker>
          </Form.Item>
          <Form.Item label="Hex" name="colorHex">
            <Input onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Rgb" name="colorRgb">
            <Input onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Hsl" name="colorHsl">
            <Input onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Hwb" name="colorHwb">
            <Input onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Lch" name="colorLch">
            <Input onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Cmyk" name="colorCmyk">
            <Input onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="颜色名称" name="colorName">
            <Input onChange={handleInputChange} />
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}