const ROUTES = {
    base: 'http://localhost:8888',

    home: {
        index: '/home',
    },

    information: {
        notification: '/information/notification',
    },

    thesis: {
        group: '/thesis/group',
        student_join: '/thesis/student_join',
        register_topic: '/thesis/register_topic',
        invite: '/thesis/invite',
        job_detail: '/thesis/group/job',
        schedule: 'thesis/schedule',
    },

    external: {
        exercise: '/thesis/group/exercise',
    },

    auth: {
        sign_in: '/sign-in',
    },
};

export { ROUTES };
