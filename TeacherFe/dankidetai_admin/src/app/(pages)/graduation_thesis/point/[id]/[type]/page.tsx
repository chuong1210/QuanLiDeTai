"use client"

import API from "@/assets/configs/api";
import { typePoinsE, typeTeacherReSearch } from "@/assets/configs/general";
import { ACCESS_TOKEN } from "@/assets/configs/request";
import { cookies } from "@/assets/helpers";
import * as request from "@/assets/helpers/request";
import { ConfirmModalRefType } from "@/assets/types/modal";
import { InputNumber } from "@/resources/components/form";
import Confirm from "@/resources/components/UI/Confirm";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import { cloneDeep } from "lodash";
import { useParams } from 'next/navigation'
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { DataTable } from "primereact/datatable";
import { Row } from "primereact/row";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
interface fieldsType {
    field: string;
    code: string;// 'code' | "name" | "POINT_INSTRUCTORS.point" | "POINT_THESIS_ADVISOR.point" | "POINT_AVG";
    typeInput: string;
    numberID: string;
    ownerID?: string;
}
export const fields: fieldsType[] = [
    { field: "mssv", code: "code", typeInput: "text", numberID: "0" },
    { field: "Tên", code: "name", typeInput: "text", numberID: "0" },
    { field: "Điểm hướng dẫn", code: "POINT_THESIS_ADVISOR.point", typeInput: "number", numberID: "1" },
    { field: "Điểm phản biện", code: "POINT_INSTRUCTORS.point", typeInput: "number", numberID: "2" },
    { field: "Điểm trung bình", code: "POINT_AVG", typeInput: "text", numberID: "0" },
]
interface IpointInsert {
    studentId: string,
    point: Ipoint
}

const STATUS_PAGE = {
    READ_ONLY: "readOnly",
    INSERT: "insert",
    UPDATE: "update",
}

