import { InputFile } from "@/resources/components/form/InputFile";
import { Button } from "primereact/button";
import { useContext, useEffect, useState } from "react";
import { JobPageContext } from "../[id]/page";
import { FileType } from "@/assets/types/form";
import { AUTH_TOKEN, MODULE } from "@/assets/config";
import useCookies from "@/assets/useHooks/useCookies";
import { AuthType } from "@/assets/interface";

interface YourExerciseProps {
  onSubmit: (_files: string[]) => void;
}

const YourExercise = ({ onSubmit }: YourExerciseProps) => {
  const { exercise, job, groupId } = useContext(JobPageContext);
  const [_files, setFiles] = useState<FileType[]>(exercise || []);
  const [auth] = useCookies<AuthType>(AUTH_TOKEN);

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
          folder={`${MODULE.group}/${groupId}/${MODULE.job}/${job?.id}/${auth?.customer.Id}_${auth?.customer.Name}/`}
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
