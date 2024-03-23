const ROUTES = {
    base: 'http://localhost:8888',


    home: {
        index: '/home',
    },

    information: {
        notification: '/information/notification',
    },

    topic: {
        group: '/topic/group',
        student_join: '/topic/student_join',
        register_topic: '/topic/register_topic',
        invite: '/topic/invite',
        job_detail: '/topic/group/job',
        schedule: 'topic/schedule',
    },

    external: {
        exercise: '/topic/group/exercise',
    },

    auth: {
        sign_in: '/sign-in',
    },
};

export { ROUTES };
