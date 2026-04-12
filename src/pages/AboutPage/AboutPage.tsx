import { useState } from "react";
import { Button, Skeleton } from "@/shared/ui";
import { PageSection } from "@/widgets/PageSection";
import { PreferenceItem } from "@/widgets/PreferenceItem";
import { useCurrentVersion } from "@/features/update";
import { UpdateModal } from "@/widgets/UpdateModal";

export const AboutPage = () => {
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const handleUpdateModalClose = () => {
        setIsUpdateModalOpen(false);
    }

    const { data: currentVersion, isLoading: isLoadingCurrent } = useCurrentVersion();
    
    return (
        <>
            <PageSection title="Детали">
                <PreferenceItem
                    label="Название"
                    description="Zeleyy Authenticator"
                    control={<span style={{ color: 'var(--primary)' }}>Zeleyy</span>}
                />
                
                <PreferenceItem
                    label="Автор"
                    description="Разработчик приложения"
                    control={<span>Zeleyy</span>}
                />
            </PageSection>

            <PageSection title="Обновления">
                <PreferenceItem
                    label="Версия приложения"
                    description={isLoadingCurrent
                        ? <Skeleton radius="sm" height={19} maxWidth={40}/>
                        : currentVersion
                    }
                    control={
                        <Button
                            size="small"
                            onClick={() => setIsUpdateModalOpen(true)}    
                        >
                            обновление
                        </Button>
                    }
                />
            </PageSection>

            <PageSection title="Ссылки">
                <PreferenceItem
                    label="GitHub"
                    description="Исходный код"
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
                    label="Сообщить о проблеме"
                    description="Bug report или предложение"
                    control={
                        <a
                            href="https://github.com/zeleyy/zeleyy-authenticator/issues/new"
                            target="_blank"
                            data-tauri-drag-window
                        >
                            Создать issue
                        </a>
                    }
                />
            </PageSection>

            <PageSection title="Лицензия">
                <PreferenceItem
                    label="Тип лицензии"
                    description="Распространяется бесплатно"
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