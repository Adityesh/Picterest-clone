import { useSession } from "next-auth/react";
import { useFilterStore } from "~/store/filter";
import { useModalStore } from "~/store/modal";
import Button from "../ui/Button";
import SelectInput from "../ui/Select";
import styles from "./Filters.module.scss";

export default function Filters() {
    const { handleModal } = useModalStore();
    const { count, orderBy, updateCount, updateOrder } = useFilterStore();
    const { data: userSession } = useSession();
    const isLoggedIn = userSession !== null;
    return (
        <div className={styles.filterContainer}>
            <SelectInput
                label="Count"
                placeholder="Count"
                data={["10", "20", "100"]}
                value={count.toString()}
                onChange={(value) => updateCount(Number(value))}
            />
            <SelectInput
                label="Order"
                placeholder="Order"
                data={["asc", "desc"]}
                value={orderBy?.ordering}
                onChange={(value) =>
                    updateOrder("title", value as "asc" | "desc")
                }
            />
            {isLoggedIn && (
                <Button
                    value="Add"
                    parentStyle={{ alignSelf: "end" }}
                    variant="default"
                    onClick={() => handleModal(true)}
                />
            )}
        </div>
    );
}
