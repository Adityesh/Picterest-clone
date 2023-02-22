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
import { useMemo, useState } from "react";
import { api } from "~/utils/api";

type FormState = {
    image: string;
    title: string;
    imageProps: {
        loading: boolean;
        error: boolean;
        valid: boolean;
    };
};

const initFormState: FormState = {
    image: "",
    title: "",
    imageProps: {
        loading: false,
        error: false,
        valid: false,
    },
};

export default function AddModal() {
    const { refetch : fetchPins } = api.pin.getPins.useQuery({ count: 5,
        orderBy: {
            field: "title",
            ordering: "asc",
        },  })
    const { mutateAsync } = api.pin.addPin.useMutation({
        onSuccess : () => fetchPins()
    });
    const { open, type, handleModal } = useModalStore((state) => state);
    const [formState, setFormState] = useState<FormState>(initFormState);

    const isValidImage = useMemo(() => {
        return (
            formState?.image.length > 0 &&
            formState.imageProps.valid &&
            !formState.imageProps.error &&
            !formState.imageProps.loading
        );
    }, [
        formState?.image,
        formState.imageProps.valid,
        formState.imageProps.error,
        formState.imageProps.loading,
    ]);

    const isFormValid = isValidImage && formState.image.length > 0 && formState.title.length > 0

    const handleAddForm = (type: "close" | "open") => {
        setFormState(initFormState);
        type === "close" && handleModal(false);
    };

    const handleFormChange = (type: "image" | "title", value: string) => {
        if(type === "image" && value.length === 0) {
            setFormState({
                ...formState,
                imageProps : {
                    error : false,
                    loading : false,
                    valid : false
                }
            })
        }
        setFormState({
            ...formState,
            [type]: value,
        });
    };

    const handleImageValidation = () => {
        const { image, imageProps, title } = formState;

        if (image.length === 0) return

        // Start loading if image url is not empty
        setFormState({
            ...formState,
            imageProps: {
                ...imageProps,
                loading: true,
                error: false,
                valid: false,
            },
        });

        const img = new Image();
        img.src = image;

        // When image has loaded completely
        img.onload = () =>
            setFormState({
                ...formState,
                imageProps: {
                    ...imageProps,
                    loading: false,
                    valid: true,
                    error: false,
                },
            });

        // Error while loading image
        img.onerror = () =>
            setFormState({
                ...formState,
                imageProps: {
                    ...imageProps,
                    loading: false,
                    error: true,
                    valid: false,
                },
            });
    };

    const handleAddPin = async () => {
        try {
            const result = await mutateAsync({
                image : formState.image,
                title : formState.title
            })
        } catch(error) {
            console.log(error)
        }
    }

    return (
        <Modal
            opened={open}
            onClose={() => handleAddForm("close")}
            title={type === "add" ? "Add Pin" : "Update Pin"}
            classNames={{ modal: styles.modalContainer }}
        >
            <div className={styles.modalBody}>
                <MantineImage
                    src={formState.image || ""}
                    width={200}
                    placeholder={
                        <Text align="center">
                            This image contained the meaning of life
                        </Text>
                    }
                    sx={{
                        margin: "1rem auto",
                        objectFit: "cover",
                        // background: "grey",
                        height:
                            formState?.image.length === 0 ? "120px" : undefined,
                    }}
                />
                {formState.imageProps.loading && "Loading"}
                <Input
                    className={styles.input}
                    placeholder="Enter image url"
                    onChange={(e) => handleFormChange("image", e.target.value)}
                    onBlur={handleImageValidation}
                />
                <Input
                    className={styles.input}
                    placeholder="Enter title"
                    onChange={(e) => handleFormChange("title", e.target.value)}
                />
                <Group sx={{ marginTop: "1rem" }}>
                    <Button color="green" disabled={!isFormValid} onClick={handleAddPin}>
                        {type === "add" ? "Add Pin" : "Update Pin"}
                    </Button>
                    <Button onClick={() => handleAddForm("close")} color={"red"}>
                        Cancel
                    </Button>
                </Group>
            </div>
        </Modal>
    );
}
