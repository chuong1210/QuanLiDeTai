const list = (params: any) => ({
    notification: ['notifications', 'list', params],
    faculty: ['faculties', 'list', params],
    industry: ['industries', 'list', params],
    major: ['majors', 'list', params],
    department: ['departments', 'list', params],
    teacher: ['teachers', 'list', params],
    student: ['students', 'list', params],
    registration_period: ['registration_periods', 'list', params],
    group: ['groups', 'list', params],
    thesis: ['thesis', 'list', params],
    role: ['roles', 'list', params],
    student_join: ['student_joins', 'list', params],
    register_topic: ['register_topics', 'list', params],
    invitation: ['invitations', 'list', params],
    student_by_period: ['student_by_periods', 'list', params],
    job: ['jobs', 'list', params],
    exchange: ['exchanges', 'list', params],
    job_result: ['job_results', 'list', params],
    feedback: ['feedbacks', 'list', params],
    schedule: ['schedules', 'list', params],
    point_by_thesis: ['point_by_thesis', 'list', params],
});

const detail = () => ({
    notification: ['notification_detail', 'detail'],
    group: ['group_detail', 'detail'],
    topic: ['topic', 'detail'],
    job: ['job', 'detail'],
    schedule: ['schedule', 'detail'],
});

export { list, detail };
