import { ReactNode } from 'react'
import Header from "~/components/Header";

type Props = {
    children : ReactNode
}

export default function Layout( { children } :Props ) {
    return <>
        <Header />
        {children}
    </>
}