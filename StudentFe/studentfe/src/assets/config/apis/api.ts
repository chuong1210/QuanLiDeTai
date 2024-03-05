const API = {
    auth: {
        // sign_in: '/account/login',
        sign_in: '/log-in',

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

        group: '/group',

        thesis: '/thesis',
        // register_topic: '/thesis/listThesisRegistration',
        register_topic: '/subjects/listTopicRegistration',


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
        group: '/group/detail',
        topic: '/thesis/detail',
        job: '/job/detail',
        schedule: '/reportSchedule/detail',
    },

    post: {
        register_topic: '/topicRegistration',
        google_drive: '/googleDrive',
        change_invite_status: '/invitation/changeStatus',
    },
    change: //tu them
    {
        register_topic: '/topicRegistration',
        register_thesis:'/thesisRegistration',
        register_project:'/projectRegistration',

    }
};

export { API };
