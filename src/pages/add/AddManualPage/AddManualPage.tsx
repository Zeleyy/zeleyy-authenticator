import { useState, type ChangeEvent, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Flex, Input } from "@/shared/ui";
import { useAddManualAccount } from "@/entities/account/hooks";

export const AddManualPage = () => {
    const navigate = useNavigate();
    const { mutate: addAccount, isPending } = useAddManualAccount();

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

        if (formData.accountName.trim().length === 0) return alert("Введите название");
        if (formData.secret.trim().length < 16) return alert("Ключ должен быть не менее 16 символов");

        addAccount(formData, {
            onSuccess: () => navigate("/"),
            onError: (error) => {
                console.error("Add account error:", error);
                alert("Не удалось добавить аккаунт");
            },
        });
    };

    return (
        <Flex as="form" direction="column" gap="md" onSubmit={handleSubmit}>
            <Flex direction="column" gap="sm">
                <Input
                    name="accountName"
                    placeholder="Название (например, GitHub)"
                    value={formData.accountName}
                    onChange={handleChange}
                    disabled={isPending}
                />
                <Input
                    name="secret"
                    placeholder="Секретный ключ (Base32)"
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
                {isPending ? "Добавление..." : "Добавить аккаунт"}
            </Button>
        </Flex>
    );
};