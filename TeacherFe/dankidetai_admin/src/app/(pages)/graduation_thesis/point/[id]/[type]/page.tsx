"use client"

import API from "@/assets/configs/api";
import { request } from "@/assets/helpers/request";
import { InputNumber } from "@/resources/components/form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { cloneDeep } from "lodash";
import { useParams } from 'next/navigation'
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { toast } from "react-toastify";
import * as yup from "yup"
interface fieldsType {
    field: string;
    code: 'code' | "name" | "POINT_INSTRUCTORS.point" | "POINT_THESIS_ADVISOR.point" | "POINT_AVG";
    typeInput: string;
    numberID: string
}
export const fields: fieldsType[] = [
    { field: "mssv", code: "code", typeInput: "text", numberID: "0" },
    { field: "Tên", code: "name", typeInput: "text", numberID: "0" },
    { field: "Điểm phản biện", code: "POINT_INSTRUCTORS.point", typeInput: "number", numberID: "1" },
    { field: "Điểm hướng dẫn", code: "POINT_THESIS_ADVISOR.point", typeInput: "number", numberID: "2" },
    { field: "Điểm trung bình", code: "POINT_AVG", typeInput: "text", numberID: "0" },
]
interface IpointInsert {
    studentId: string,
    point: number
}

const STATUS_PAGE = {
    READ_ONLY: "readOnly",
    INSERT: "insert"
}

export default function Page() {

    const params = useParams<{ id: string; type: string }>()
    const [statePage, setStatePage] = useState(STATUS_PAGE.READ_ONLY)
    const [points, setPoints] = useState<IpointInsert[]>([])

    const ResearchDetailQuery = useQuery<ReSearchType, AxiosError<ResponseType>>({

        queryKey: ['list-Research'],
        queryFn: async () => {
            const response: any = await request.get<ReSearchType>(`${API.reSearch.showDetail}${params.id}`);
            let responseData = response.data ?? [];
            responseData.result.group.students = responseData?.result?.group?.students?.map((student: StudentType) => {
                // console.log(student.points)
                const POINT_INSTRUCTORS = student.points?.find(p => p.typePoint.id === "1")
                const POINT_THESIS_ADVISOR = student.points?.find(p => p.typePoint.id === "2")
                const POINT_COUNCIL = student.points?.find(p => p.typePoint.id === "3")
                return {
                    ...student,
                    POINT_INSTRUCTORS: POINT_INSTRUCTORS,
                    POINT_THESIS_ADVISOR: POINT_THESIS_ADVISOR,
                    POINT_COUNCIL: POINT_COUNCIL,
                    POINT_AVG: POINT_INSTRUCTORS && POINT_THESIS_ADVISOR ? ((POINT_THESIS_ADVISOR.point + POINT_INSTRUCTORS.point) / 2) : undefined
                }
            })
            setPoints(responseData?.result?.group?.students?.map
                ((studentt: StudentType) => {
                    return {
                        studentId: studentt.id,
                        point: studentt.points?.find(p => p.typePoint.id === params.type)
                            ? studentt.points?.find(p => p.typePoint.id === params.type)?.point : 0
                    }
                }))

            // console.log(responseData.result.group.students)
            return responseData.result || [];
        },
    });

    const handleTemp = (studentId?: string, point?: number) => {
        if (!point || !studentId) return
        setPoints(prevPoint => {
            const newPoint = cloneDeep(prevPoint)
            const currentPoint = newPoint.find(p => p.studentId === studentId)
            if (!currentPoint) return newPoint
            currentPoint.point = point
            return newPoint
        })
    }


    const renderInput = (rowData: StudentType, field: string) => {
        // console.log(rowData, field, points)
        return (
            <InputNumber
                id=""
                onChange={e => handleTemp(rowData.id, e)}
                value={points.find(p => p.studentId === rowData.id)?.point}
            // onChange={(e) => { setPoints() }}
            //value={studentScores[rowData?.id]?.[field] || ""}
            //onChange={(e) => handleInputChange(rowData.id, field, e.target.value)}
            />
        );
    };

    const InsertPointsMutation = useMutation<any, AxiosError<ResponseType>, any>({
        mutationFn: (data: any) => {
            return request.post(API.point.insert, data)
        },
    });

    const insertPoint = () => {
        const data = {
            typePointId: params.type,
            points: points
        }
        InsertPointsMutation.mutate(data, {
            onSuccess: (_: any) => {
                toast.success("Nhập điểm thành công");
                ResearchDetailQuery.refetch();
                setStatePage(STATUS_PAGE.READ_ONLY)
            },
        })
    }


    return <div >
        {ResearchDetailQuery.data && <div />}
        <div style={{
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            paddingTop: "20%",
            maxWidth: "1000px",
            margin: "20px auto",
            position: "relative",
            backgroundImage: "url(https://gstatic.com/classroom/themes/Honors.jpg)"
        }}>
            <div
                style={{
                    position: 'absolute',
                    bottom: '10%',
                    left: '5%',
                    color: '#fff',
                    borderRadius: '8px'
                }}
            >
                <h2 >
                    {ResearchDetailQuery?.data?.name}
                </h2>
                <h5>{ResearchDetailQuery?.data?.code}</h5>
            </div>
        </div>

        {!ResearchDetailQuery?.data?.group?.students[0]?.points?.find(p => p.typePoint.id === params.type) && <Button onClick={() => { setStatePage(STATUS_PAGE.INSERT) }} label="Nhập điểm" className="my-4" />}
        <DataTable
            value={ResearchDetailQuery?.data?.group?.students}
            rowHover={true}
            stripedRows={true}
            showGridlines={true}
            emptyMessage={'list_empty'}

        >


            {fields.map((field, index) => field.typeInput === "text"
                || statePage === STATUS_PAGE.READ_ONLY || field.numberID !== params.type ? < Column
                key={index}
                alignHeader='center'
                headerStyle={{
                    background: 'var(--bluegray-100)',
                    color: 'var(--bluegray-900)',
                    whiteSpace: 'nowrap',
                }}
                field={field.code}
                header={field.field}
            /> : <Column
                key={index}
                alignHeader='center'
                headerStyle={{
                    background: 'var(--bluegray-100)',
                    color: 'var(--bluegray-900)',
                    whiteSpace: 'nowrap',
                }}
                field={field.code}
                header={field.field}
                body={(rowData) => renderInput(rowData, field.code)}

            />)}


        </DataTable>
        {statePage === STATUS_PAGE.INSERT && <Button onClick={insertPoint} label="Xác nhận" className="my-4" />}

    </div>
}