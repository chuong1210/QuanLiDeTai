const ROUTES = {
    base: 'http://localhost:8888',


    home: {
        index: '/home',
    },

    information: {
        notification: '/information/notification',
    },

    topic: {
        // group: '/topic/group',
        job_detail: '/topic/team/job',
        group: '/topic/team',
        student_join: '/topic/student_join',
        register_topic: '/topic/register',
        invite: '/topic/invite',
        schedule: '/topic/schedule',
    },

    external: {
        exercise: '/topic/group/exercise',
    },

    auth: {
        sign_in: '/login',
    },
    
    profile: {
        student: '/profile',
    },
};

export { ROUTES };
