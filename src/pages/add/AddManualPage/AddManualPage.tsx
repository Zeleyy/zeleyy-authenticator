import { useState, type ChangeEvent, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Flex, Input, StatusAlert } from "@/shared/ui";
import { useAddManualAccount } from "@/entities/account/hooks";

export const AddManualPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { mutate: addAccount, isPending } = useAddManualAccount();

    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        accountName: "",
        secret: "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();

        if (formData.accountName.trim().length === 0) return setError(t("add.manual.errors.nameTooShort"));
        if (formData.secret.trim().length < 16) return setError(t("add.manual.errors.secretTooShort"));

        addAccount(formData, {
            onSuccess: () => navigate("/"),
            onError: (error) => {
                console.error("Add account error:", error);
                setError(error.toString());
            },
        });
    };

    return (
        <>
            <StatusAlert message={error} variant="error" position="fixed" placement="bottom" offsetY={100}/>

            <Flex as="form" direction="column" gap="md" onSubmit={handleSubmit}>
                <Flex direction="column" gap="sm">
                    <Input
                        name="accountName"
                        placeholder={t("add.manual.accountName.placeholder")}
                        value={formData.accountName}
                        onChange={handleChange}
                        disabled={isPending}
                    />
                    <Input
                        name="secret"
                        placeholder={t("add.manual.secret.placeholder")}
                        value={formData.secret}
                        onChange={handleChange}
                        disabled={isPending}
                    />
                </Flex>
                
                <Button
                    type="submit"
                    fullWidth
                    disabled={isPending}
                >
                    {isPending ? t("add.manual.submitting") : t("add.manual.submit")}
                </Button>
            </Flex>
        </>
    );
};