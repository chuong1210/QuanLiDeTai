import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { TableProps } from "@/assets/types/form";
import { classNames } from "primereact/utils";

const TableSchema = () =>
  // { value, showGridlines }: TableProps
  {
    const [products, setProducts] = useState([]);

    return (
      // <div classNameName="card">
      //   <DataTable value={value} showGridlines tableStyle={{ minWidth: "50rem" }}>
      //     <Column field="code" header="Ca học"></Column>
      //     <Column field="name" header="Sáng"></Column>
      //     <Column field="category" header="Category"></Column>
      //     <Column field="quantity" header="Quantity"></Column>
      //   </DataTable>
      // </div>
      //
      <div className="table-responsive">
        <table
          className="fl-table table table-bordered text-center no-footer dtr-inline"
          width="100%"
          role="grid"
        >
          <thead>
            <tr role="row">
              <th lang="lichtheotuan-cahoc">Ca học</th>
              <th>
                <span lang="lichtheotuan-mon">Thứ 2</span>04/03/2024
              </th>
              <th>
                <span lang="lichtheotuan-tue">Thứ 3</span>05/03/2024
              </th>
              <th>
                <span lang="lichtheotuan-wed">Thứ 4</span>06/03/2024
              </th>
              <th>
                <span lang="lichtheotuan-thu">Thứ 5</span>07/03/2024
              </th>
              <th>
                <span lang="lichtheotuan-fri">Thứ 6</span>08/03/2024
              </th>
              <th>
                <span lang="lichtheotuan-sat">Thứ 7</span>09/03/2024
              </th>
              <th>
                <span lang="lichtheotuan-sun">Chủ nhật</span>10/03/2024
              </th>
            </tr>
          </thead>
          <tbody>
            <tr role="row">
              <td lang="lichtheotuan-buoisang">
                <b>Sáng</b>
              </td>
              <td>
                <div
                  className="content color-lichhoc text-left text-align:left"
                  data-bg="996650"
                >
                  <b>
                    <a
                      href="/sinh-vien/page-lhp.html?g=dTcVgEv7UiaNkXTyJKTL3e9stcqHs8cMQKkv-_hZvuEtN1eoGjefs2iPuZt0cbyk4ZxZsvvLvnjjlNYjkiCIcqc8S0ktOFbDTU4MQBl94IXaz68zlFDMsHaMTqOM8ox6"
                      target="_blank"
                      className="text-decoration:none;color: #003763;"
                      data-toggle="tooltip"
                      data-placement="auto"
                      title=""
                      data-original-title=""
                    >
                      Lập trình hướng đối tượng
                    </a>
                  </b>

                  <p>13DHTH03 - 010110196203</p>

                  <p>
                    <span lang="lichtheotuan-tiet">Tiết</span>: 4 - 6
                  </p>

                  <p>
                    <span lang="giang-duong">Phòng</span>: A402 - 140 Lê Trọng
                    Tấn{" "}
                  </p>

                  <p>
                    <span lang="lichtheotuan-gv">GV</span>: Bùi Công Danh
                  </p>
                </div>
              </td>
              <td></td>
              <td>
                <div
                  className="content color-lichhoc text-left background-color:#92d6ff;border-color:#1da1f2;text-align:left"
                  data-bg="1017197"
                >
                  <b>
                    <a
                      href="/sinh-vien/page-lhp.html?g=ikLiDpZjrERfoOs54GONF9FXjMCNKDA-nfslohP4DIqLz-hgze9Tv-u9tC9zivsZMz5raUIwT7RkSHuzWwYMmUO6UL_FXRGb9GYhmsoVtkBN9O5jhPsYBwiU0g6Z4xkx"
                      target="_blank"
                      data-toggle="tooltip"
                      data-placement="auto"
                      title=""
                      data-original-title=""
                      className="text-decoration:none;color: #003763;"
                    >
                      Bảo mật máy tính
                    </a>
                  </b>

                  <p>13DHTH01 - 010110195405</p>

                  <p>
                    <span lang="lichtheotuan-tiet">Tiết</span>: 4 - 6
                  </p>

                  <p>
                    <span lang="giang-duong">Phòng</span> Zoom30{" "}
                  </p>

                  <p>
                    <span lang="lichtheotuan-gv">GV</span>: Huỳnh Thanh Tâm
                  </p>
                </div>
              </td>
              <td>
                <div
                  className="content color-lichhoc text-left background-color:#92d6ff;border-color:#1da1f2;text-align:left"
                  data-bg="1030766"
                >
                  <b>
                    <a
                      href="/sinh-vien/page-lhp.html?g=WaCBomuCxN_lOaVBrkywz4RN0ljE9Vn39ISgqoquC54mn4CoolA-N5KEvC_CseNrEwK2pZfb7noN-EKmNci2PdMZ57eCQZWpJW81YGbDASg8QwFF9mmjjWGYZU4EZA_X"
                      target="_blank"
                      data-toggle="tooltip"
                      data-placement="auto"
                      title=""
                      className="text-decoration:none;color: #003763;"
                      data-original-title=""
                    >
                      Lịch sử Đảng Cộng sản Việt Nam
                    </a>
                  </b>

                  <p>12DHTH10 - 010100162580</p>

                  <p>
                    <span lang="lichtheotuan-tiet">Tiết</span>: 4 - 6
                  </p>

                  <p>
                    <span lang="giang-duong">Phòng</span> Zoom51{" "}
                  </p>

                  <p>
                    <span lang="lichtheotuan-gv">GV</span>: Đào Duy Tùng
                  </p>
                </div>
              </td>
              <td></td>
              <td>
                <div
                  className="content color-lichhoc text-left text-align:left"
                  data-bg="989067"
                >
                  <b>
                    <a
                      href="/sinh-vien/page-lhp.html?g=wJF97h529LTHqRHImzpJxOWroXkSqy0BQkRmQin4Wf4F9bFSBjs4K5spZyDr88tMbQycZOCQTmaV_3r-pPiBbLBvfvgoJJh7sPR6clM9lEmr2BbKybRaiLxa8_oPlv19"
                      target="_blank"
                      className="text-decoration:none;color: #003763;"
                      data-toggle="tooltip"
                      data-placement="auto"
                      title=""
                      data-original-title=""
                    >
                      Anh văn 3
                    </a>
                  </b>

                  <p>13DHHH01 - 010110082401</p>

                  <p>
                    <span lang="lichtheotuan-tiet">Tiết</span>: 4 - 6
                  </p>

                  <p>
                    <span lang="giang-duong">Phòng</span>: A305 - 140 Lê Trọng
                    Tấn
                  </p>

                  <p>
                    <span lang="lichtheotuan-gv">GV</span>: Nguyễn Thị Kim Anh
                  </p>
                </div>
              </td>
              <td></td>
            </tr>
            <tr role="row">
              <td lang="lichtheotuan-buoichieu">
                <b>Chiều</b>
              </td>
              <td></td>
              <td>
                <div className="content color-lichhoc text-left text-align:left">
                  <b>
                    <a
                      href="/sinh-vien/page-lhp.html?g=ikLiDpZjrERfoOs54GONF1nBL28EFyGCdQhp5qlf88vUaoKiQphM481kRk790VMSaydpwHAvPHbZDGkKf9nrIjTgE22naWPMZhMKSSDCnInT40OUEgvAAL-efuu0aqrY"
                      target="_blank"
                      data-toggle="tooltip"
                      data-placement="auto"
                      title=""
                      className="text-decoration:none;color: #003763;"
                      data-original-title=""
                    >
                      Công nghệ phần mềm
                    </a>
                  </b>

                  <p>13DHBM03 - 010110196303</p>

                  <p>
                    <span lang="lichtheotuan-tiet">Tiết</span>: 7 - 9
                  </p>

                  <p>
                    <span lang="giang-duong">Phòng</span>: A403 - 140 Lê Trọng
                    Tấn
                  </p>

                  <p>
                    <span lang="lichtheotuan-gv">GV</span>: Ngô Minh Anh Thư
                  </p>
                </div>
              </td>
              <td></td>
              <td>
                <div className="content color-lichhoc text-left background-color:#71cb35;border-color:#c9d0db;text-align:left">
                  <b>
                    <a
                      href="/sinh-vien/page-lhp.html?g=Zy_R3ACFnz96BICtOsvHZaJO9E3W3wkDHd2qoHBuG0JkLaWcGGFLxMU9DGQPI8dxsnXDcY357g_Ln-COiMuCn24daQUmOz8JI5VjBsBrN3jVqJDvd21rijRpkV_Nk8GY"
                      target="_blank"
                      className="text-decoration:none;color: #003763;"
                      data-toggle="tooltip"
                      data-placement="auto"
                      title=""
                      data-original-title=""
                    >
                      Lập trình Python
                    </a>
                  </b>

                  <p>13DHBM02 - 010110195506</p>

                  <p>
                    <span lang="lichtheotuan-tiet">Tiết</span>: 7 - 12
                  </p>

                  <p>
                    <span lang="giang-duong">Phòng</span>: A211 - 140 Lê Trọng
                    Tấn
                  </p>

                  <p>
                    <span lang="lichtheotuan-gv">GV</span>: Đinh Nguyễn Trọng
                    Nghĩa
                  </p>
                </div>
              </td>
              <td></td>
              <td>
                <div className="content color-lichhoc text-left text-align:left">
                  <b>
                    <a
                      href="/sinh-vien/page-lhp.html?g=dTcVgEv7UiaNkXTyJKTL3XOFe_O8ludMYF7nf-DjKikS-kOQJk9K2HM3mnGNdRUsIH3VJT7i5kJhCMpL4F32DEB_phDFlICWkSZM3ODQBebrKfjdE51J0nThyYL8wvIw"
                      target="_blank"
                      data-toggle="tooltip"
                      data-placement="auto"
                      title=""
                      data-original-title=""
                    >
                      Hệ cơ sở dữ liệu
                    </a>
                  </b>

                  <p>13DHTH09 - 010110195813</p>

                  <p>
                    <span lang="lichtheotuan-tiet">Tiết</span>: 7 - 9
                  </p>

                  <p>
                    <span lang="giang-duong">Phòng</span>: F603 - 140 Lê Trọng
                    Tấn
                  </p>

                  <p>
                    <span lang="lichtheotuan-gv">GV</span>: Trần Trương Tuấn
                    Phát
                  </p>
                </div>
              </td>
              <td></td>
            </tr>
            <tr role="row">
              <td lang="lichtheotuan-buoitoi">
                <b>Tối</b>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

export { TableSchema };
