import { Flex } from "@/shared/ui";
import { QrScanner } from "@/features/QrScanner";

export const AddQrPage = () => {
    // TODO перенос на следующую страницу с подтверждением и отправкой
    return (
        <Flex align="center" justify="center">
            <QrScanner/>
        </Flex>
    );
};