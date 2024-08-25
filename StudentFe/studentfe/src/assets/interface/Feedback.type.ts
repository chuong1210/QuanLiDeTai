

import { ParamType } from '@/assets/types/httpRequest';
import { GeneralType } from './';
import { GroupType, MajorType, TeacherType } from '.';

interface FeedbackType extends GeneralType {
      message?:string;
      sendTo?:string;
      sendFrom?:string;
    
}


interface FeedbackParamType extends ParamType {
  
}

export type { FeedbackType, GeneralType };
