const API = {
    auth: {
        sign_in: 'auth/log-in',
        refresh:'auth/refresh',
        sign_out:'auth/log-out'
    },
    file:{
        upload:'upload',
        export:'export'
    },

    list: {
        faculty: '/subjects/showAll-no-params',

        teacher: '/teacher',

        department: '/department',

        major: '/major',

        industry: '/industry',

        student: '/students/showAll',
        student_by_period: 'student/listStudentOfPeriodCurrent',

        registration_period: '/registrationPeriod',

        student_join: '/studentJoin',

        notification: '/notifications/showAll-invitation',

        group: '/groups/showAll',
        thesis: '/thesis',
        research: '/researches/showAll',


        invitation: '/invitation',

        job: '/job',

        exchange: '/exchange',

        job_result: '/jobResults',

        feedback: '/feedback',

        schedule: '/reportSchedule',

        point_by_thesis: '/point/thesis',
    },

    detail: {
        notification: '/notification/detail',
        group: '/groups/showInfo-my-group',
        topic: '/thesis/detail',
        job: '/job/detail',
        schedule: '/reportSchedule/detail',
        research: '/researches/showAll',
        student:'/students/getMyInfo',
        user:'/users/getMyInfo'
    },

    post: {
        register_research: 'researches/register',
        google_drive: '/googleDrive',
        change_invite_status: '/invitation/changeStatus',
        change_password: '/update/password',
        register_group:'/groups/insert',
        invitation:'notifications/insert-invitation'

    },
    delete:
    {
        cancel_research:'researches/cancel-registration',
        group:'groups/delete'

    }
    ,
    put: 
    {
        research: '/researches',
        register_thesis:'/thesisRegistration',
        register_project:'/projectRegistration',
        student:'/student/update',
        invitation:'notifications/reply-invitation',
        group:'groups/remove-member'



    }
};

export { API };
