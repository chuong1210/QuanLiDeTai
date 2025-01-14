

"use client";

import API from '@/assets/configs/api';
import { request } from '@/assets/helpers/request';
import { InputText } from '@/resources/components/form';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Fieldset } from 'primereact/fieldset';
import { Knob } from 'primereact/knob';
import { classNames } from 'primereact/utils';

export default function Page({ params: { id } }: { params: { id: string } }) {


    const MyJobDetailQuery = useQuery<JobType, AxiosError<ResponseType>>({
        queryKey: ['job', id],
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const response = await request.get<JobType[]>(`${API.job.ShowJobDetail}${id}`);
            let responseData: any = response.data ?? [];
            return responseData?.result;
        }
    });




    // viết hàm sao
    return <div >
        {

            MyJobDetailQuery.data &&
            <div className='relative mt-2 h-auto card formgrid grid' style={{ minHeight: "50vh", maxWidth: "100vw" }}>
                <div className='col-12 flex flex-column gap-3 mb-2'>
                    <div className='flex' style={{ alignItems: "center" }}>
                        Tên giảng viên ra đề tài: <h3> {MyJobDetailQuery?.data?.senderName}</h3>
                    </div>

                    {/* <InputText
                        readOnly={true}
                        id='ten_gv_ra_nv'
                        value={MyJobDetailQuery?.data?.senderName}
                        label='Tên giảng viên ra đề tài'
                    /> */}
                </div>
                <div className='col-6 flex flex-column gap-3 mb-2'>
                    <InputText
                        readOnly={true}
                        id='ten_de_tai'
                        value={MyJobDetailQuery?.data?.name}
                        label='Tên đề tài'
                    />
                </div>

                <div className='col-6 flex flex-column gap-3 mb-2'>
                    <InputText
                        readOnly={true}
                        id='tg_start'
                        value={MyJobDetailQuery?.data?.from}
                        label='Thời gian bắt đầu'
                    />
                </div>

                <div className='col-6 flex flex-column gap-3 mb-2'>
                    <InputText
                        readOnly={true}
                        id='tg_end'
                        value={MyJobDetailQuery?.data?.due}
                        label='Thời Gian kết thúc'
                    />

                </div>
                <div className='col-6 flex flex-column gap-3 mb-2'>
                    <InputText
                        readOnly={true}
                        id='so_luong_yc'
                        value={MyJobDetailQuery?.data?.quantityRequirement.toString()}
                        label='Số yêu cầu'
                    />

                </div>
                <div className='col-12 flex flex-column gap-3 mb-2'>
                    <InputText
                        readOnly={true}
                        id='so_luong_ht'
                        value={"0"}
                        label='Số lượng giảng viên hoàn thành'
                    />

                </div>
                <div className='col-12 flex flex-column gap-3 mb-2'>
                    <label
                        className={classNames('font-medium block text-800')}
                    >
                        Chi tiết

                    </label>
                    <div
                        id='chi_tiet'
                        dangerouslySetInnerHTML={{ __html: MyJobDetailQuery?.data?.detail }}
                        style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '4px' }}
                    />
                </div>
                <Fieldset legend="Mức độ hoàn thành" toggleable className='col-12 flex flex-column gap-3 mb-2'>
                    <div>
                        {MyJobDetailQuery?.data?.jobTeacherDetails?.map(jobTeacher => {
                            return <div className="col-12 " key={jobTeacher?.teacher?.id} style={{ padding: '8px 0' }}>
                                <div className={`flex flex-column xl:flex-row xl:align-items-start p-4 gap-4 border-round `} style={{ border: '1px solid #ccc', position: 'relative' }}>
                                    <div className="flex flex-column align-items-center sm:align-items-start gap-3 col-8">
                                        <div
                                            className="text-2xl font-bold text-800"
                                            style={{ width: '100%', wordWrap: 'break-word', wordBreak: 'break-word', fontSize: '1.5rem' }} // Giảm font-size cho tiêu đề
                                        >
                                            <span style={{ display: 'block', minWidth: '50vw' }}>
                                                {jobTeacher?.teacher?.name} Mã số: {jobTeacher?.teacher?.code}
                                            </span>
                                        </div>
                                        <div className="flex align-items-center gap-3" style={{ fontSize: '1rem' }}> {/* Giảm font-size cho các thông tin khác */}
                                            <span className="flex align-items-center gap-2">
                                                <span className="font-semibold">Trạng thái: {jobTeacher?.isCompleted === 1 ? "Hoàn thành" : "Chưa hoàn thành"}</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        {jobTeacher.quantityCompleted > MyJobDetailQuery?.data?.quantityRequirement ?
                                            <div>
                                                <Knob value={MyJobDetailQuery?.data?.quantityRequirement} max={MyJobDetailQuery?.data?.quantityRequirement} readOnly />
                                                <h4 className="font-semibold text-center">{jobTeacher.quantityCompleted}/{MyJobDetailQuery?.data?.quantityRequirement}</h4>
                                            </div>

                                            :
                                            <div>
                                                <Knob value={jobTeacher.quantityCompleted} max={MyJobDetailQuery?.data?.quantityRequirement} readOnly />
                                                <h4 className="font-semibold text-center">{jobTeacher.quantityCompleted}/{MyJobDetailQuery?.data?.quantityRequirement}</h4>
                                            </div>

                                        }

                                    </div>

                                </div>
                            </div >
                        })}
                    </div>
                </Fieldset>
            </div>
        }
    </div>
}
