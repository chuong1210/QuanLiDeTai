import { InputFile } from "@/resources/components/form/inputFile";
import { Button } from "primereact/button";
import { useContext, useEffect, useState } from "react";
import { JobPageContext } from "../[id]/page";
import { FileType } from "@/assets/types/form";
import { ACCESS_TOKEN, DATA_RESULT, MODULE } from "@/assets/config";
import useCookies from "@/assets/useHooks/useCookies";
import { AuthType } from "@/assets/interface";
import { useUser } from "@/assets/context/UserContext";
import { useUserStore } from "@/assets/zustand/user";

interface YourExerciseProps {
  onSubmit: (_files: string[]) => void;
}

const YourExercise = ({ onSubmit }: YourExerciseProps) => {
  const { exercise, job, groupId } = useContext(JobPageContext);
  const [_files, setFiles] = useState<FileType[]>(exercise || []);
  //const [auth] = useCookies<AuthType>(DATA_RESULT);
  const { user } = useUserStore();

  useEffect(() => {
    if (exercise) {
      setFiles(exercise);
    }
  }, [exercise]);

  return (
    <div className="flex flex-column gap-4">
      <div className="p-4 bg-white shadow-2 border-round">
        <div className="flex align-items-center gap-2 mb-3">
          <p className="text-xl font-semibold flex-1">Bài tập của bạn</p>

          <Button
            label="Nộp bài"
            size="small"
            onClick={() => {
              if (_files) {
                onSubmit(_files?.map((t) => t.path));
              }
            }}
          />
        </div>

        <InputFile
          id="form_data_files"
          folder={`${MODULE.group}/${groupId}/${MODULE.job}/${job?.id}/${user?.id}_${user?.name}/`}
          fileClassName="col-12"
          value={exercise}
          multiple={true}
          hasDefault={false}
          showRemove={false}
          onChange={({ files }) => {
            if (files) {
              setFiles(files);
            }
          }}
        />
      </div>
    </div>
  );
};

export default YourExercise;
