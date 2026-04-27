import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePageAnimation, useTheme } from "@/shared/lib/hooks";
import { Button, Flex, Icon, Switch, Select } from "@/shared/ui";
import { PageSection } from "@/widgets/PageSection";
import { PreferenceItem } from "@/widgets/PreferenceItem";

export const SettingsPage = () => {
    const { t, i18n } = useTranslation();
    const { isDark, toggleTheme } = useTheme();
    const [isChecked, setIsChecked] = useState(false);
    const { enabled, toggle } = usePageAnimation();

    return (
        <>
            <PageSection title={t("settings.appearance.title")}>
                <PreferenceItem
                    label={t("settings.appearance.theme.label")}
                    description={t("settings.appearance.theme.description")}
                    control={
                        <Button variant="outline" onClick={toggleTheme}>
                            {isDark
                                ? <Icon name="icon-sun" size={20}/>
                                : <Icon name="icon-moon" size={20}/>
                            }
                        </Button>
                    }
                />
                <PreferenceItem
                    label={t("settings.appearance.language.label")}
                    description={t("settings.appearance.language.description")}
                    control={
                        <Select
                            value={i18n.language}
                            onChange={(lang) => i18n.changeLanguage(lang)}
                            options={[
                                { value: 'ru', label: 'Русский' },
                                { value: 'en', label: 'English' },
                            ]}
                        />
                    }
                />
                <PreferenceItem
                    label={t("settings.appearance.animation.label")}
                    description={t("settings.appearance.animation.description")}
                    control={
                        <Flex align="center">
                            <Switch
                                checked={enabled}
                                onChange={toggle}
                            />
                        </Flex>
                    }
                />
            </PageSection>

            <PageSection title={t("settings.security.title")}>
                <PreferenceItem
                    label={t("settings.security.pin.label")}
                    description={t("settings.security.pin.description")}
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