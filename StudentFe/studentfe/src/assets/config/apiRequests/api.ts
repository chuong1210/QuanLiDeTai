const API = {
    auth: {
        // sign_in: '/account/login',
        sign_in: 'auth/log-in',

    },
    file:{
        upload:'upload',
        export:'export'
    },

    list: {
        faculty: '/faculty',

        teacher: '/teacher',

        department: '/department',

        major: '/major',

        industry: '/industry',

        student: '/student',
        student_by_period: 'student/listStudentOfPeriodCurrent',

        registration_period: '/registrationPeriod',

        student_join: '/studentJoin',

        notification: '/notification',

        group: '/groups',
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
        group: '/groups/detail',
        topic: '/thesis/detail',
        job: '/job/detail',
        schedule: '/reportSchedule/detail',
        research: '/researches/showAll',
        student:'/student'
    },

    post: {
        register_research: 'researches/register',
        google_drive: '/googleDrive',
        change_invite_status: '/invitation/changeStatus',
        change_password: '/update/password',// tu them

    },
    delete:
    {
        cancel_research:'researches/cancel-registration'

    }
    ,
    put: 
    {
        research: '/researches',
        register_thesis:'/thesisRegistration',
        register_project:'/projectRegistration',

    }
};

export { API };
