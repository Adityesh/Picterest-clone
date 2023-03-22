import { useModalStore } from "~/store/modal";
import {
    Modal,
    Image as MantineImage,
    Group,
    Text,
    Skeleton,
} from "@mantine/core";
import styles from "./AddModal.module.scss";
import { useMemo, useState } from "react";
import { api } from "~/utils/api";
import Button from "../ui/Button";
import { showToast } from "~/utils/functions";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "~/utils/message";
import { useFilterStore } from "~/store/filter";

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
    const utils = api.useContext();
    const { mutateAsync } = api.pin.addPin.useMutation({
        onSuccess: () => {
            utils.pin.getPins.invalidate();
        },
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

    const isFormValid =
        isValidImage &&
        formState.image.length > 0 &&
        formState.title.length > 0;

    const handleAddForm = (type: "close" | "open") => {
        setFormState(initFormState);
        type === "close" && handleModal(false);
    };

    const handleFormChange = (type: "image" | "title", value: string) => {
        if (type === "image" && value.length === 0) {
            setFormState({
                ...formState,
                imageProps: {
                    error: false,
                    loading: false,
                    valid: false,
                },
            });
        }
        setFormState({
            ...formState,
            [type]: value,
        });
    };

    const handleImageValidation = () => {
        const { image, imageProps, title } = formState;

        if (image.length === 0) return;

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
            await mutateAsync({
                image: formState.image,
                title: formState.title,
            });
            handleModal(false);
            setFormState(initFormState);
            showToast(SUCCESS_MESSAGES.ADD_PIN, "default");
        } catch (error) {
            showToast(ERROR_MESSAGES.ACTION, "error");
        }
    };

    return (
        <Modal
            opened={open}
            onClose={() => handleAddForm("close")}
            title={
                <span
                    style={{
                        fontFamily: "Josefin Sans",
                        fontWeight: 600,
                        fontSize: "1.5rem",
                    }}
                >
                    {type === "add" ? "Add Pin" : "Update Pin"}
                </span>
            }
            classNames={{ modal: styles.modalContainer }}
            overlayBlur={5}
        >
            <div className={styles.modalBody}>
                <Skeleton
                    visible={formState.imageProps.loading}
                    height={120}
                    width={200}
                    sx={{
                        margin: "0 auto",
                        "&::before": {
                            backgroundColor: "#8BC6EC",
                            backgroundImage: `linear-gradient(135deg, #8BC6EC 0%, #9599E2 100%)`,
                        },
                    }}
                >
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
                            height:
                                formState?.image.length === 0
                                    ? "120px !important"
                                    : undefined,
                        }}
                    />
                </Skeleton>
                <input
                    className={styles.input}
                    placeholder="Enter image url"
                    onChange={(e) => handleFormChange("image", e.target.value)}
                    onBlur={handleImageValidation}
                />
                <input
                    className={styles.input}
                    placeholder="Enter title"
                    onChange={(e) => handleFormChange("title", e.target.value)}
                />
                <Group sx={{ marginTop: "1rem" }}>
                    <Button
                        variant="default"
                        value="Add"
                        disabled={!isFormValid}
                        style={{ paddingTop: "0.25rem" }}
                        onClick={handleAddPin}
                    />
                    <Button
                        value="Cancel"
                        variant="secondary"
                        onClick={() => handleAddForm("close")}
                        style={{
                            paddingTop: "0.25rem",
                        }}
                    />
                </Group>
            </div>
        </Modal>
    );
}
