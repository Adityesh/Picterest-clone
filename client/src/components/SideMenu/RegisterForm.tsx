import { Button, Input } from '@mantine/core'
import { MdAlternateEmail, MdPassword } from 'react-icons/md'
import { FieldError, SubmitHandler, useForm, UseFormRegister } from "react-hook-form";
import { HiUser } from 'react-icons/hi'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, UserRegisterInput } from '../../../../server/src/schema/user.schema';
import { trpc } from '../../trpc';
import { createDrawerStore } from '../../store/menu';
import { showNotification, useNotifications } from '@mantine/notifications';

type InputProps = {
    register: UseFormRegister<{
        name: string;
        email: string;
        password: string;
    }>,
    error: FieldError | undefined,
    placeholder: string,
    style?: React.CSSProperties | undefined,
    type?: React.HTMLInputTypeAttribute | undefined,
    icon?: React.ReactNode | undefined,
    inputName: "email" | "password" | "name"
}

const RenderInput: React.FC<InputProps> = ({ error, register, placeholder, style, type, icon, inputName }) => {
    return (
        <div style={{ ...style, marginBottom: "1rem" }}>
            <Input
                icon={icon}
                variant="filled"
                placeholder={placeholder}
                radius="xs"
                type={type}
                {...register(inputName)}
            />
            <Input.Error >{error?.message}</Input.Error>
        </div>
    )
}

export default function RegisterForm() {
    const { setMenuStage } = createDrawerStore()
    
    const registerMutation = trpc.user.registerUser.useMutation({
        onSuccess: (data) => {
            showNotification({
                title: "Registration done",
                message: "Redirecting to login"
            })
            setMenuStage("login")
        }
    })
    const { register, handleSubmit, formState: { errors, isValid } } = useForm<UserRegisterInput>({
        resolver: zodResolver(registerSchema)
    })


    const onRegister: SubmitHandler<UserRegisterInput> = (data, event?: React.BaseSyntheticEvent<object, any, any> | undefined) => {
        event?.preventDefault()
        if(isValid) {
            registerMutation.mutate(data)
        }
    }

    return (
        <form onSubmit={handleSubmit(onRegister)}>
            <RenderInput inputName="email" icon={<MdAlternateEmail />} error={errors.email} register={register} placeholder="Your email" />
            <RenderInput inputName="name" icon={<HiUser />} error={errors.name} register={register} placeholder="Your name" />
            <RenderInput inputName="password" icon={<MdPassword />} type="password" error={errors.password} register={register} placeholder="Your password" />
            <Button type='submit' variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 60 }}>Register</Button>
        </form>
    )
}