import { useGetList } from "@/assets/useHooks/useGet";
import { PointParamType, PointType, TeacherType } from "@/assets/interface";
import { Loader } from "@/resources/components/UI";
import { useContext, useEffect, useState } from "react";
import { GroupPageContext } from "../[id]/page";

interface TeacherResult {
  teacher: TeacherType;
  score: number;
  studentId: number;
}

const ResultTab = () => {
  const { topic, active } = useContext(GroupPageContext);
  const [teacherResult, setTeacherResult] = useState<any[]>([]);
  const [teacherI, setTeacherI] = useState<string[]>([]);
  const [teacherR, setTeacherR] = useState<string[]>([]);
  const [teacherC, setTeacherC] = useState<string[]>([]);

  const pointQuery = useGetList<PointType, PointParamType>({
    module: "point_by_thesis",
    enabled: active === "point",
    params: {
      thesisId: topic?.id,
    },
  });

  useEffect(() => {
    if (pointQuery.response?.data) {
      let result: any[] = [];
      let _teacherI: string[] = [];
      let _teacherR: string[] = [];
      let _teacherC: string[] = [];

      pointQuery.response?.data.forEach((t) => {
        _teacherI = [];
        _teacherR = [];
        _teacherC = [];

        result.push({
          internalCode: t.studentJoin?.student.internalCode,
          name: t.studentJoin?.student.name,
          avg: t.averageScore,
          scores: t.scores?.map((score) => ({
            teacherId: score.teacher.id,
            score: score.score,
            studentId: t.studentJoinId,
          })),
        });

        t.scores?.forEach((score) => {
          if (score.type === "I") {
            _teacherI.push(score.teacher.name!);
          }
          if (score.type === "R") {
            _teacherR.push(score.teacher.name!);
          }
          if (score.type === "C") {
            _teacherC.push(score.teacher.name!);
          }
        });
      });

      setTeacherResult(result);

      setTeacherI(_teacherI);
      setTeacherR(_teacherR);
      setTeacherC(_teacherC);
    }
  }, [pointQuery.response?.data]);

  return (
    <div className="flex flex-column gap-3 bg-white border-round shadow-1 p-3">
      <Loader show={pointQuery.isFetching} />

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
            {teacherResult.map((result) => (
              <tr key={result.internalCode}>
                <td className="border-1 border-300 py-2 px-3">
                  {result.internalCode}
                </td>
                <td className="border-1 border-300 py-2 px-3">{result.name}</td>
                {result?.scores?.map((field: any) => (
                  <td
                    className="border-1 border-300 py-2 px-3"
                    key={field.teacherId}
                  >
                    <p className="text-center">
                      {field.score > 0 ? field.score : "-"}
                    </p>
                  </td>
                ))}
                <td className="border-1 border-300 py-2 px-3">
                  <p className="text-center">
                    {result.avg > 0 ? result.avg : "-"}
                  </p>
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
