import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Skeleton } from "@/shared/ui";
import { PageSection } from "@/widgets/PageSection";
import { PreferenceItem } from "@/widgets/PreferenceItem";
import { useCurrentVersion } from "@/features/update";
import { UpdateModal } from "@/widgets/UpdateModal";

export const AboutPage = () => {
    const { t } = useTranslation();
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const handleUpdateModalClose = () => {
        setIsUpdateModalOpen(false);
    }

    const { data: currentVersion, isLoading: isLoadingCurrent } = useCurrentVersion();
    
    return (
        <>
            <PageSection title={t("about.details.title")}>
                <PreferenceItem
                    label={t("about.details.name.label")}
                    description={t("about.details.name.description")}
                    control={<span>{t("common.appName")}</span>}
                />
                
                <PreferenceItem
                    label={t("about.details.author.label")}
                    description={t("about.details.author.description")}
                    control={
                        <a
                            href="https://github.com/zeleyy"
                            target="_blank"
                            data-tauri-drag-window
                        >
                            Zeleyy
                        </a>
                    }
                />
            </PageSection>

            <PageSection title={t("about.updates.title")}>
                <PreferenceItem
                    label={t("about.updates.version.label")}
                    description={isLoadingCurrent
                        ? <Skeleton radius="sm" height={19} maxWidth={40}/>
                        : currentVersion
                    }
                    control={
                        <Button
                            size="small"
                            onClick={() => setIsUpdateModalOpen(true)}    
                        >
                            {t("about.updates.version.button")}
                        </Button>
                    }
                />
            </PageSection>

            <PageSection title={t("about.links.title")}>
                <PreferenceItem
                    label={t("about.links.github.label")}
                    description={t("about.links.github.description")}
                    control={
                        <a
                            href="https://github.com/zeleyy/zeleyy-authenticator"
                            target="_blank"
                            data-tauri-drag-window
                        >
                            zeleyy-authenticator
                        </a>
                    }
                />
                
                <PreferenceItem
                    label={t("about.links.report.label")}
                    description={t("about.links.report.description")}
                    control={
                        <a
                            href="https://github.com/zeleyy/zeleyy-authenticator/issues/new"
                            target="_blank"
                            data-tauri-drag-window
                        >
                            {t("about.links.report.link")}
                        </a>
                    }
                />
            </PageSection>

            <PageSection title={t("about.license.title")}>
                <PreferenceItem
                    label={t("about.license.type.label")}
                    description={t("about.license.type.description")}
                    control={<span>MIT License</span>}
                />
            </PageSection>

            <UpdateModal
                open={isUpdateModalOpen}
                onClose={handleUpdateModalClose}
            />
        </>
    );
};