export default function Page() {

    const params = useParams<{ id: string; type: string }>()
    const [statePage, setStatePage] = useState(STATUS_PAGE.READ_ONLY)
    const [points, setPoints] = useState<IpointInsert[]>([])
    const confirmModalRef = useRef<ConfirmModalRefType>(null);
    const [teacherID, setTeacherID] = useState<string>()


    const transformStudents = (student: StudentType) => {
        // Tạo các thuộc tính teacher_<teacherId> dựa trên danh sách points
        const teacherPoints = student?.points?.reduce((acc: any, point) => {
            const teacherKey = `teacher_${point.teacherId}`;
            acc[teacherKey] = point.point; // Lấy điểm của giảng viên
            return acc;
        }, {});

        // Trả về dữ liệu sinh viên với các thuộc tính mới
        return {
            ...teacherPoints
        };
    };

    const ResearchDetailQuery = useQuery<ReSearchType, AxiosError<ResponseType>>({

        queryKey: ['list-Research'],
        queryFn: async () => {
            const response: any = await request.get<ReSearchType>(`${API.reSearch.showDetail}${params.id}`);
            let responseData = response?.data ?? [];
            responseData.result.group.students = responseData?.result?.group?.students?.map((student: StudentType) => {
                // console.log(student.points)
                const POINT_INSTRUCTORS = student.points?.find(p => p.typePoint?.id === "1")
                const POINT_THESIS_ADVISOR = student.points?.find(p => p.typePoint?.id === "2")
                // Xử lý các điểm hội đồng (typePoint.id === "3")
                const councilPoints = student.points?.filter(p => p.typePoint?.id === "3") || [];
                const councilPointsMapped = councilPoints.reduce((acc: any, curr) => {
                    acc[`teacher_${curr.teacherId}`] = curr.point;
                    return acc;
                }, {});

                return {
                    ...student,
                    POINT_INSTRUCTORS: POINT_THESIS_ADVISOR,
                    POINT_THESIS_ADVISOR: POINT_INSTRUCTORS,
                    ...councilPointsMapped
                    // POINT_COUNCIL: POINT_COUNCIL,

                    //POINT_AVG: POINT_INSTRUCTORS && POINT_THESIS_ADVISOR ? ((POINT_THESIS_ADVISOR.point || 0 + POINT_INSTRUCTORS.point || 0) / 2) : undefined
                }
            })
            const listpoints = responseData?.result?.group?.students?.map
                ((studentt: StudentType) => {
                    return {
                        studentId: studentt.id,
                        point: studentt.points?.find(p => p.typePoint?.id === params.type)
                            ? studentt.points?.find(p => p.typePoint?.id === params.type) : undefined
                    }
                })
            if (listpoints.length > 0) {
                setPoints(listpoints)
            }
            let diffPoints = false
            responseData?.result?.group?.students.forEach((student: StudentType) => {
                const [point1, point2] = [typePoinsE.gvhuongdan, typePoinsE.gvphanbien].map(
                    type => student.points?.find((point) => point.typePoint?.id === type)?.point
                );

                if (point1 !== undefined && point2 !== undefined && Math.abs(point1 - point2) > 1) {
                    diffPoints = true;
                    //console.log(`Sinh viên ${student.name} có điểm ${typePoinsE.gvhuongdan} và ${typePoinsE.gvphanbien} cách nhau quá 1 điểm: ${point1} - ${point2}`);
                }
            });
            responseData.result.exitAdvisor = !!responseData?.result?.researchTeachers.find((chhecl: any) => chhecl.typeTeacher.name === typeTeacherReSearch.gvphanbien)
            responseData.result.exitCoucli = !!responseData?.result?.researchTeachers.find((chhecl: any) => chhecl.typeTeacher.name === typeTeacherReSearch.hoidong)
            responseData.result.differencePoint = diffPoints

            if (responseData?.result?.exitCoucli && !fields.find(field => field.numberID === "3")) {
                const councilTeachers = responseData?.result?.researchTeachers?.filter(
                    (teacher: any) => teacher.typeTeacher.name === "HỘI ĐỒNG GIẢNG VIÊN"
                );
                const newFields = councilTeachers.map((teacher: any, index: number) => ({
                    field: `Điểm hội đồng (${teacher.teacher.name})`,
                    code: `teacher_${teacher?.teacher?.id}`,
                    typeInput: "text",
                    numberID: "3",
                    ownerID: teacher?.teacher?.id
                }));
                fields.splice(fields.length - 1, 0, ...newFields);

            }
            console.log(responseData?.result, fields)
            return responseData?.result || [];
        },
    });

    const handleTemp = (studentId?: string, point?: number) => {
        if (!point || !studentId) return
        setPoints(prevPoint => {
            const newPoint = cloneDeep(prevPoint)
            const currentPoint = newPoint.find(p => p.studentId === studentId)
            console.log(currentPoint)
            if (!currentPoint) return newPoint
            if (!currentPoint.point) {
                currentPoint.point = {
                }
            }
            currentPoint.point.point = point
            return newPoint
        })
    }
    useEffect(() => {
        try {

            const decoded: any = jwtDecode(cookies.get(ACCESS_TOKEN) || "");
            console.log(decoded)
            setTeacherID(decoded.sub)
        } catch (e) {

        }
    }, [])

    const renderInput = (rowData: ReSearchType, field123123: string, ownerID?: string) => {
        console.log(rowData, field123123)
        return (
            <InputNumber
                id=""
                onChange={e => handleTemp(rowData?.id, e)}
                value={points.find(p => p.studentId === rowData?.id)?.point?.point}
            // onChange={(e) => { setPoints() }}
            //value={studentScores[rowData?.id]?.[field] || ""}
            //onChange={(e) => handleInputChange(rowdata?.id, field, e.target.value)}
            />
        );
    };

    const InsertPointsMutation = useMutation<any, AxiosError<ResponseType>, any>({
        mutationFn: (data123123: any) => {
            return request.post(API.point.insert, data123123);
        },
    });
    const ClickBroughtToCouncilMutation = useMutation<any, AxiosError<ResponseType>, any>({
        mutationFn: (id: string) => {

            return request.patch(`/researches/${id}/brought-to-the-council`)

        },
    });
    const handleClickBroughtToCouncil = (id: string) => {
        ClickBroughtToCouncilMutation.mutate(id, {
            onSuccess: (response: any) => {
                close();
                toast.success("Đưa ra hội đồng hoàn tất");
                ResearchDetailQuery.refetch()
            },
        })
    }
    const insertPoint = async () => {
        const dataa = {
            typePointId: params.type,
            points: points.map(p => {
                return {
                    studentId: p.studentId,
                    point: p.point.point,
                }
            })
        }
        if (STATUS_PAGE.UPDATE) {
            // points.forEach(async record => {
            //     await request.update(API.point.update + record?.point?.id, { point: record?.point });
            // })
            // toast.success("Cập nhật điểm thành công");
            // ResearchDetailQuery.refetch();
            // setStatePage(STATUS_PAGE.READ_ONLY)
            // return
        }
        InsertPointsMutation.mutate(dataa, {
            onSuccess: (_: any) => {
                toast.success("Nhập điểm thành công");
                ResearchDetailQuery.refetch();
                setStatePage(STATUS_PAGE.READ_ONLY)
            },
        })
    }


    return <div className="container" style={{
        width: "75vw", maxWidth: "1000px",
        margin: "0 auto",
    }}>

        <Confirm
            ref={confirmModalRef}
            onAccept={handleClickBroughtToCouncil}
            acceptLabel={'confirm'}
            rejectLabel={'cancel'}
            type="comfirm"
        />
        {ResearchDetailQuery.data && <div />}
        <div style={{
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            paddingTop: "20%",

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
        <Button onClick={() => {
            if (points.length > 0) {
                setStatePage(STATUS_PAGE.UPDATE)
            } else {
                setStatePage(STATUS_PAGE.INSERT)
            }
        }} outlined icon="pi pi-pencil" label="Nhập điểm" className=" mx-1 my-4" />
        {!ResearchDetailQuery?.data?.exitCoucli && ResearchDetailQuery?.data?.differencePoint && params.type === typePoinsE.gvhuongdan && <Button onClick={(e) => {
            if (ResearchDetailQuery?.data?.id)
                confirmModalRef.current?.show?.(e, ResearchDetailQuery?.data?.id, `Bạn có chắc muốn đưa nhóm ra hội đồng`);
            //     handleClickBroughtToCouncil(ResearchDetailQuery?.data?.id)
        }} outlined label="Đưa ra hội đồng" className="mx-1 my-4" />}
        <div>

        </div>
        <div
            className='flex mx-auto' style={{
                // margin: "auto",
                // marginLeft: "4.7rem",
                maxWidth: "1000px",
                // justifyContent: "space-between",
                marginTop: "1rem"
            }}
        >
            <DataTable
                className="" style={{ width: '100%' }}
                value={ResearchDetailQuery?.data?.group?.students}
                rowHover={true}
                stripedRows={true}
                showGridlines={true}
                emptyMessage={'list_empty'}
            >
                {fields.map((field, index) => statePage === STATUS_PAGE.READ_ONLY ||
                    field.numberID !== params.type ||
                    field.ownerID && field.ownerID !== teacherID
                    ? < Column
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
                        body={(rowData) => renderInput(rowData, field.code, field.numberID === "3" ? field?.ownerID : undefined)}

                    />)}
            </DataTable>
        </div>
        {statePage !== STATUS_PAGE.READ_ONLY && <Button onClick={insertPoint} label="Xác nhận" className="my-4" />}
    </div>
}