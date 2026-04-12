import { type SyntheticEvent, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Flex, Input, Button } from '@/shared/ui';
import { useUpdateAccount } from '@/entities/account';

export const EditPage = () => {
    const navigate = useNavigate();
    const { accountId } = useParams<{ accountId: string }>();
    const { state } = useLocation();
    const [newName, setNewName] = useState(state?.accountName ?? "");
    const { mutate: updateAccount, isPending } = useUpdateAccount();

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();

        if (!accountId) return alert("ID аккаунта не найден");
        if (!newName.trim()) return alert("Название слишком короткое");

        updateAccount(
            { accountId: Number(accountId), newName },
            {
                onSuccess: () => {
                    navigate("/");
                },
                onError: (error) => {
                    console.error("Update error:", error);
                    alert("Не удалось обновить аккаунт");
                }
            }
        );
    };

    return (
        <Flex as="form" direction="column" gap="md" onSubmit={handleSubmit}>
            <Input
                placeholder="Новое название"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                disabled={isPending}
            />
            <Button 
                type="submit" 
                fullWidth 
                disabled={isPending || !newName.trim()}
            >
                {isPending ? "Сохранение..." : "Сохранить"}
            </Button>
        </Flex>
    );
};