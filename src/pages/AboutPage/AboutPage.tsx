import { Button } from "@/shared/ui";
import { PageSection } from "@/widgets/PageSection";
import { PreferenceItem } from "@/widgets/PreferenceItem";

export const AboutPage = () => {
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
                    label="Текущая версия"
                    description="Установленная версия приложения"
                    control={<span>1.0.0</span>}
                />
                
                <PreferenceItem
                    label="Доступная версия"
                    description="Последняя версия на GitHub"
                    control={<span>1.1.0</span>}
                />
                
                <PreferenceItem
                    label="Обновить"
                    description="Загрузить последнюю версию"
                    control={
                        <Button size="small" disabled>
                            Обновить
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
                            href="#" 
                            style={{ color: 'var(--primary)', textDecoration: 'none' }}
                        >
                            github.com/zeleyy/authenticator →
                        </a>
                    }
                />
                
                <PreferenceItem
                    label="Сообщить о проблеме"
                    description="Bug report или предложение"
                    control={
                        <a 
                            href="#" 
                            style={{ color: 'var(--primary)', textDecoration: 'none' }}
                        >
                            Создать issue →
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
        </>
    );
};