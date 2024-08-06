

import { ParamType } from '@/assets/types/httpRequest';
import { GeneralType } from './';
import { GroupType, MajorType, TeacherType } from '.';

interface FeedbackType extends GeneralType {
      message?:string;
      sendTo?:string;
      sendFrom?:string;
    
}

// * **'A'**:  Active or Available. This could mean the topic is open for students to choose.
// * **'AR'**:  Assigned or Reserved. This could mean the topic has been assigned to a specific student or group.
// * **'D'**:  Deleted or Discontinued. This could mean the topic is no longer available for selection.
interface FeedbackParamType extends ParamType {
  
}

export type { FeedbackType, GeneralType };
