

"use client";

import API from '@/assets/configs/api';
import { request } from '@/assets/helpers/request';
import { InputText } from '@/resources/components/form';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export default function Page({ params: { id } }: { params: { id: string } }) {


    const MyJobDetailQuery = useQuery<JobType, AxiosError<ResponseType>>({
        queryKey: ['job', id],
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const response = await request.get<JobType[]>(`${API.job.ShowJobDetail}${id}`);
            let responseData: any = response.data ?? [];
            return responseData.result;
        }
    });




    // viết hàm sao
    return <div >
        {

            MyJobDetailQuery.data &&
            <div className='relative mt-2 h-auto card formgrid grid' style={{ minHeight: "50vh", maxWidth: "100vw" }}>
                <div className='col-6 flex flex-column gap-3 mb-2'>
                    <InputText
                        readOnly={true}
                        id='ten_de_tai'
                        value={MyJobDetailQuery?.data?.name}
                        label='Tên đề tài'


                    />
                </div>
                {/* <div className='col-6 flex flex-column gap-3 mb-2'>
                    <InputText
                        readOnly={true}
                        id='note'
                        value={""}
                        label='Ghi chú'

                    />
                </div> */}
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
                    <div
                        id='chi_tiet'
                        dangerouslySetInnerHTML={{ __html: MyJobDetailQuery?.data?.description }}
                        style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '4px' }}
                    />
                </div>
                <div className='col-12 flex flex-column gap-3 mb-2'>
                    <div
                        id='chi_tiet'
                        dangerouslySetInnerHTML={{ __html: MyJobDetailQuery?.data?.detail }}
                        style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '4px' }}
                    />
                </div>
            </div>
        }
    </div>
}
