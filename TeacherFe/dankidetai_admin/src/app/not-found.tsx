"use client"
import Image from "next/image";
import notFoundImg from "@/resources/image/huit/notFound.png"

export default function NotFoundPage() {
    return <Image src={notFoundImg} style={{ width: "100vw", height: "100vh" }} alt="404" />
}