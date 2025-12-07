
export const FormFieldType = {
    INPUT: 'INPUT',
    TEXTAREA: 'TEXTAREA',
    PHONE_INPUT: 'PHONE_INPUT',
    CEECKBOX: 'CHECKBOX',
    DATE_PICKER: 'DATE_PICKER',
    SELECT: 'SELECT',
    SKELETON: 'SKELETON',
}

export const APPOINTMENTTYPE = {
    VIDEO: 'VIDEO',
    CLINIC: 'CLINIC',
    CHAT: 'CHAT',
    PHONE: 'CALL'
}

export const appointmentTypes = [
    { title: 'clinic', value: APPOINTMENTTYPE.CLINIC, icon: 'hospital' },
    { title: 'video', value: APPOINTMENTTYPE.VIDEO, icon: 'video' },
    { title: 'chat', value: APPOINTMENTTYPE.CHAT, icon: 'message-circle-code' },
    { title: 'call', value: APPOINTMENTTYPE.cALL, icon: 'phone' }
]

export const SLOTS = {
    MORNING: 'morning',
    NOON: 'noon',
    EVENING: 'evening'
}

export const hospitalDefaultSettings = {
    open: true,
    timing: [
        { slot: 'morning', start: '09:00 AM', end: '01:00 PM', avaliable: false },
        { slot: 'noon', start: '01:00 PM', end: '05:00 PM', avaliable: false },
        { slot: 'evening', start: '05:30 PM', end: '09:30 PM', avaliable: false },
        { slot: 'night', start: '00:00 AM', end: '03:00 AM', avaliable: false }
    ],
    slotTime: 10,
    consultationOptions: [
        { type: 'clinic', status: false, charge: 250, icon: 'hospital' },
        { type: 'video', status: false, charge: 150, icon: 'video' },
        { type: 'chat', status: false, charge: 150, icon: 'message-circle-more' },
        { type: 'phone', status: false, charge: 150, icon: 'phone' },
    ]
}

export const appointmentStatus = [
    { title: "Scheduled", value: 'scheduled', icon: 'shield' },
    { title: "Confirmed", value: 'confirmed', icon: 'shield-plus' },
    { title: "In Progress", value: 'inprogress', icon: 'shield-user' },
    { title: "Completed", value: 'completed', icon: 'shield-check' },
    { title: "No Show", value: 'noshow', icon: 'shield-question-mark' },
    { title: "Cancelled", value: 'cancelled', icon: 'shield-x' }
]

export const status = [
    { title: "Scheduled", value: 'scheduled', icon: 'shield' },
    { title: "Confirmed", value: 'confirmed', icon: 'shield-plus' },
    { title: "In Progress", value: 'inprogress', icon: 'shield-user' },
    { title: "Completed", value: 'completed', icon: 'shield-check' },
    { title: "No Show", value: 'noshow', icon: 'shield-x' }
]

export const ORGTYPE = [
    { type: 'Department', value: 'department' },
    { type: 'Admin', value: 'admin' },
    { type: 'Nursing', value: 'nursing' },
    { type: 'Pharmacy', value: 'pharmacy' },
]