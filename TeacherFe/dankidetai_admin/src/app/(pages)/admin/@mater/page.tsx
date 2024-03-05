import React from 'react'
import Link from "next/link";
import { Button } from "primereact/button";
export default function MaterPage() {
    return (<>
        <div>MaterPage admin</div>
        {/* <Button className="my-3"> */}
        <Link className='bt' href={"/admin/department"}>Quản lý Ngành</Link>
        {/* </Button> */}
    </>
    )
}
