const criticalMeter = async ({session_ip_address, session_userAgent, session_expires_at, session_is_revoked}, {user_ip_address, user_userAgent}) => {
    let criticalLevel = 0;
    const level = await userAgentController({session_userAgent, user_userAgent});
    criticalLevel += level;
    if(session_expires_at < Date.now()) criticalLevel += 20;
    if(session_is_revoked === true) criticalLevel += 20;
    if(session_ip_address != user_ip_address) criticalLevel += 10;

    switch (criticalLevel) {
        case criticalLevel <= 15:
            return false;
        case criticalLevel > 15:
            return true;
    }
}

const userAgentController = async ({session_userAgent, user_userAgent}) => {
    let criticalLevel = 0;

    if(!session_userAgent || !user_userAgent) return 20

    const sessionBrowser = session_userAgent.browser.name;
    const userBrowser = user_userAgent.browser.name;

    if(sessionBrowser != userBrowser) {
        criticalLevel += 5;
    }

    const sessionOs = session_userAgent.os.name;
    const userOs = user_userAgent.os.name;

    if(sessionOs != userOs) {
        criticalLevel += 5;
    }
    return criticalLevel
}