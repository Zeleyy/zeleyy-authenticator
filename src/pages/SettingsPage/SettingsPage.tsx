import { useState } from "react";
import { useTheme } from "@/shared/lib/hooks";
import { Button, Flex, Icon, Switch } from "@/shared/ui";
import { PageSection } from "@/widgets/PageSection";
import { PreferenceItem } from "@/widgets/PreferenceItem";

export const SettingsPage = () => {
    const { isDark, toggleTheme } = useTheme();
    const [isChecked, setIsChecked] = useState(false);

    return (
        <>
            <PageSection title="Внешний вид">
                <PreferenceItem
                    label="Тема оформления"
                    description="Выберите цветовую схему интерфейса"
                    control={
                        <Button variant="outline" onClick={toggleTheme}>
                            {isDark
                                ? <Icon name="icon-sun" size={20}/>
                                : <Icon name="icon-moon" size={20}/>
                            }
                        </Button>
                    }
                />
            </PageSection>

            <PageSection title="Безопасность">
                <PreferenceItem
                    label="PIN-код"
                    description="Запрашивать PIN-код при запуске"
                    control={
                        <Flex align="center">
                            <Switch
                                checked={isChecked}
                                onChange={(e) => setIsChecked(e.target.checked)}
                            />
                        </Flex>
                    }
                />
            </PageSection>
        </>
    );
};