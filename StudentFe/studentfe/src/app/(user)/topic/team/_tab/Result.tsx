import { useGetList } from "@/assets/useHooks/useGet";
import { PointParamType, PointType, TeacherType } from "@/assets/interface";
import { Loader } from "@/resources/components/UI";
import { useContext, useEffect, useState } from "react";
import { GroupPageContext } from "../[id]/page";

interface pointStudentResult {
  teacher: TeacherType;
  score: number;
  studentId: number;
}

const ResultTab = () => {
  const { topic, active, groupDetail } = useContext(GroupPageContext);
  const [pointStudentResult, setpointStudentResult] = useState<any[]>([]);
  const [teacherI, setTeacherI] = useState<string[]>([]);
  const [teacherR, setTeacherR] = useState<string[]>([]);
  const [teacherC, setTeacherC] = useState<string[]>([]);

  // const pointQuery = useGetList<PointType, PointParamType>({
  //   module: "point_by_thesis",
  //   enabled: active === "point",
  //   params: {
  //     thesisId: topic?.id,
  //   },
  // });

  // const result: PointType[][] = groupDetail.students.map((student) => {
  //   return student?.points
  //     ?.map((point) => ({
  //       teacherId: point.teacherId,
  //       point: point.point,
  //       studentJoinId: student.id,
  //       type: point.type,
  //     }))
  //     .filter(Boolean) || []; // Ensure no undefined values and return an empty array if points is undefined
  // });

  useEffect(() => {
    if (groupDetail?.students && groupDetail.students.length > 0) {
      let result: any[] = [];
      let _teacherI: string[] = [];
      let _teacherR: string[] = [];
      let _teacherC: string[] = [];

      groupDetail?.students?.forEach((student) => {
        const studentScores = student.points?.map((score) => ({
          teacherId: score.teacherId,
          teacherName: score.teacherId,
          score: score.point,
          type: score.type,
          studentId: student.studentJoinId,
        }));

        // Group by teacher type
        student.points?.forEach((score) => {
          if (score.teacherId) {
            if (score.type === "I") {
              _teacherI.push(score.teacherId.toString());
            } else if (score.type === "R") {
              _teacherR.push(score.teacherId.toString());
            } else if (score.type === "C") {
              _teacherC.push(score.teacherId.toString());
            }
          }
        });

        result.push({
          internalCode: student.id,
          name: student.name,
          avg: student.points,
          scores: studentScores,
        });
      });

      setpointStudentResult(result);
      setTeacherI([...new Set(_teacherI)]); // Unique teacher names
      setTeacherR([...new Set(_teacherR)]);
      setTeacherC([...new Set(_teacherC)]);
    }
  }, [groupDetail]);

  return (
    <div className="flex flex-column gap-3 bg-white border-round shadow-1 p-3">
      {/* <Loader show={!!groupDetail} /> */}

      <div className="border-round overflow-hidden shadow-3">
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th className="border-1 border-300 p-3 bg-primary" colSpan={2}>
                Thông tin sinh viên
              </th>
              {teacherI.length > 0 && (
                <th
                  className="border-1 border-300 p-3 bg-primary"
                  colSpan={teacherI.length}
                >
                  Điểm GVHD
                </th>
              )}
              {teacherR.length > 0 && (
                <th
                  className="border-1 border-300 p-3 bg-primary"
                  colSpan={teacherR.length}
                >
                  Điểm GVPB
                </th>
              )}
              {teacherC.length > 0 && (
                <th
                  className="border-1 border-300 p-3 bg-primary"
                  colSpan={teacherC.length}
                >
                  Điểm HĐ
                </th>
              )}
              <th className="border-1 border-300 p-3 bg-primary" rowSpan={2}>
                Điểm trung bình
              </th>
            </tr>
            <tr>
              <th className="border-1 border-300 p-3 bg-primary">
                Mã sinh viên
              </th>
              <th className="border-1 border-300 p-3 bg-primary">
                Tên sinh viên
              </th>
              {teacherI.map((name) => (
                <th className="border-1 border-300 p-3 bg-primary" key={name}>
                  {name}
                </th>
              ))}

              {/* {teacherR.map((name) => (
                  //       className="border-1 border-300 p-3 bg-primary"
                  //       key={name}
                  //     >
                  //       {name}
                  //     </th>
                  //   ));
                  // } */}
              {teacherR.map((name) => (
                <th className="border-1 border-300 p-3 bg-primary" key={name}>
                  {name}
                </th>
              ))}
              {teacherC.map((name) => (
                <th className="border-1 border-300 p-3 bg-primary" key={name}>
                  {name}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {pointStudentResult.map((result) => (
              <tr key={result.internalCode}>
                <td className="border-1 border-300 py-2 px-3 text-center">
                  {result.internalCode}
                </td>
                <td className="border-1 border-300 py-2 px-3 text-center">
                  {result.name}
                </td>
                {teacherI.map((teacherName) => {
                  const score = result.scores?.find(
                    (s: any) => s.teacherName === teacherName && s.type === "I"
                  );

                  return (
                    <td
                      className="border-1 border-300 py-2 px-3"
                      key={teacherName}
                    >
                      {score ? score.score : "-"}
                    </td>
                  );
                })}
                {teacherR.map((teacherName) => {
                  const score = result.scores?.find(
                    (s: any) => s.teacherName === teacherName && s.type === "R"
                  );
                  return (
                    <td
                      className="border-1 border-300 py-2 px-3"
                      key={teacherName}
                    >
                      {score ? score.score : "-"}
                    </td>
                  );
                })}

                {teacherC.map((teacherName) => {
                  const score = result.scores?.find(
                    (s: any) => s.teacherName === teacherName && s.type === "C"
                  );
                  return (
                    <td
                      className="border-1 border-300 py-2 px-3"
                      key={teacherName}
                    >
                      {score ? score.score : "-"}
                    </td>
                  );
                })}
                <td className="border-1 border-300 py-2 px-3 text-center">
                  {result.avg > 0 ? result.avg : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultTab;
