"use client"
import { TabPanel, TabView } from 'primereact/tabview'
import React from 'react'
import PageNhomDetai from './nhomdetai'
import { typePoinsE } from '@/assets/configs/general'

export default function Page() {
    return (
        <TabView>
            <TabPanel header="Nhóm hướng dẫn">
                <PageNhomDetai type={typePoinsE.gvhuongdan} title='Nhóm hướng dẫn' />
            </TabPanel>
            <TabPanel header="Nhóm phản biện" >
                <PageNhomDetai type={typePoinsE.gvphanbien} title='Nhóm phản biện' />
            </TabPanel>
            <TabPanel header="Hội đồng" >
                <PageNhomDetai type={typePoinsE.hoidong} title='Hội đồng' />
            </TabPanel>
        </TabView>
    )
}
