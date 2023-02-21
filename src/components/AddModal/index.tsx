import { useModalStore } from "~/store/modal";
import {
    Modal,
    Image as MantineImage,
    Input,
    Group,
    Button,
    Text,
} from "@mantine/core";
import styles from "./AddModal.module.scss";
import { useState } from "react";

async function isImageURL(url: string): Promise<boolean> {
    return new Promise((resolve) => {
        const img = new Image();

        img.src = url;
        img.onload = () => resolve(true);
        
        img.onerror = () => resolve(false);
    });
}

type FormState = {
    image: string;
    title: string;
    isValidImage: boolean;
};

export default function AddModal() {
    const { open, type, handleModal } = useModalStore((state) => state);
    const [formState, setFormState] = useState<FormState>({
        image: "",
        isValidImage: false,
        title: "",
    });

    const handleFormChange = (type: "image" | "title", value: string) => {
        setFormState({
            ...formState,
            [type]: value,
        });
    };

    return (
        <Modal
            opened={open}
            onClose={() => handleModal(false)}
            title={type === "add" ? "Add Pin" : "Update Pin"}
            classNames={{ modal: styles.modalContainer }}
        >
            <div className={styles.modalBody}>
                <MantineImage
                    src={(formState?.isValidImage && formState.image) || ""}
                    width={200}
                    placeholder={<Text align="center">This image contained the meaning of life</Text>}
                    sx={{
                        margin: "1rem auto",
                        objectFit: "cover",
                        // background: "grey",
                        height: formState?.image.length === 0 ? "120px" : undefined,
                    }}
                />
                <Input
                    placeholder="Enter image url"
                    onChange={(e) => handleFormChange("image", e.target.value)}
                    onBlur={async () =>
                        setFormState({
                            ...formState,
                            isValidImage: await isImageURL(formState.image),
                        })
                    }
                />
                <Input
                    placeholder="Enter title"
                    onChange={(e) => handleFormChange("title", e.target.value)}
                />
                <Group sx={{ marginTop: "1rem" }}>
                    <Button variant="light">
                        {type === "add" ? "Add Pin" : "Update Pin"}
                    </Button>
                    <Button
                        onClick={() => handleModal(false)}
                        variant="light"
                        color={"red"}
                    >
                        Cancel
                    </Button>
                </Group>
            </div>
        </Modal>
    );
}
