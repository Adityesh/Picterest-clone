import { forwardRef } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { Group, Avatar, Text, Menu, UnstyledButton } from "@mantine/core";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import styles from "./Header.module.scss";

interface UserButtonProps extends React.ComponentPropsWithoutRef<"button"> {
    user:
        | ({
              id: string;
          } & {
              name?: string | null | undefined;
              email?: string | null | undefined;
              image?: string | null | undefined;
          })
        | undefined;
}

const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
    ({ user, ...others }: UserButtonProps, ref) => (
        <UnstyledButton
            ref={ref}
            sx={(theme) => ({
                display: "block",
                width: "100%",
                padding: theme.spacing.md,
                color: "white",
            })}
            {...others}
        >
            <Group>
                <Avatar src={user?.image} radius="md" />
                {<MdOutlineKeyboardArrowDown size="1.5rem" />}
            </Group>
        </UnstyledButton>
    )
);

function MenuNav() {
    const session = useSession();
    return (
        <Menu
            position="bottom-end"
            classNames={{
                dropdown: styles.dropDown,
                label: styles.menuLabel,
                item: styles.menuItem,
            }}
        >
            <Menu.Target>
                <UserButton user={session.data?.user} />
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Item>Settings</Menu.Item>
                <Menu.Item>Pins</Menu.Item>
                <Menu.Item>Users</Menu.Item>
                <Menu.Divider />
                <Menu.Item>Delete my account</Menu.Item>
                <Menu.Item onClick={() => void signOut()}>Log out</Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}

export default MenuNav;
