import { api } from "~/utils/api";
import styles from "./PinGrid.module.scss";
import Masonry from "react-masonry-css";

const breakpointColumnsObj = {
    default: 8,
    1100: 3,
    700: 2,
    500: 1
  };

export default function PinGrid() {
    const { data: pins, refetch: fetchPins } = api.pin.getPins.useQuery({
        count: 20,
        orderBy: {
            field: "title",
            ordering: "asc",
        },
    });
    return (
        <Masonry
            breakpointCols={breakpointColumnsObj}
            className={styles.gridContainer!}
            columnClassName={styles.gridColumn!}
        >
            {pins?.map((pin) => {
                return (
                    <div key={pin.id}>
                        <img
                            src={pin.image}
                            style={{ width: 120, height: "auto" }}
                        />
                        <p>{pin.title}</p>
                    </div>
                );
            })}
        </Masonry>
    );
}
