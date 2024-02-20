"use client"
import { Dropdown } from "@/resources/components/form";
import { MultiSelect } from "@/resources/components/form/MultiSelect";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import * as request from "@/assets/helpers/request"
import API from "@/assets/configs/api";
import { Paginator } from "primereact/paginator";
export default function Home() {

  const { data, isError, isFetching }: UseQueryResult<{ status: number, data: [] }, Error> = useQuery<any, AxiosError<ResponseType>>({
    queryKey: ['teachers', 'list'],
    queryFn: async () => {
      //const response = await fetch(`https://api.apis.guru/v2/list.json`)
      const response = await request.get("https://api.apis.guru/v2/list.json")
      console.log(response)
      return response || [];
    },
  });
  // console.log(data)
  return (
    <div>
      {/* <h1>homePage</h1>
      <MultiSelect
        id="drop"
        label="multiselect"
        value={["hienlazada", "hienlazada22"]}
        options={[{ label: "hienlazada", value: "hienlazada", },
        { label: "hienlazada1", value: "hienlazada11", },
        { label: "hienlazada2", value: "hienlazada22", }
        ]}
      />
      <Dropdown
        id="drop"
        label="dropdown"
        options={[{ label: "hienlazada", value: "hienlazada", },
        { label: "hienlazada1", value: "hienlazada11", },
        { label: "hienlazada2", value: "hienlazada22", }
        ]}
      /> */}

      {/* {teacherQuery.data} */}

      <Paginator
        first={1}
        rows={30}
        totalRecords={10}
        rowsPerPageOptions={[10, 20, 30]}
        className='border-noround p-0'
      />
    </div>
  );
}
