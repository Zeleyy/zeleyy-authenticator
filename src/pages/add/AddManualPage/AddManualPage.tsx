import { useState, type ChangeEvent, type SyntheticEvent } from "react";
import { Button, Flex, Input } from "@/shared/ui";
import { invoke } from "@tauri-apps/api/core";
import { queryClient } from "@/shared/api";
import { useNavigate } from "react-router-dom";

export const AddManualPage = () => {
    const [formData, setFormData] = useState({
        accountName: "",
        secret: "",
    });
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        try {
            if (formData.secret.length < 16) {
                throw new Error("Ключ слишком короткий");
            }

            if (formData.accountName.length === 0) {
                throw new Error("Название слишком короткое");
            }

            console.log(formData);
            await invoke<number>("add_account", formData);

            queryClient.invalidateQueries({ queryKey: ["accounts"] });
            navigate("/");
        } catch (error) {
            console.error("ERROR: ", error);
        }
    };

    return (
        <>
            <Flex as="form" direction="column" gap="md" onSubmit={handleSubmit}>
                <Flex direction="column" gap="sm">
                    <Input
                        name="accountName"
                        placeholder="Название"
                        onChange={handleChange}
                    />
                    <Input
                        name="secret"
                        placeholder="Ключ"
                        onChange={handleChange}
                    />
                </Flex>
                
                <Button type="submit" fullWidth>Добавить</Button>
            </Flex>
        </>
    );
};