import { useTranslation } from "react-i18next";


export const AddQrPage = () => {
    const { t } = useTranslation();

    return (
        <div>{t("common.inDevelopment")}</div>
    );
};