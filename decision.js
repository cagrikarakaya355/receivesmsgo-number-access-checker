/* MIT License. Copyright (c) 2026 ReceiveSMSGo. */
(function(){
"use strict";
/** Local decision aid. It does not query, reserve or verify a phone number. */
const accessQuestionOptions = {
    authorization: ['yes', 'unsure', 'no'],
    duration: ['once', 'days', 'ongoing'],
    reuse: ['no', 'yes', 'unsure'],
    channel: ['sms', 'voice', 'both'],
    important: ['no', 'yes'],
};
function completeAccessAnswers(value) {
    return Object.keys(accessQuestionOptions).every(key => accessQuestionOptions[key].includes(value[key]));
}
function assessNumberAccess(answers) {
    if (!completeAccessAnswers(answers))
        throw new Error('Answer every question using the listed choices.');
    const reasons = [];
    if (answers.authorization !== 'yes')
        reasons.push('permission');
    if (answers.channel !== 'sms')
        reasons.push('voice');
    if (answers.important === 'yes')
        reasons.push('important');
    if (answers.duration !== 'once')
        reasons.push('duration');
    if (answers.reuse !== 'no')
        reasons.push('reuse');
    const outcome = reasons.includes('permission') ? 'permission'
        : reasons.includes('voice') ? 'voice'
            : reasons.length ? 'durable' : 'temporary';
    return { outcome, reasons };
}

globalThis.NumberAccessDecision = {accessQuestionOptions,completeAccessAnswers,assessNumberAccess};
})();
