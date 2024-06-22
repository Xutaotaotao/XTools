import { Typography } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';
export default function Home() {
  const {t} = useTranslation()
  return <Typography.Title>
    {t("WellcomeToXTools")}
  </Typography.Title>;
}